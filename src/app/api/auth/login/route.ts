import { authenticate, createSession } from "@/lib/server/auth";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { setSessionCookie } from "@/lib/server/session";

/** POST /api/auth/login  { email, password } */
export async function POST(request: Request) {
  if (!rateLimit(request, "login", 10, 10 * 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób logowania. Spróbuj ponownie za kilka minut.");
  const body = (await readJson(request, 4_000)) as { email?: unknown; password?: unknown } | undefined;
  if (typeof body?.email !== "string" || typeof body.password !== "string" || !body.email.trim() || !body.password) {
    return errorResponse(422, "VALIDATION_ERROR", "Podaj adres e-mail i hasło.");
  }
  const user = await authenticate(body.email, body.password);
  if (!user) return errorResponse(401, "INVALID_CREDENTIALS", "Nieprawidłowy e-mail lub hasło.");
  const session = createSession(user.id);
  await setSessionCookie(session.token);
  return Response.json({ user: { firstName: user.firstName, email: user.email } });
}
