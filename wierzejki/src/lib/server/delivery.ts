import "server-only";

import { getTopic, isB2BTopic, CONSENT_TEXT, type ContactPayload } from "@/lib/contact";

/**
 * Dostarczenie wiadomości z formularza. Obsługiwane (w tej kolejności):
 *  1. Resend (e-mail): RESEND_API_KEY + CONTACT_EMAIL_TO + CONTACT_EMAIL_FROM
 *  2. Webhook (np. Make, Zapier, n8n, własny CRM): CONTACT_WEBHOOK_URL [+ CONTACT_WEBHOOK_SECRET]
 * Bez konfiguracji formularz NIE udaje wysłania – API zwraca 503, a strona pokazuje tryb demonstracyjny.
 */
export type DeliveryChannel = "resend" | "webhook" | null;

export function getDeliveryChannel(): DeliveryChannel {
  if (process.env.RESEND_API_KEY?.trim() && process.env.CONTACT_EMAIL_TO?.trim() && process.env.CONTACT_EMAIL_FROM?.trim()) return "resend";
  if (process.env.CONTACT_WEBHOOK_URL?.trim()) return "webhook";
  return null;
}

export function isContactConfigured(): boolean {
  return getDeliveryChannel() !== null;
}

function formatText(data: ContactPayload): string {
  const topic = getTopic(data.topic);
  const lines = [
    `Temat: ${topic?.label ?? data.topic}`,
    `Dział: ${topic?.department ?? "-"}`,
    "",
    `Imię i nazwisko: ${data.name}`,
    `E-mail: ${data.email}`,
    `Telefon: ${data.phone || "-"}`,
  ];
  if (isB2BTopic(data.topic)) {
    lines.push(
      `Firma: ${data.company}`,
      `NIP: ${data.nip || "-"}`,
      `Rodzaj działalności: ${data.businessType}`,
      `Region dostaw: ${data.region || "-"}`,
      `Asortyment: ${data.interests.join(", ") || "-"}`,
    );
  }
  lines.push("", "Wiadomość:", data.message, "", `Zgoda: ${CONSENT_TEXT}`);
  return lines.join("\n");
}

export async function deliverContact(data: ContactPayload): Promise<void> {
  const channel = getDeliveryChannel();
  const topic = getTopic(data.topic);
  const subject = `[wierzejki.pl] ${topic?.label ?? "Wiadomość"} – ${isB2BTopic(data.topic) ? data.company : data.name}`;

  if (channel === "resend") {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY!.trim()}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.CONTACT_EMAIL_FROM!.trim(),
        to: process.env.CONTACT_EMAIL_TO!.split(",").map((s) => s.trim()).filter(Boolean),
        reply_to: data.email,
        subject,
        text: formatText(data),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Resend responded ${response.status}`);
    return;
  }

  if (channel === "webhook") {
    const secret = process.env.CONTACT_WEBHOOK_SECRET?.trim();
    const { website: _honeypot, ...fields } = data;
    void _honeypot;
    const response = await fetch(process.env.CONTACT_WEBHOOK_URL!.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
      body: JSON.stringify({
        ...fields,
        subject,
        department: topic?.department,
        consentText: CONSENT_TEXT,
        submittedAt: new Date().toISOString(),
        source: "wierzejki-website",
        text: formatText(data),
      }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
    return;
  }

  throw new Error("CONTACT_NOT_CONFIGURED");
}
