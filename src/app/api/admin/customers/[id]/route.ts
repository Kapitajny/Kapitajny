import { requireAdmin } from "@/lib/server/auth";
import { errorResponse, readJson } from "@/lib/server/http";
import { deleteCustomer, updateCustomer } from "@/lib/server/repo";
import { cleanMultiline, validateContact } from "@/lib/validation";

export async function PUT(request: Request, ctx: RouteContext<"/api/admin/customers/[id]">) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  const { value, errors } = validateContact(body ?? {});
  if (Object.keys(errors).length) return Response.json({ error: { code: "validation", message: "Popraw zaznaczone pola.", fields: errors } }, { status: 422 });
  try {
    if (!updateCustomer(id, { ...value, notes: cleanMultiline(body?.notes, 1000) || null })) return errorResponse(404, "not-found", "Nie znaleziono klienta.");
  } catch (e) {
    if (e instanceof Error && /UNIQUE/.test(e.message)) return errorResponse(409, "duplicate", "Inny klient ma już ten adres e-mail.", "email");
    throw e;
  }
  return Response.json({ ok: true });
}

/** Usuwa dane osobowe klienta. Rezerwacje zostają w historii bez powiązania z osobą. */
export async function DELETE(request: Request, ctx: RouteContext<"/api/admin/customers/[id]">) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!deleteCustomer(id)) return errorResponse(404, "not-found", "Nie znaleziono klienta.");
  return Response.json({ ok: true });
}
