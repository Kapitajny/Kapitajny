import { jsonError, jsonOk } from "@/lib/server/http";
import { getOrderForSession } from "@/lib/server/orders";
import { readDemoSession } from "@/lib/server/session";

export async function GET(_request: Request, ctx: RouteContext<"/api/demo/orders/[id]">) {
  const { id } = await ctx.params;
  const order = getOrderForSession(id, await readDemoSession());
  if (!order) return jsonError(404, "Nie znaleziono zamówienia w tej sesji demonstracyjnej.");
  return jsonOk({ order });
}
