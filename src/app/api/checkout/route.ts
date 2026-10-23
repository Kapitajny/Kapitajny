import { getSiteUrl } from "@/lib/server/env";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { CheckoutError, startCheckout } from "@/lib/server/payments";
import { currentUser } from "@/lib/server/session";
import { validateCheckout, type CheckoutRequest } from "@/lib/validation";

/**
 * POST /api/checkout
 * Waliduje dane, przelicza ceny z katalogu, sprawdza stan magazynowy, tworzy zamówienie
 * i zwraca adres płatności Stripe Checkout (albo stronę potwierdzenia zamówienia demonstracyjnego).
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "checkout", 20, 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.");
  }

  const body = (await readJson(request)) as CheckoutRequest | undefined;
  if (!body || typeof body !== "object") return errorResponse(400, "INVALID_BODY", "Nieprawidłowe dane zamówienia.");

  const validation = validateCheckout(body);
  if (!validation.ok) {
    return Response.json(
      { error: { code: "VALIDATION_ERROR", message: validation.message, field: validation.field }, errors: validation.errors },
      { status: 422 },
    );
  }

  try {
    const user = await currentUser();
    const result = await startCheckout(validation.value, getSiteUrl(request), user?.id ?? null);
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
