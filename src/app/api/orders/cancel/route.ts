import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { cancelPendingOrder } from "@/lib/server/payments";

/**
 * POST /api/orders/cancel  { orderId }
 * Anuluje nieopłacone zamówienie i wygasza jego sesję płatności w Stripe.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "order-cancel", 20, 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób. Odczekaj chwilę.");
  }
  const body = (await readJson(request)) as { orderId?: unknown } | undefined;
  const orderId = body?.orderId;
  if (typeof orderId !== "string" || !/^[0-9a-f-]{36}$/i.test(orderId)) {
    return errorResponse(400, "INVALID_BODY", "Brak identyfikatora zamówienia.");
  }
  try {
    const status = await cancelPendingOrder(orderId);
    if (!status) return errorResponse(404, "NOT_FOUND", "Nie znaleźliśmy takiego zamówienia.");
    return Response.json({ status });
  } catch (error) {
    console.error("[cancel] Unexpected error", error);
    return errorResponse(502, "PROVIDER_ERROR", "Nie udało się anulować zamówienia. Spróbuj ponownie.");
  }
}
