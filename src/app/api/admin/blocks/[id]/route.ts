import { requireAdmin } from "@/lib/server/auth";
import { errorResponse } from "@/lib/server/http";
import { deleteBlock } from "@/lib/server/repo";

export async function DELETE(request: Request, ctx: RouteContext<"/api/admin/blocks/[id]">) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  if (!deleteBlock(id)) return errorResponse(404, "not-found", "Nie znaleziono blokady.");
  return Response.json({ ok: true });
}
