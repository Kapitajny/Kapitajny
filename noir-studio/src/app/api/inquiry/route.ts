import { toInquiryInput, validateInquiry } from "@/lib/inquiry";

/**
 * POST /api/inquiry  { name, email, session, date, message }
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
  if (rateLimited(request)) return error(429, "RATE_LIMITED", "Too many attempts. Wait a minute and try again.");

  let body: unknown;
  try {
    const text = await request.text();
    if (text.length > 10_000) return error(413, "TOO_LARGE", "Your message is too long.");
    body = JSON.parse(text);
  } catch {
    return error(400, "BAD_REQUEST", "The inquiry could not be read. Reload the page and try again.");
  }

  const input = toInquiryInput(body);
  const fields = validateInquiry(input);
  if (Object.keys(fields).length > 0) return error(422, "VALIDATION_ERROR", "Some fields need your attention.", fields);

  const webhookUrl = process.env.INQUIRY_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return error(503, "NOT_CONFIGURED", "This demo form is not connected to the studio inbox yet, so your inquiry was not sent.");
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
        source: "noir-studio-website",
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Inquiry webhook responded ${response.status}`);
    return Response.json({ ok: true });
  } catch (cause) {
    console.error("[inquiry]", cause);
    return error(502, "DELIVERY_FAILED", "Your inquiry could not be delivered. Try again in a few minutes.");
  }
}
