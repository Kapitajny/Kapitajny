import "server-only";

import { randomBytes } from "node:crypto";
import { UPLOAD_LIMITS } from "@/config/booking";
import { siteConfig } from "@/config/site";
import { IMAGE_EXT, IMAGE_MIME, sniffImage } from "@/lib/booking/files";
import { isLocale } from "@/i18n/config";
import { coerceBooking, normalizeBooking, todayInWarsaw, validateBooking } from "@/lib/booking/schema";
import { deliver, type Attachment } from "./delivery";
import { getDeliveryConfig, isDeliveryConfigured, type DeliveryConfig } from "./env";
import { clientIp, errorResponse, rateLimit } from "./http";

/** Minimalny czas wypełniania formularza — szybciej wypełniają go tylko automaty. */
export const MIN_FILL_MS = 4000;
const RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 };
const MULTIPART_OVERHEAD = 256 * 1024;

const CROCKFORD = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

export function createReference(now: Date = new Date()): string {
  const prefix = siteConfig.name.replace(/[^A-Za-z]/g, "").slice(0, 4).toUpperCase() || "BK";
  const date = todayInWarsaw(now).slice(2).replace(/-/g, "");
  const suffix = Array.from(randomBytes(4), (b) => CROCKFORD[b % 32]).join("");
  return `${prefix}-${date}-${suffix}`;
}

/** Zgłoszenia już przyjęte w tym procesie (ponowienie po zerwanym połączeniu nie wysyła duplikatu). */
const accepted = new Map<string, { reference: string; at: number }>();
const IDEMPOTENCY_TTL_MS = 60 * 60 * 1000;

function rememberAccepted(id: string, reference: string) {
  const now = Date.now();
  for (const [key, value] of accepted) if (now - value.at > IDEMPOTENCY_TTL_MS) accepted.delete(key);
  accepted.set(id, { reference, at: now });
}

async function verifyTurnstile(secret: string, token: string, ip: string): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token, remoteip: ip });
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(8000),
    });
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    return false;
  }
}

const SPAM_MESSAGE = "We couldn't verify this submission. Please wait a moment and try again, or contact the studio directly.";

/**
 * Obsługa `POST /api/booking` (multipart/form-data: `data`, `meta`, `references[]`).
 * Odpowiedzi błędów zawierają `code` (tłumaczony w interfejsie na język użytkownika) oraz
 * pomocniczy `message` po angielsku — tylko do logów i diagnostyki.
 */
export async function handleBookingRequest(request: Request, config: DeliveryConfig = getDeliveryConfig()): Promise<Response> {
  if (!isDeliveryConfigured(config)) {
    return errorResponse(503, {
      code: "not_configured",
      message: "Online booking isn't active yet, so your request was not sent. Please contact the studio directly.",
    });
  }

  if (!request.headers.get("content-type")?.includes("multipart/form-data")) {
    return errorResponse(415, { code: "unsupported_media_type", message: "Unsupported request format." });
  }

  const length = Number(request.headers.get("content-length") || 0);
  if (length > UPLOAD_LIMITS.maxTotalBytes + MULTIPART_OVERHEAD) {
    return errorResponse(413, {
      code: "too_large",
      message: "Your images are too large to send together. Remove an image or use smaller files.",
    });
  }

  const ip = clientIp(request);
  if (!rateLimit(`booking:${ip}`, RATE_LIMIT.limit, RATE_LIMIT.windowMs)) {
    return errorResponse(429, {
      code: "rate_limited",
      message: "Too many submissions from this connection. Please wait a few minutes and try again.",
    });
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return errorResponse(400, { code: "bad_request", message: "The form data could not be read. Please try again." });
  }

  let meta: { submissionId?: unknown; startedAt?: unknown; website?: unknown; turnstileToken?: unknown; lang?: unknown };
  let rawData: unknown;
  try {
    meta = JSON.parse(String(form.get("meta") ?? "{}"));
    rawData = JSON.parse(String(form.get("data") ?? "{}"));
  } catch {
    return errorResponse(400, { code: "bad_request", message: "The form data could not be read. Please try again." });
  }

  // Ochrona przed spamem: ukryte pole (honeypot) i minimalny czas wypełniania.
  const startedAt = typeof meta.startedAt === "number" ? meta.startedAt : 0;
  if ((typeof meta.website === "string" && meta.website.length > 0) || !startedAt || Date.now() - startedAt < MIN_FILL_MS) {
    return errorResponse(400, { code: "spam_suspected", message: SPAM_MESSAGE });
  }
  if (config.turnstileSecret && !(await verifyTurnstile(config.turnstileSecret, String(meta.turnstileToken ?? ""), ip))) {
    return errorResponse(400, { code: "verification_failed", message: SPAM_MESSAGE });
  }

  const submissionId =
    typeof meta.submissionId === "string" && /^[A-Za-z0-9-]{8,64}$/.test(meta.submissionId) ? meta.submissionId : null;
  if (submissionId && accepted.has(submissionId)) {
    return Response.json({ ok: true, reference: accepted.get(submissionId)!.reference }, { status: 200 });
  }

  const data = normalizeBooking(coerceBooking(rawData));
  const fieldErrors = validateBooking(data);
  if (Object.keys(fieldErrors).length > 0) {
    return errorResponse(422, {
      code: "validation_failed",
      message: "Some details need your attention.",
      fieldErrors: fieldErrors as Record<string, string>,
    });
  }

  // Załączniki: liczba, rozmiar i rzeczywisty format (sygnatura bajtów).
  const files = form.getAll("references").filter((value): value is File => typeof value === "object" && value !== null && "arrayBuffer" in value);
  if (files.length > UPLOAD_LIMITS.maxFiles) {
    return errorResponse(422, { code: "invalid_file", message: `You can attach up to ${UPLOAD_LIMITS.maxFiles} images.` });
  }
  const attachments: Attachment[] = [];
  let total = 0;
  for (const [index, file] of files.entries()) {
    if (file.size === 0 || file.size > UPLOAD_LIMITS.maxFileBytes) {
      return errorResponse(422, { code: "invalid_file", message: `Image ${index + 1} is empty or too large.` });
    }
    total += file.size;
    if (total > UPLOAD_LIMITS.maxTotalBytes) {
      return errorResponse(413, { code: "too_large", message: "Your images are too large to send together. Remove an image and try again." });
    }
    const content = Buffer.from(await file.arrayBuffer());
    const kind = sniffImage(content);
    if (!kind) {
      return errorResponse(422, { code: "invalid_file", message: `Image ${index + 1} isn't a JPG, PNG or WEBP file.` });
    }
    attachments.push({ filename: `reference-${index + 1}.${IMAGE_EXT[kind]}`, contentType: IMAGE_MIME[kind], content });
  }

  const reference = createReference();
  const { accepted: ok, results } = await deliver(config, {
    reference,
    submittedAt: new Date().toISOString(),
    locale: typeof meta.lang === "string" && isLocale(meta.lang) ? meta.lang : "pl",
    data,
    attachments,
  });

  for (const result of results) {
    if (!result.ok) console.error(`[booking] ${reference}: delivery via ${result.channel} failed: ${result.error}`);
  }

  if (!ok) {
    return errorResponse(502, {
      code: "delivery_failed",
      message: "Your request couldn't be delivered to the studio. Your answers are saved here — please try again in a moment.",
    });
  }

  if (submissionId) rememberAccepted(submissionId, reference);
  return Response.json({ ok: true, reference }, { status: 201, headers: { "Cache-Control": "no-store" } });
}
