import { validateContact, type ContactInput } from "@/lib/contact";
import { deliverContactRequest, getDeliveryConfig, isDeliveryConfigured } from "@/lib/server/contact-delivery";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";

/**
 * POST /api/contact – prośba o kontakt / umówienie wizyty.
 *
 * Odpowiedź `{ ok: true }` zwracamy wyłącznie wtedy, gdy zgłoszenie zostało faktycznie przekazane
 * do gabinetu (e-mail lub webhook – patrz lib/server/contact-delivery.ts). To NIE jest rezerwacja terminu.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "contact", 5, 10 * 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Wysłano zbyt wiele zgłoszeń. Odczekaj kilka minut albo zadzwoń do gabinetu.");
  }

  const body = (await readJson(request, 6_000)) as ContactInput | undefined;
  if (!body || typeof body !== "object") {
    return errorResponse(400, "BAD_REQUEST", "Nieprawidłowe dane formularza. Odśwież stronę i spróbuj ponownie.");
  }
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return errorResponse(400, "BAD_REQUEST", "Nie udało się wysłać formularza.");
  }

  const result = validateContact(body);
  if (!result.ok) {
    const [field, message] = Object.entries(result.errors)[0];
    return Response.json({ error: { code: "VALIDATION_ERROR", message, field, fields: result.errors } }, { status: 422 });
  }

  const config = getDeliveryConfig();
  if (!isDeliveryConfigured(config)) {
    return errorResponse(
      503,
      "CONTACT_NOT_CONFIGURED",
      "Formularz nie jest jeszcze podłączony, więc Twoje zgłoszenie nie zostało wysłane. Skontaktuj się z gabinetem telefonicznie lub mailowo.",
    );
  }

  try {
    await deliverContactRequest(result.value, config);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return errorResponse(502, "DELIVERY_FAILED", "Nie udało się wysłać zgłoszenia. Spróbuj ponownie za kilka minut lub zadzwoń do gabinetu.");
  }
}
