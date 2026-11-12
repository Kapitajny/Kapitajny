import { getContactWebhook } from "@/lib/server/env";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { sameOrigin } from "@/lib/server/auth";
import { cleanMultiline, cleanText, isEmail } from "@/lib/validation";

/**
 * POST /api/contact – przekazuje wiadomość na webhook (CONTACT_WEBHOOK_URL).
 * Bez skonfigurowanego webhooka zwraca 503 – formularz informuje wtedy, że wysyłka jest wyłączona.
 */
export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse(403, "forbidden", "Żądanie zostało odrzucone.");
  if (!rateLimit(request, "contact", 5, 10 * 60_000)) return errorResponse(429, "rate-limit", "Za dużo wiadomości. Spróbuj za kilka minut.");
  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  if (!body) return errorResponse(400, "invalid", "Nieprawidłowe dane formularza.");
  if (cleanText(body.website, 100)) return Response.json({ ok: true }); // pułapka na boty

  const name = cleanText(body.name, 80);
  const email = cleanText(body.email, 160).toLowerCase();
  const message = cleanMultiline(body.message, 3000);
  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Podaj imię.";
  if (!isEmail(email)) fields.email = "Podaj poprawny adres e-mail.";
  if (message.length < 10) fields.message = "Napisz kilka słów (min. 10 znaków).";
  if (body.consent !== true) fields.consent = "Zgoda jest potrzebna, żebyśmy mogli odpowiedzieć.";
  if (Object.keys(fields).length) return Response.json({ error: { code: "validation", message: "Popraw zaznaczone pola.", fields } }, { status: 422 });

  const webhook = getContactWebhook();
  if (!webhook) return errorResponse(503, "unconfigured", "Formularz nie jest jeszcze podłączony. Zadzwoń lub napisz e-mail.");

  try {
    const res = await fetch(webhook.url, {
      method: "POST",
      headers: { "content-type": "application/json", ...(webhook.secret ? { "x-webhook-secret": webhook.secret } : {}) },
      body: JSON.stringify({ type: "contact", name, email, message, sentAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch {
    return errorResponse(502, "delivery", "Nie udało się wysłać wiadomości. Spróbuj ponownie lub zadzwoń.");
  }
  return Response.json({ ok: true });
}
