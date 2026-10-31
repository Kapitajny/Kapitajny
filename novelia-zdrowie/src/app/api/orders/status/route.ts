import { getSiteUrl } from "@/lib/server/env";
import { errorResponse, rateLimit } from "@/lib/server/http";
import { findOrderById, findOrderBySessionId } from "@/lib/server/orders";
import { toPublicOrder } from "@/lib/server/payments";

/**
 * GET /api/orders/status?session_id=cs_…  → status zamówienia z linkami do pobrania (po opłaceniu)
 * GET /api/orders/status?order=<uuid>     → sam status (strona anulowania; bez linków)
 *
 * Identyfikator sesji Stripe pojawia się wyłącznie w adresie powrotu po płatności, dlatego tylko on
 * uprawnia do otrzymania linków.
 */
export async function GET(request: Request) {
  if (!rateLimit(request, "status", 120, 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele zapytań.");
  const url = new URL(request.url);
  const sessionId = url.searchParams.get("session_id");
  const orderId = url.searchParams.get("order");

  if (sessionId && /^cs_[a-zA-Z0-9_]{10,200}$/.test(sessionId)) {
    const order = findOrderBySessionId(sessionId);
    if (!order) return errorResponse(404, "NOT_FOUND", "Nie znaleziono zamówienia.");
    return Response.json(toPublicOrder(order, getSiteUrl(request), true));
  }
  if (orderId && /^[0-9a-f-]{36}$/.test(orderId)) {
    const order = findOrderById(orderId);
    if (!order) return errorResponse(404, "NOT_FOUND", "Nie znaleziono zamówienia.");
    return Response.json(toPublicOrder(order, getSiteUrl(request), false));
  }
  return errorResponse(400, "INVALID_QUERY", "Brak identyfikatora zamówienia.");
}
