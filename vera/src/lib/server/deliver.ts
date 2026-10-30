import "server-only";

export type DeliveryResult = "sent" | "not_configured" | "failed";

/**
 * Forwards a form submission to the studio's systems through a webhook (FORMS_WEBHOOK_URL) –
 * e.g. a Make/Zapier/n8n scenario that e-mails reception, a CRM or a booking system.
 * Without this setting the submission is NOT stored anywhere, and the page says so plainly.
 */
export async function deliverSubmission(type: "contact" | "consultation", data: unknown): Promise<DeliveryResult> {
  const url = process.env.FORMS_WEBHOOK_URL?.trim();
  if (!url) return "not_configured";

  const secret = process.env.FORMS_WEBHOOK_SECRET?.trim();
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
      body: JSON.stringify({ type, data, submittedAt: new Date().toISOString(), source: "vera-website" }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    return "sent";
  } catch (error) {
    console.error(`[forms:${type}]`, error);
    return "failed";
  }
}
