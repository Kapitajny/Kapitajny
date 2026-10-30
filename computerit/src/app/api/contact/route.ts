import { validateContact } from "@/lib/contact";
import { deliverInquiry, isDeliveryConfigured } from "@/lib/server/delivery";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";

/**
 * POST /api/contact  { name, email, company?, projectType, budget, message, consent: true, website: "" }
 *
 * `website` to pole-pułapka niewidoczne dla ludzi – wypełniają je tylko boty.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "contact", 5, 10 * 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Wysłano już kilka zapytań z tego adresu. Spróbuj ponownie za kilka minut.");
  }

  const body = await readJson(request);
  if (body === undefined) return errorResponse(400, "BAD_REQUEST", "Nie udało się odczytać formularza. Odśwież stronę i spróbuj ponownie.");

  // Bot wypełnił pole-pułapkę: odpowiadamy jak przy sukcesie, ale niczego nie wysyłamy.
  if (typeof (body as { website?: unknown }).website === "string" && (body as { website: string }).website.trim() !== "") {
    return Response.json({ ok: true });
  }

  const result = validateContact(body);
  if (!result.ok) return errorResponse(422, "VALIDATION_ERROR", "Popraw zaznaczone pola.", result.errors);

  if (!isDeliveryConfigured()) {
    return errorResponse(
      503,
      "FORM_NOT_CONFIGURED",
      "Formularz nie jest jeszcze podłączony do skrzynki odbiorczej, więc wiadomość nie została wysłana.",
    );
  }

  try {
    await deliverInquiry(result.data);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact]", error);
    return errorResponse(502, "DELIVERY_FAILED", "Nie udało się wysłać zapytania. Spróbuj ponownie za kilka minut.");
  }
}
