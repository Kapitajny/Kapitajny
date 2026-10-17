import { errorResponse, rateLimit } from "@/lib/server/http";
import { findOrderById, findOrderBySessionId } from "@/lib/server/orders";
import { toPublicOrder } from "@/lib/server/payments";

/**
 * GET /api/orders/status?session_id=cs_… lub ?order=<uuid>
 * Zwraca status zamówienia zapisany w bazie (aktualizowany wyłącznie przez webhook Stripe).
 */
export async function GET(request: Request) {
  if (!rateLimit(request, "order-status", 120, 60_000)) {
    return errorResponse(429, "RATE_LIMITED", "Zbyt wiele zapytań. Odczekaj chwilę.");
  }
  const params = new URL(request.url).searchParams;
  const sessionId = params.get("session_id");
  const orderId = params.get("order");

  let order = null;
  if (sessionId && /^cs_[A-Za-z0-9_]+$/.test(sessionId)) order = findOrderBySessionId(sessionId);
  else if (orderId && /^[0-9a-f-]{36}$/i.test(orderId)) order = findOrderById(orderId);
  else return errorResponse(400, "INVALID_QUERY", "Brak identyfikatora zamówienia.");

  if (!order) return errorResponse(404, "NOT_FOUND", "Nie znaleźliśmy takiego zamówienia.");
  return Response.json({ order: toPublicOrder(order) }, { headers: { "Cache-Control": "no-store" } });
}
