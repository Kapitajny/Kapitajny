import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { cancelPendingOrder } from "@/lib/server/payments";

/** POST /api/orders/cancel – anuluje nieopłacone zamówienie (wygasza sesję płatności). */
export async function POST(request: Request) {
  if (!rateLimit(request, "cancel", 20, 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób.");
  const body = (await readJson(request)) as { orderId?: unknown } | undefined;
  const orderId = typeof body?.orderId === "string" ? body.orderId : "";
  if (!/^[0-9a-f-]{36}$/.test(orderId)) return errorResponse(400, "INVALID_BODY", "Nieprawidłowy identyfikator zamówienia.");
  const status = await cancelPendingOrder(orderId);
  if (!status) return errorResponse(404, "NOT_FOUND", "Nie znaleziono zamówienia.");
  return Response.json({ status });
}
