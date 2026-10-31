import { CONTACT_TOPICS } from "@/data/contact";
import { contactEmail, isEmailConfigured, sendEmail } from "@/lib/server/email";
import { getSiteUrl } from "@/lib/server/env";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

const TOPICS: readonly string[] = CONTACT_TOPICS;

/** POST /api/contact – przekazuje wiadomość z formularza na adres sklepu (SHOP_NOTIFICATIONS_EMAIL). */
export async function POST(request: Request) {
  if (!rateLimit(request, "contact", 5, 10 * 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele wiadomości. Spróbuj ponownie później.");
  const body = (await readJson(request, 12_000)) as Record<string, unknown> | undefined;
  if (typeof body?.website === "string" && body.website) return Response.json({ ok: true }); // pułapka na boty
  const name = typeof body?.name === "string" ? body.name.trim().slice(0, 120) : "";
  const email = normalizeEmail(body?.email);
  const topic = TOPICS.includes(String(body?.topic)) ? String(body?.topic) : "Inny temat";
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (name.length < 2) return errorResponse(422, "VALIDATION_ERROR", "Podaj imię.", "name");
  if (!isValidEmail(email)) return errorResponse(422, "VALIDATION_ERROR", "Podaj prawidłowy adres e-mail.", "email");
  if (message.length < 10 || message.length > 5000) return errorResponse(422, "VALIDATION_ERROR", "Wiadomość powinna mieć od 10 do 5000 znaków.", "message");
  if (body?.consent !== true) return errorResponse(422, "VALIDATION_ERROR", "Potwierdź zapoznanie się z polityką prywatności.", "consent");

  const to = process.env.SHOP_NOTIFICATIONS_EMAIL?.trim();
  if (!to || !isEmailConfigured()) {
    return errorResponse(503, "NOT_CONFIGURED", "Formularz kontaktowy nie jest jeszcze aktywny. Skorzystaj z adresu e-mail podanego na tej stronie.");
  }
  const result = await sendEmail(contactEmail({ name, email, topic, message }, to, getSiteUrl(request)));
  if (!result.sent) return errorResponse(502, "SEND_FAILED", "Nie udało się wysłać wiadomości. Spróbuj ponownie później.");
  return Response.json({ ok: true });
}
