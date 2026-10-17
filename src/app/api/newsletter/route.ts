import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { validateEmail } from "@/lib/validation";

/**
 * POST /api/newsletter  { email, consent: true }
 *
 * Adres jest przekazywany do zewnętrznego systemu mailingowego przez webhook
 * (NEWSLETTER_WEBHOOK_URL – np. scenariusz Make/Zapier albo własny endpoint dostawcy).
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
    return errorResponse(422, "VALIDATION_ERROR", "Potrzebujemy Twojej zgody na otrzymywanie newslettera.", "consent");
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    return errorResponse(
      503,
      "NEWSLETTER_NOT_CONFIGURED",
      "Newsletter NOIR COFFEE jeszcze nie wystartował, więc nie zapisaliśmy Twojego adresu. Zajrzyj do nas wkrótce.",
    );
  }

  try {
    const secret = process.env.NEWSLETTER_WEBHOOK_SECRET?.trim();
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
      body: JSON.stringify({
        email: (body!.email as string).trim().toLowerCase(),
        consent: true,
        consentText: "Zgoda na otrzymywanie newslettera NOIR COFFEE",
        consentAt: new Date().toISOString(),
        source: "noir-coffee-website",
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Newsletter webhook responded ${response.status}`);
    return Response.json({ ok: true, message: "Dziękujemy! Twój adres został przekazany do naszego newslettera." });
  } catch (error) {
    console.error("[newsletter]", error);
    return errorResponse(502, "PROVIDER_ERROR", "Nie udało się zapisać adresu. Spróbuj ponownie za kilka minut.");
  }
}
