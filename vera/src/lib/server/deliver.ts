import "server-only";

/**
 * Forwards a form submission to the studio via webhook (FORMS_WEBHOOK_URL) – e.g. a Make/Zapier/n8n
 * scenario that e-mails reception, a CRM or a booking system. Without it nothing is stored or sent,
 * and the site says so.
 */
export async function deliver(type: "contact" | "consultation", data: unknown): Promise<"sent" | "not_configured" | "failed"> {
  const url = process.env.FORMS_WEBHOOK_URL?.trim();
  if (!url) return "not_configured";
  const secret = process.env.FORMS_WEBHOOK_SECRET?.trim();
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
      body: JSON.stringify({ type, data, submittedAt: new Date().toISOString(), source: "vera-website" }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return "sent";
  } catch (error) {
    console.error(`[forms:${type}]`, error);
    return "failed";
  }
}
