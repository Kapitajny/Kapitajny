import { downloadLinksForOrder } from "@/lib/server/downloads";
import { resendLinksEmail, sendEmail } from "@/lib/server/email";
import { getSiteUrl } from "@/lib/server/env";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { findOrderByNumber } from "@/lib/server/orders";
import { isValidEmail, normalizeEmail } from "@/lib/validation";

const GENERIC = "Jeśli podane dane pasują do opłaconego zamówienia, w ciągu kilku minut wyślemy nowe linki na adres e-mail użyty przy zakupie.";

/**
 * POST /api/downloads/resend { email, orderNumber }
 * Wysyła nowe linki do pobrania na adres z zamówienia. Odpowiedź jest zawsze taka sama,
 * aby nie ujawniać, czy dane zamówienie istnieje.
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "resend", 5, 10 * 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób. Spróbuj ponownie za kilka minut.");
  const body = (await readJson(request)) as { email?: unknown; orderNumber?: unknown } | undefined;
  const email = normalizeEmail(body?.email);
  const number = typeof body?.orderNumber === "string" ? body.orderNumber.trim().toUpperCase() : "";
  if (!isValidEmail(email)) return errorResponse(422, "VALIDATION_ERROR", "Podaj prawidłowy adres e-mail.", "email");
  if (!/^NZ-[A-Z0-9]{6}$/.test(number)) return errorResponse(422, "VALIDATION_ERROR", "Numer zamówienia ma postać NZ-XXXXXX.", "orderNumber");

  const order = findOrderByNumber(number);
  if (order && order.status === "paid" && order.customerEmail === email) {
    const site = getSiteUrl(request);
    const result = await sendEmail(resendLinksEmail(order, downloadLinksForOrder(order, site), site));
    if (!result.sent) console.warn("[resend] Nie wysłano e-maila:", result.error);
  }
  return Response.json({ message: GENERIC });
}
