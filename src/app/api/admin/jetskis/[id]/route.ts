import { parseJetski, parsePrices } from "@/lib/server/admin-input";
import { requireAdmin } from "@/lib/server/auth";
import { errorResponse, readJson } from "@/lib/server/http";
import { deleteJetski, getJetski, setPrices, updateJetski } from "@/lib/server/repo";

/** PUT – zapis danych skutera; jeśli w treści jest `prices`, zapisuje też cennik. */
export async function PUT(request: Request, ctx: RouteContext<"/api/admin/jetskis/[id]">) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!getJetski(id)) return errorResponse(404, "not-found", "Nie znaleziono skutera.");
  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  if (!body) return errorResponse(400, "invalid", "Nieprawidłowe dane.");

  if (body.prices !== undefined) {
    const prices = parsePrices(body.prices);
    if (!prices.value) return Response.json({ error: { code: "validation", message: "Popraw ceny.", fields: prices.errors } }, { status: 422 });
    setPrices(id, prices.value);
    if (body.details === undefined) return Response.json({ jetski: getJetski(id) });
  }
  const parsed = parseJetski((body.details as Record<string, unknown>) ?? body);
  if (!parsed.value) return Response.json({ error: { code: "validation", message: "Popraw zaznaczone pola.", fields: parsed.errors } }, { status: 422 });
  return Response.json({ jetski: updateJetski(id, parsed.value) });
}

export async function DELETE(request: Request, ctx: RouteContext<"/api/admin/jetskis/[id]">) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const result = deleteJetski(id);
  if (result === "not-found") return errorResponse(404, "not-found", "Nie znaleziono skutera.");
  return Response.json({ result });
}
