import { hasCalculatorParams, parseCalculatorParams } from "@/lib/pricing/params";
import { clientKey, jsonError, jsonOk, readJsonBody } from "@/lib/server/http";
import { createOrder } from "@/lib/server/orders";
import { rateLimit } from "@/lib/server/rate-limit";
import { ensureDemoSession } from "@/lib/server/session";
import { parseOrderCustomer } from "@/lib/validation/order";

export async function POST(request: Request) {
  const limit = rateLimit(`order:${clientKey(request)}`, 20, 10 * 60 * 1000);
  if (!limit.allowed) return jsonError(429, "Zbyt wiele zamówień testowych. Spróbuj ponownie za kilka minut.");

  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const { body } = parsed;
  if (typeof body.website === "string" && body.website !== "") {
    return jsonError(400, "Nie udało się zweryfikować formularza.");
  }

  const customer = parseOrderCustomer((body.customer ?? {}) as Record<string, unknown>);
  if (!customer.ok) return jsonError(422, "Popraw zaznaczone pola.", { errors: customer.errors });

  // Kwoty liczy wyłącznie serwer – z identyfikatora pakietu albo konfiguracji kalkulatora.
  let calculator = null;
  if (typeof body.calculatorQuery === "string" && body.calculatorQuery.length < 600) {
    const params = new URLSearchParams(body.calculatorQuery);
    if (hasCalculatorParams(params)) calculator = parseCalculatorParams(params);
  }
  const packageId = typeof body.packageId === "string" ? body.packageId : null;

  const sessionId = await ensureDemoSession();
  const result = createOrder({ sessionId, packageId, calculator, customer: customer.data });
  if (!result.ok) return jsonError(422, result.message);
  return jsonOk({ order: result.order }, 201);
}
