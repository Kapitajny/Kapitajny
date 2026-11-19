import "server-only";

import { env } from "./env";

export interface Mail {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}

/**
 * Wysyłka e-maili przez Resend (REST, bez SDK). Bez `RESEND_API_KEY` wiadomość trafia do logu
 * serwera – tak działa tryb deweloperski. Błąd wysyłki nigdy nie przerywa rezerwacji.
 */
export async function sendMail(mail: Mail): Promise<boolean> {
  const key = env.resendKey();
  if (!key) {
    if (process.env.NODE_ENV === "production") {
      // W produkcji nie logujemy treści: zawiera dane osobowe i link do zarządzania rezerwacją (token).
      console.warn("[mail] RESEND_API_KEY nie jest ustawiony – wiadomość nie została wysłana.");
    } else {
      console.info(`[mail:dev] → ${mail.to}\n  Temat: ${mail.subject}\n${mail.text.replace(/^/gm, "  ")}`);
    }
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: env.mailFrom(),
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error(`[mail] Resend ${res.status}: ${(await res.text()).slice(0, 300)}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[mail] wysyłka nieudana", error);
    return false;
  }
}

export const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
