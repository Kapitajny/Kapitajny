import "server-only";

import { serviceLabel, type ContactInput } from "@/lib/contact";

/**
 * Dostarczanie zapytań z formularza. Obsługiwane są dwa sposoby (wystarczy jeden):
 *
 * 1. CONTACT_WEBHOOK_URL (+ opcjonalnie CONTACT_WEBHOOK_SECRET) – JSON wysyłany np. do Make, Zapier,
 *    n8n albo własnego systemu zgłoszeń.
 * 2. RESEND_API_KEY + CONTACT_EMAIL_TO + CONTACT_EMAIL_FROM – e-mail przez API Resend (resend.com).
 *
 * Bez konfiguracji formularz NIE udaje wysłania – API zwraca 503 z jasnym komunikatem.
 */

export type DeliveryChannel = "webhook" | "email";

export function contactChannel(env: NodeJS.ProcessEnv = process.env): DeliveryChannel | null {
  if (env.CONTACT_WEBHOOK_URL?.trim()) return "webhook";
  if (env.RESEND_API_KEY?.trim() && env.CONTACT_EMAIL_TO?.trim() && env.CONTACT_EMAIL_FROM?.trim()) return "email";
  return null;
}

function formatDate(input: ContactInput) {
  if (!input.date) return "nie podano";
  const [y, m, d] = input.date.split("-");
  return `${d}.${m}.${y}${input.time ? `, godz. ${input.time}` : ""}`;
}

export function contactSummary(input: ContactInput, reference: string): string {
  return [
    `Zapytanie ${reference} ze strony internetowej`,
    "",
    `Usługa: ${serviceLabel(input.service)}`,
    `Imię i nazwisko: ${input.name}`,
    `Telefon: ${input.phone}`,
    `E-mail: ${input.email}`,
    `Miejsce odbioru: ${input.pickup || "nie podano"}`,
    `Miejsce docelowe: ${input.destination || "nie podano"}`,
    `Preferowany termin: ${formatDate(input)}`,
    "",
    "Dodatkowe informacje:",
    input.message || "brak",
    "",
    "Zgoda: akceptacja polityki prywatności (formularz kontaktowy).",
  ].join("\n");
}

export async function deliverContact(input: ContactInput, reference: string, env: NodeJS.ProcessEnv = process.env): Promise<void> {
  const channel = contactChannel(env);
  if (!channel) throw new Error("NOT_CONFIGURED");
  const submittedAt = new Date().toISOString();

  if (channel === "webhook") {
    const secret = env.CONTACT_WEBHOOK_SECRET?.trim();
    const res = await fetch(env.CONTACT_WEBHOOK_URL!.trim(), {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(secret ? { Authorization: `Bearer ${secret}` } : {}) },
      body: JSON.stringify({
        reference,
        submittedAt,
        source: "vitalis-med-website",
        serviceLabel: serviceLabel(input.service),
        ...input,
        consentText: "Akceptacja polityki prywatności – formularz kontaktowy",
      }),
      signal: AbortSignal.timeout(8_000),
    });
    if (!res.ok) throw new Error(`Webhook responded ${res.status}`);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.RESEND_API_KEY!.trim()}` },
    body: JSON.stringify({
      from: env.CONTACT_EMAIL_FROM!.trim(),
      to: env.CONTACT_EMAIL_TO!.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: input.email,
      subject: `Zapytanie ${reference}: ${serviceLabel(input.service)}`,
      text: contactSummary(input, reference),
    }),
    signal: AbortSignal.timeout(8_000),
  });
  if (!res.ok) throw new Error(`Resend responded ${res.status}`);
}

/** Krótki numer referencyjny zapytania, np. VM-7K2Q9D. */
export function newReference(): string {
  const alphabet = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const bytes = crypto.getRandomValues(new Uint8Array(6));
  return `VM-${Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("")}`;
}
