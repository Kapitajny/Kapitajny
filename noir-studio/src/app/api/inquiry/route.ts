import { DEFAULT_LOCALE, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { toInquiryInput, validateInquiry } from "@/lib/inquiry";

/**
 * POST /api/inquiry  { name, email, session, date, message, lang }
 *
 * `lang` („pl” albo „en”) wybiera język komunikatów zwracanych formularzowi.
 *
 * Zapytanie jest przekazywane na INQUIRY_WEBHOOK_URL (np. scenariusz Make/Zapier albo własny endpoint).
 * Bez tej konfiguracji NIE wysyłamy wiadomości i jasno informujemy o tym odwiedzającego.
 */

const buckets = new Map<string, number[]>();

/** Prosty limit żądań w pamięci procesu (na adres IP) – chroni przed przypadkowym spamem. */
function rateLimited(request: Request, limit = 5, windowMs = 60_000): boolean {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "local";
  const now = Date.now();
  const recent = (buckets.get(ip) ?? []).filter((t) => now - t < windowMs);
  recent.push(now);
  buckets.set(ip, recent);
  if (buckets.size > 5000) buckets.clear();
  return recent.length > limit;
}

function error(status: number, code: string, message: string, fields?: Record<string, string>) {
  return Response.json({ error: { code, message, ...(fields ? { fields } : {}) } }, { status });
}

export async function POST(request: Request) {
  // Język z nagłówka, dopóki nie odczytamy treści – błędy przed jej odczytaniem też są przetłumaczone.
  const headerLang = request.headers.get("x-site-lang");
  let form = getDictionary(isLocale(headerLang) ? headerLang : DEFAULT_LOCALE).form;
  if (rateLimited(request)) return error(429, "RATE_LIMITED", form.api.rateLimited);

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 10_000) return error(413, "TOO_LARGE", form.api.tooLarge);
    body = JSON.parse(text);
  } catch {
    return error(400, "BAD_REQUEST", form.api.badRequest);
  }

  const lang = (body as { lang?: unknown } | null)?.lang;
  if (isLocale(lang)) form = getDictionary(lang).form;

  const input = toInquiryInput(body);
  const fields = validateInquiry(input, form.errors);
  if (Object.keys(fields).length > 0) return error(422, "VALIDATION_ERROR", form.api.validation, fields);

  const webhookUrl = process.env.INQUIRY_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return error(503, "NOT_CONFIGURED", form.notConfigured);
  }

  try {
    const secret = process.env.INQUIRY_WEBHOOK_SECRET?.trim();
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        session: input.session,
        date: input.date || null,
        message: input.message.trim(),
        receivedAt: new Date().toISOString(),
        lang: isLocale(lang) ? lang : DEFAULT_LOCALE,
        source: "noir-studio-website",
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Inquiry webhook responded ${response.status}`);
    return Response.json({ ok: true });
  } catch (cause) {
    console.error("[inquiry]", cause);
    return error(502, "DELIVERY_FAILED", form.api.deliveryFailed);
  }
}
