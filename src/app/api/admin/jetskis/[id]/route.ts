import { parseJetski, parseMoney, parsePrices } from "@/lib/server/admin-input";
import { requireAdmin } from "@/lib/server/auth";
import { errorResponse, readJson } from "@/lib/server/http";
import { deleteJetski, getJetski, setDeposit, setPrices, updateJetski } from "@/lib/server/repo";

/**
 * PUT – zapis danych skutera.
 * `{ prices, deposit }` bez `details` zapisuje tylko cennik (ceny brutto w zł) i kaucję.
 */
export async function PUT(request: Request, ctx: RouteContext<"/api/admin/jetskis/[id]">) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!getJetski(id)) return errorResponse(404, "not-found", "Nie znaleziono skutera.");
  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  if (!body) return errorResponse(400, "invalid", "Nieprawidłowe dane.");

  if (body.prices !== undefined || (body.deposit !== undefined && body.details === undefined)) {
    const prices = body.prices !== undefined ? parsePrices(body.prices) : { value: {}, errors: {} };
    const deposit = body.deposit !== undefined ? parseMoney(body.deposit) : undefined;
    const fields = { ...prices.errors, ...(deposit === "invalid" ? { deposit: "Kaucję podaj w złotych, np. 1000." } : {}) };
    if (!prices.value || deposit === "invalid")
      return Response.json({ error: { code: "validation", message: "Popraw zaznaczone kwoty.", fields } }, { status: 422 });
    setPrices(id, prices.value);
    if (deposit !== undefined) setDeposit(id, deposit);
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
