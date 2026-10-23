import "server-only";

import { siteConfig } from "@/config/site";
import { CONTACT_METHODS, TIME_PREFERENCES, type ContactRequest } from "@/lib/contact";
import { getService } from "@/data/services";

/**
 * Przekazanie zgłoszenia z formularza kontaktowego do gabinetu.
 *
 * Obsługiwane kanały (wystarczy jeden, można oba):
 * 1. E-mail przez Resend (https://resend.com): RESEND_API_KEY, CONTACT_EMAIL_TO, CONTACT_EMAIL_FROM
 *    (adres nadawcy w zweryfikowanej domenie).
 * 2. Webhook: CONTACT_WEBHOOK_URL (+ opcjonalnie CONTACT_WEBHOOK_SECRET wysyłany jako `Authorization: Bearer`)
 *    – np. scenariusz Make/Zapier, system rezerwacji albo własny backend.
 *
 * Zgłoszenie uznajemy za przyjęte tylko wtedy, gdy WSZYSTKIE skonfigurowane kanały potwierdzą odbiór.
 * Bez konfiguracji niczego nie udajemy – API zwraca błąd „nieskonfigurowane”.
 */

interface ResendConfig {
  apiKey: string;
  to: string;
  from: string;
}

export interface DeliveryConfig {
  resend: ResendConfig | null;
  webhook: { url: string; secret: string | null } | null;
}

export function getDeliveryConfig(env: Record<string, string | undefined> = process.env): DeliveryConfig {
  const apiKey = env.RESEND_API_KEY?.trim();
  const to = env.CONTACT_EMAIL_TO?.trim();
  const from = env.CONTACT_EMAIL_FROM?.trim();
  const webhookUrl = env.CONTACT_WEBHOOK_URL?.trim();
  return {
    resend: apiKey && to && from ? { apiKey, to, from } : null,
    webhook: webhookUrl ? { url: webhookUrl, secret: env.CONTACT_WEBHOOK_SECRET?.trim() || null } : null,
  };
}

export function isDeliveryConfigured(config: DeliveryConfig): boolean {
  return Boolean(config.resend || config.webhook);
}

function formatDate(date: string | null): string {
  if (!date) return "bez preferencji";
  const [y, m, d] = date.split("-");
  return `${d}.${m}.${y}`;
}

/** Zgłoszenie w formie czytelnej dla obsługi gabinetu. */
export function describeRequest(request: ContactRequest): string {
  const lines = [
    `Imię: ${request.name}`,
    `Preferowany kontakt: ${CONTACT_METHODS[request.contactMethod]}`,
    request.phone ? `Telefon: ${request.phone}` : null,
    request.email ? `E-mail: ${request.email}` : null,
    `Preferowany termin: ${formatDate(request.preferredDate)}, ${TIME_PREFERENCES[request.preferredTime].toLowerCase()}`,
    `Usługa: ${request.service ? (getService(request.service)?.title ?? request.service) : "nie wskazano"}`,
    "",
    "Wiadomość:",
    request.message ?? "(brak)",
    "",
    "To jest prośba o kontakt – termin nie został zarezerwowany. Skontaktuj się z pacjentem, aby go potwierdzić.",
  ];
  return lines.filter((line) => line !== null).join("\n");
}

async function sendViaResend(config: ResendConfig, request: ContactRequest, fetchImpl: typeof fetch) {
  const response = await fetchImpl("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
    body: JSON.stringify({
      from: config.from,
      to: [config.to],
      ...(request.email ? { reply_to: request.email } : {}),
      subject: `Prośba o kontakt ze strony ${siteConfig.name} – ${request.name}`,
      text: describeRequest(request),
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Resend responded ${response.status}`);
}

async function sendViaWebhook(config: { url: string; secret: string | null }, request: ContactRequest, fetchImpl: typeof fetch) {
  const response = await fetchImpl(config.url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(config.secret ? { Authorization: `Bearer ${config.secret}` } : {}) },
    body: JSON.stringify({
      type: "contact_request",
      submittedAt: new Date().toISOString(),
      source: "website",
      request,
      summary: describeRequest(request),
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!response.ok) throw new Error(`Contact webhook responded ${response.status}`);
}

export async function deliverContactRequest(request: ContactRequest, config: DeliveryConfig, fetchImpl: typeof fetch = fetch): Promise<void> {
  const tasks: Promise<void>[] = [];
  if (config.resend) tasks.push(sendViaResend(config.resend, request, fetchImpl));
  if (config.webhook) tasks.push(sendViaWebhook(config.webhook, request, fetchImpl));
  if (tasks.length === 0) throw new Error("Contact delivery is not configured");
  await Promise.all(tasks);
}
