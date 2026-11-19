import { cookies } from "next/headers";
import { ADMIN_COOKIE, checkPassword, createSessionValue, isAdminConfigured, sessionCookieOptions } from "@/lib/server/admin-auth";
import { clientIp, isSameOrigin, json, rateLimit, readJson } from "@/lib/server/security";

/** POST /api/admin/session – logowanie hasłem. */
export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "forbidden" }, 403);
  if (!isAdminConfigured()) return json({ error: "not_configured" }, 503);
  if (!rateLimit(`admin-login:${clientIp(req)}`, 5, 15 * 60_000)) return json({ error: "rate_limited" }, 429);

  const body = await readJson(req, 2000);
  if (!body || typeof body.password !== "string" || !checkPassword(body.password)) return json({ error: "invalid_password" }, 401);

  const { value, maxAge } = createSessionValue();
  (await cookies()).set(ADMIN_COOKIE, value, sessionCookieOptions(maxAge));
  return json({ ok: true });
}

/** DELETE /api/admin/session – wylogowanie. */
export async function DELETE(req: Request) {
  if (!isSameOrigin(req)) return json({ error: "forbidden" }, 403);
  (await cookies()).set(ADMIN_COOKIE, "", sessionCookieOptions(0));
  return json({ ok: true });
}
