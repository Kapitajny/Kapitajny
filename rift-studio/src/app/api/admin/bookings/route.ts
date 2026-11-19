import { isAdminRequest } from "@/lib/server/admin-auth";
import { adminSetStatus } from "@/lib/server/bookings";
import { isSameOrigin, json, readJson } from "@/lib/server/security";
import { getStore } from "@/lib/server/store";

/** GET /api/admin/bookings – nadchodzące rezerwacje i blokady. */
export async function GET() {
  if (!(await isAdminRequest())) return json({ error: "unauthorized" }, 401);
  const from = new Date(Date.now() - 24 * 3600_000);
  const [bookings, blocks] = await Promise.all([getStore().list({ from }), getStore().listBlocks(from)]);
  return json({ bookings, blocks });
}

/** PATCH /api/admin/bookings – { id, action: "confirm" | "cancel", reason? } */
export async function PATCH(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!(await isAdminRequest())) return json({ error: "unauthorized" }, 401);
  const body = await readJson(req);
  if (!body || typeof body.id !== "string" || (body.action !== "confirm" && body.action !== "cancel")) return json({ error: "invalid" }, 400);

  const result = await adminSetStatus(body.id, body.action, typeof body.reason === "string" ? body.reason : "");
  if (!result.ok) return json({ error: result.reason }, result.reason === "conflict" ? 409 : 404);
  return json({ ok: true, booking: result.value });
}
