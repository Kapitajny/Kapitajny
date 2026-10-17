import { getSiteUrl } from "@/lib/server/env";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { CheckoutError, startCheckout } from "@/lib/server/payments";
import { validateCheckout, type CheckoutRequest } from "@/lib/validation";

/**
 * POST /api/checkout
 * Waliduje koszyk, przelicza ceny z katalogu, tworzy zamówienie „oczekujące”
 * i zwraca adres sesji Stripe Checkout.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "checkout", 20, 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.");
  }

  const body = (await readJson(request)) as CheckoutRequest | undefined;
  if (!body || typeof body !== "object") return errorResponse(400, "INVALID_BODY", "Nieprawidłowe dane zamówienia.");

  const validation = validateCheckout(body);
  if (!validation.ok) return errorResponse(422, "VALIDATION_ERROR", validation.message, validation.field);

  try {
    const result = await startCheckout(validation.value, getSiteUrl(request));
    return Response.json(result);
  } catch (error) {
    if (error instanceof CheckoutError) {
      return Response.json(
        { error: { code: error.code, message: error.message }, ...(error.orderId ? { orderId: error.orderId } : {}) },
        { status: error.status },
      );
    }
    console.error("[checkout] Unexpected error", error);
    return errorResponse(500, "INTERNAL_ERROR", "Coś poszło nie tak po naszej stronie. Spróbuj ponownie za chwilę.");
  }
}
