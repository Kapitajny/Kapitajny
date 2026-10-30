import "server-only";

export type DeliveryResult = "sent" | "not_configured" | "failed";

/**
 * Przekazuje zgłoszenie z formularza do systemu studia przez webhook (FORMS_WEBHOOK_URL) –
 * np. scenariusz Make/Zapier/n8n wysyłający e-mail do recepcji, CRM albo system rezerwacji.
 * Bez tej konfiguracji zgłoszenie NIE jest nigdzie zapisywane – strona mówi o tym wprost.
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
