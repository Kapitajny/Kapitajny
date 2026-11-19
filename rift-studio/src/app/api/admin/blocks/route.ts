import { isDateString, isTimeString, toMinutes, zonedToUtc } from "@/lib/booking/time";
import { isAdminRequest } from "@/lib/server/admin-auth";
import { isSameOrigin, json, readJson } from "@/lib/server/security";
import { getStore } from "@/lib/server/store";

/** POST /api/admin/blocks – { date, from: "HH:MM", to: "HH:MM", note } blokuje termin (np. urlop, prywatna sesja). */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!(await isAdminRequest())) return json({ error: "unauthorized" }, 401);
  const body = await readJson(req);
  if (!body || !isDateString(body.date) || !isTimeString(body.from) || !isTimeString(body.to)) return json({ error: "invalid" }, 400);
  if (toMinutes(body.to) <= toMinutes(body.from)) return json({ error: "invalid_range" }, 400);

  const block = await getStore().addBlock(
    zonedToUtc(body.date, toMinutes(body.from)).toISOString(),
    zonedToUtc(body.date, toMinutes(body.to)).toISOString(),
    typeof body.note === "string" ? body.note.slice(0, 200) : "",
  );
  return json({ ok: true, block }, 201);
}

/** DELETE /api/admin/blocks – { id } */
export async function DELETE(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!(await isAdminRequest())) return json({ error: "unauthorized" }, 401);
  const body = await readJson(req);
  if (!body || typeof body.id !== "string") return json({ error: "invalid" }, 400);
  return (await getStore().removeBlock(body.id)) ? json({ ok: true }) : json({ error: "not_found" }, 404);
}
