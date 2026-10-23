import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { forwardToWebhook } from "@/lib/server/webhook";
import { isContactTopic } from "@/lib/contact";
import { validateEmail, validateName, validateRequired } from "@/lib/validation";

/**
 * POST /api/contact  { name, email, topic, orderNumber?, message, consent: true }
 * Wiadomość trafia do CONTACT_WEBHOOK_URL (np. skrzynka obsługi przez Make/Zapier).
 * Bez konfiguracji nie udajemy wysłania – zwracamy jasny komunikat.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "contact", 5, 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele wiadomości. Odczekaj chwilę.");
  const body = (await readJson(request, 8_000)) as Record<string, unknown> | undefined;
  if (!body) return errorResponse(400, "INVALID_BODY", "Nieprawidłowe dane formularza.");

  const nameError = validateName(body.name, "imię");
  if (nameError) return errorResponse(422, "VALIDATION_ERROR", nameError, "name");
  const emailError = validateEmail(body.email);
  if (emailError) return errorResponse(422, "VALIDATION_ERROR", emailError, "email");
  if (!isContactTopic(body.topic)) return errorResponse(422, "VALIDATION_ERROR", "Wybierz temat wiadomości.", "topic");
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const messageError = validateRequired(message, "Napisz, w czym możemy pomóc.", 3000) ?? (message.length < 10 ? "Wiadomość powinna mieć co najmniej 10 znaków." : null);
  if (messageError) return errorResponse(422, "VALIDATION_ERROR", messageError, "message");
  if (body.consent !== true) return errorResponse(422, "VALIDATION_ERROR", "Zaznacz zgodę na przetwarzanie danych w celu odpowiedzi.", "consent");
  const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber.trim().slice(0, 20) : "";

  const result = await forwardToWebhook("CONTACT_WEBHOOK_URL", "CONTACT_WEBHOOK_SECRET", {
    type: "contact",
    name: (body.name as string).trim(),
    email: (body.email as string).trim().toLowerCase(),
    topic: body.topic,
    orderNumber: orderNumber || null,
    message,
  });
  if (result === "not-configured") {
    return errorResponse(503, "CONTACT_NOT_CONFIGURED", "Formularz kontaktowy nie jest jeszcze podłączony do skrzynki – wiadomość nie została wysłana.");
  }
  if (result === "failed") return errorResponse(502, "PROVIDER_ERROR", "Nie udało się wysłać wiadomości. Spróbuj ponownie za kilka minut.");
  return Response.json({ ok: true, message: "Wiadomość wysłana. Odpowiemy na podany adres e-mail." });
}
