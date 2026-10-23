import { deleteSession } from "@/lib/server/auth";
import { clearSessionCookie } from "@/lib/server/session";

/** POST /api/auth/logout */
export async function POST() {
  deleteSession(await clearSessionCookie());
  return Response.json({ ok: true });
}
