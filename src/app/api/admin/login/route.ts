import { cookies } from "next/headers";
import { adminConfigState, checkPassword, createSession, sameOrigin, SESSION_COOKIE } from "@/lib/server/auth";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse(403, "forbidden", "Żądanie zostało odrzucone.");
  if (adminConfigState() !== "ready") return errorResponse(503, "unconfigured", "Panel nie jest skonfigurowany (ADMIN_PASSWORD, ADMIN_SESSION_SECRET).");
  if (!rateLimit(request, "admin-login", 5, 15 * 60_000)) return errorResponse(429, "rate-limit", "Za dużo prób logowania. Odczekaj 15 minut.");
  const body = (await readJson(request)) as { password?: unknown } | undefined;
  if (typeof body?.password !== "string" || !checkPassword(body.password)) return errorResponse(401, "bad-password", "Nieprawidłowe hasło.");
  const session = createSession()!;
  (await cookies()).set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: session.maxAge,
  });
  return Response.json({ ok: true });
}
