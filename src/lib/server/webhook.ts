import "server-only";

/**
 * Przekazywanie danych do zewnętrznych usług przez webhook (np. scenariusz Make/Zapier,
 * endpoint dostawcy newslettera lub poczty). Bez skonfigurowanego adresu NIC nie jest wysyłane.
 */
export type ForwardResult = "sent" | "not-configured" | "failed";

export async function forwardToWebhook(urlEnv: string, secretEnv: string, payload: Record<string, unknown>): Promise<ForwardResult> {
  const url = process.env[urlEnv]?.trim();
  if (!url) return "not-configured";
  try {
    const secret = process.env[secretEnv]?.trim();
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
      body: JSON.stringify({ ...payload, sentAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`${urlEnv} responded ${response.status}`);
    return "sent";
  } catch (error) {
    console.error(`[webhook:${urlEnv}]`, error);
    return "failed";
  }
}

/** Wiadomość e-mail przez MAIL_WEBHOOK_URL (usługa po drugiej stronie wysyła właściwy e-mail). */
export function sendMail(message: { to: string; subject: string; text: string }): Promise<ForwardResult> {
  return forwardToWebhook("MAIL_WEBHOOK_URL", "MAIL_WEBHOOK_SECRET", { type: "email", ...message });
}
