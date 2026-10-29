import { PAYMENT_METHODS, PAYMENT_SCENARIOS, type PaymentMethod, type PaymentScenario } from "@/lib/payments";
import { clientKey, jsonError, jsonOk, readJsonBody } from "@/lib/server/http";
import { payOrder } from "@/lib/server/orders";
import { rateLimit } from "@/lib/server/rate-limit";
import { readDemoSession } from "@/lib/server/session";

export async function POST(request: Request, ctx: RouteContext<"/api/demo/orders/[id]/payment">) {
  const limit = rateLimit(`payment:${clientKey(request)}`, 30, 10 * 60 * 1000);
  if (!limit.allowed) return jsonError(429, "Zbyt wiele prób płatności testowej. Spróbuj ponownie za kilka minut.");

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const { method, scenario } = parsed.body;
  if (typeof method !== "string" || !Object.hasOwn(PAYMENT_METHODS, method)) return jsonError(422, "Wybierz metodę płatności.");
  if (typeof scenario !== "string" || !Object.hasOwn(PAYMENT_SCENARIOS, scenario)) return jsonError(422, "Wybierz scenariusz testowy.");

  const { id } = await ctx.params;
  const result = await payOrder({
    id,
    sessionId: await readDemoSession(),
    method: method as PaymentMethod,
    scenario: scenario as PaymentScenario,
  });
  if (!result.ok) return jsonError(result.status, result.message);
  return jsonOk({ order: result.order, payment: result.payment });
}
