import { siteConfig } from "@/config/site";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { forwardToWebhook } from "@/lib/server/webhook";
import { validateEmail } from "@/lib/validation";

/**
 * POST /api/newsletter  { email, consent: true }
 *
 * Adres jest przekazywany do zewnętrznego systemu mailingowego przez webhook
 * (NEWSLETTER_WEBHOOK_URL – np. scenariusz Make/Zapier albo endpoint dostawcy).
 * Bez tej konfiguracji NIE zapisujemy adresu i jasno informujemy o tym użytkownika.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "newsletter", 5, 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.");
  }
  const body = (await readJson(request, 2_000)) as { email?: unknown; consent?: unknown } | undefined;
  const emailError = validateEmail(body?.email);
  if (emailError) return errorResponse(422, "VALIDATION_ERROR", emailError, "email");
  if (body?.consent !== true) {
    return errorResponse(422, "VALIDATION_ERROR", "Zaznacz zgodę na otrzymywanie newslettera.", "consent");
  }

  const result = await forwardToWebhook("NEWSLETTER_WEBHOOK_URL", "NEWSLETTER_WEBHOOK_SECRET", {
    email: (body.email as string).trim().toLowerCase(),
    consent: true,
    consentText: `Zgoda na otrzymywanie newslettera ${siteConfig.name}`,
    source: "website-newsletter",
  });
  if (result === "not-configured") {
    return errorResponse(503, "NEWSLETTER_NOT_CONFIGURED", "Newsletter nie jest jeszcze uruchomiony – Twój adres nie został zapisany.");
  }
  if (result === "failed") {
    return errorResponse(502, "PROVIDER_ERROR", "Nie udało się zapisać adresu. Spróbuj ponownie za kilka minut.");
  }
  return Response.json({ ok: true, message: "Zapisano. Sprawdź skrzynkę – mogła przyjść wiadomość z potwierdzeniem zapisu." });
}
