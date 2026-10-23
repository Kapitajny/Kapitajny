import { createPasswordReset } from "@/lib/server/auth";
import { getSiteUrl, isProduction } from "@/lib/server/env";
import { errorResponse, rateLimit, readJson } from "@/lib/server/http";
import { sendMail } from "@/lib/server/webhook";
import { validateEmail } from "@/lib/validation";

/**
 * POST /api/auth/forgot  { email }
 * Wysyła link do ustawienia nowego hasła przez MAIL_WEBHOOK_URL. Odpowiedź nie zdradza, czy konto istnieje.
 * Bez skonfigurowanej wysyłki e-maili mówimy o tym wprost (w trybie deweloperskim link trafia do logów serwera).
 */
export async function POST(request: Request) {
  if (!rateLimit(request, "forgot", 5, 10 * 60_000)) return errorResponse(429, "RATE_LIMITED", "Zbyt wiele prób. Spróbuj ponownie za kilka minut.");
  const body = (await readJson(request, 2_000)) as { email?: unknown } | undefined;
  const emailError = validateEmail(body?.email);
  if (emailError) return errorResponse(422, "VALIDATION_ERROR", emailError, "email");

  const mailConfigured = Boolean(process.env.MAIL_WEBHOOK_URL?.trim());
  if (!mailConfigured && isProduction()) {
    return errorResponse(503, "MAIL_NOT_CONFIGURED", "Wysyłka e-maili nie jest jeszcze skonfigurowana, więc nie możemy wysłać linku. Napisz do nas przez formularz kontaktowy.");
  }

  const reset = createPasswordReset(body!.email as string);
  if (reset) {
    const link = `${getSiteUrl(request)}/reset-hasla?token=${reset.token}`;
    if (!mailConfigured) {
      console.info(`[forgot] Wysyłka e-maili nie jest skonfigurowana. Link resetu dla ${reset.user.email}: ${link}`);
    } else {
      const result = await sendMail({
        to: reset.user.email,
        subject: "Ustaw nowe hasło",
        text: `Cześć ${reset.user.firstName},\n\nustaw nowe hasło, klikając w link (ważny 60 minut):\n${link}\n\nJeśli to nie Ty, zignoruj tę wiadomość.`,
      });
      if (result !== "sent") return errorResponse(502, "PROVIDER_ERROR", "Nie udało się wysłać wiadomości. Spróbuj ponownie za kilka minut.");
    }
  }

  if (!mailConfigured) {
    return Response.json({
      ok: true,
      dev: true,
      message: "Tryb deweloperski: wysyłka e-maili nie jest skonfigurowana. Jeśli konto istnieje, link zapisano w logach serwera.",
    });
  }
  return Response.json({ ok: true, message: "Jeśli konto z tym adresem istnieje, wysłaliśmy link do ustawienia nowego hasła. Link jest ważny 60 minut." });
}
