import { normalizeContact, validateContact } from "@/lib/contact";
import { contactChannel, deliverContact, newReference } from "@/lib/server/contact-delivery";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { siteConfig } from "@/config/site";

/**
 * POST /api/kontakt – zapytanie z formularza kontaktowego.
 * Odpowiedzi: 200 { ok, reference } | 422 walidacja | 429 limit | 503 brak konfiguracji | 502 błąd dostawcy.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "kontakt", 5, 10 * 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Wysłano zbyt wiele zapytań. Odczekaj kilka minut albo zadzwoń do nas.");
  }

  const body = await readJson(request, 12_000);
  if (!body || typeof body !== "object") {
    return errorResponse(400, "BAD_REQUEST", "Nieprawidłowe dane formularza.");
  }

  // Pole-pułapka na boty: wypełnione = spam. Odpowiadamy jak przy sukcesie, niczego nie wysyłając.
  const honeypot = (body as Record<string, unknown>).company_website;
  if (typeof honeypot === "string" && honeypot.trim() !== "") {
    return Response.json({ ok: true, reference: newReference() });
  }

  const input = normalizeContact(body);
  const errors = validateContact(input);
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: { code: "VALIDATION_ERROR", message: "Popraw zaznaczone pola formularza.", fields: errors } }, { status: 422 });
  }

  if (!contactChannel()) {
    return errorResponse(
      503,
      "NOT_CONFIGURED",
      `Formularz nie jest jeszcze podłączony do skrzynki odbiorczej, dlatego Twoje zapytanie NIE zostało wysłane. Zadzwoń pod numer ${siteConfig.contact.phoneDisplay} albo napisz na ${siteConfig.contact.email}.`,
    );
  }

  const reference = newReference();
  try {
    await deliverContact(input, reference);
    return Response.json({ ok: true, reference });
  } catch (error) {
    console.error("[kontakt]", error);
    return errorResponse(
      502,
      "DELIVERY_FAILED",
      `Nie udało się wysłać zapytania. Spróbuj ponownie za chwilę albo zadzwoń pod numer ${siteConfig.contact.phoneDisplay}.`,
    );
  }
}
