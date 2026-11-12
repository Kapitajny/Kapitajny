import { requireAdmin } from "@/lib/server/auth";
import { updateBooking } from "@/lib/server/bookings";
import { errorResponse, readJson } from "@/lib/server/http";

export async function PATCH(request: Request, ctx: RouteContext<"/api/admin/bookings/[id]">) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const { id } = await ctx.params;
  const body = (await readJson(request)) as { status?: unknown; adminNote?: unknown } | undefined;
  if (!body) return errorResponse(400, "invalid", "Nieprawidłowe dane.");
  const result = updateBooking(id, body);
  if (!result.ok) return errorResponse(result.code === "not-found" ? 404 : 409, result.code, result.message);
  return Response.json({ booking: result.booking });
}
