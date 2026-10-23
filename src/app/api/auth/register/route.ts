import { createSession, createUser, EmailTakenError } from "@/lib/server/auth";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { setSessionCookie } from "@/lib/server/session";
import { validateEmail, validateName, validatePassword } from "@/lib/validation";

/** POST /api/auth/register  { firstName, email, password, acceptTerms: true } */
export async function POST(request: Request) {
  if (!rateLimit(request, "register", 5, 10 * 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób. Spróbuj ponownie za kilka minut.");
  const body = (await readJson(request, 4_000)) as Record<string, unknown> | undefined;
  if (!body) return errorResponse(400, "INVALID_BODY", "Nieprawidłowe dane formularza.");

  const nameError = validateName(body.firstName, "imię");
  if (nameError) return errorResponse(422, "VALIDATION_ERROR", nameError, "firstName");
  const emailError = validateEmail(body.email);
  if (emailError) return errorResponse(422, "VALIDATION_ERROR", emailError, "email");
  const passwordError = validatePassword(body.password);
  if (passwordError) return errorResponse(422, "VALIDATION_ERROR", passwordError, "password");
  if (body.acceptTerms !== true) return errorResponse(422, "VALIDATION_ERROR", "Zaakceptuj regulamin, aby założyć konto.", "acceptTerms");

  try {
    const user = await createUser({ firstName: body.firstName as string, email: body.email as string, password: body.password as string });
    const session = createSession(user.id);
    await setSessionCookie(session.token);
    return Response.json({ user: { firstName: user.firstName, email: user.email } }, { status: 201 });
  } catch (error) {
    if (error instanceof EmailTakenError) {
      return errorResponse(409, "EMAIL_TAKEN", "Konto z tym adresem już istnieje. Zaloguj się lub zresetuj hasło.", "email");
    }
    console.error("[register]", error);
    return errorResponse(500, "INTERNAL_ERROR", "Nie udało się założyć konta. Spróbuj ponownie.");
  }
}
