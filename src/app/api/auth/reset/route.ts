import { resetPassword } from "@/lib/server/auth";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { validatePassword } from "@/lib/validation";

/** POST /api/auth/reset  { token, password } */
export async function POST(request: Request) {
  if (!rateLimit(request, "reset", 10, 10 * 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób. Spróbuj ponownie za kilka minut.");
  const body = (await readJson(request, 2_000)) as { token?: unknown; password?: unknown } | undefined;
  if (typeof body?.token !== "string" || !/^[A-Za-z0-9_-]{20,100}$/.test(body.token)) {
    return errorResponse(400, "INVALID_TOKEN", "Link jest nieprawidłowy. Poproś o nowy.");
  }
  const passwordError = validatePassword(body.password);
  if (passwordError) return errorResponse(422, "VALIDATION_ERROR", passwordError, "password");
  const ok = await resetPassword(body.token, body.password as string);
  if (!ok) return errorResponse(400, "INVALID_TOKEN", "Link wygasł albo został już użyty. Poproś o nowy.");
  return Response.json({ ok: true, message: "Hasło zmienione. Zaloguj się nowym hasłem." });
}
