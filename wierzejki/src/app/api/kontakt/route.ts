import { parseContactPayload, validateContact } from "@/lib/contact";
import { deliverContact, isContactConfigured } from "@/lib/server/delivery";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";

/**
 * POST /api/kontakt – przyjmuje wiadomość z formularza, waliduje ją ponownie na serwerze
 * i przekazuje do skonfigurowanego kanału (patrz `lib/server/delivery.ts`).
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "kontakt", 5, 10 * 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Wysłano zbyt wiele wiadomości. Spróbuj ponownie za kilka minut albo zadzwoń.");
  }

  const body = await readJson(request, 16_000);
  if (body === undefined) return errorResponse(400, "BAD_REQUEST", "Nieprawidłowe dane formularza.");

  const data = parseContactPayload(body);
  // Boty wypełniają ukryte pole – odpowiadamy neutralnie, nic nie wysyłając.
  if (data.website) return Response.json({ ok: true });

  const errors = validateContact(data);
  if (Object.keys(errors).length > 0) {
    return Response.json({ error: { code: "VALIDATION_ERROR", message: "Popraw zaznaczone pola.", fields: errors } }, { status: 422 });
  }

  if (!isContactConfigured()) {
    return errorResponse(
      503,
      "CONTACT_NOT_CONFIGURED",
      "Formularz działa w trybie demonstracyjnym i nie wysyła wiadomości. Skontaktuj się z nami telefonicznie lub e-mailem.",
    );
  }

  try {
    await deliverContact(data);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[kontakt]", error);
    return errorResponse(502, "DELIVERY_FAILED", "Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę albo zadzwoń do sekretariatu.");
  }
}
