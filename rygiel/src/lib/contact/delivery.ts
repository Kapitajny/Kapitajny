import "server-only";
import { createHmac } from "node:crypto";
import { escapeHtml } from "./escape";
import { labelFor, scopeOptions, serviceOptions, type ContactData } from "./schema";

export type DeliveryMode = "resend" | "webhook" | "demo";

// Zmienne: RESEND_API_KEY, CONTACT_TO_EMAIL, CONTACT_FROM_EMAIL, CONTACT_WEBHOOK_URL, CONTACT_WEBHOOK_SECRET.
type DeliveryEnv = Readonly<Record<string, string | undefined>>;

export function getDeliveryMode(env: DeliveryEnv = process.env): DeliveryMode {
  if (env.RESEND_API_KEY && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL) return "resend";
  if (env.CONTACT_WEBHOOK_URL) return "webhook";
  return "demo";
}

export type DeliveryResult = { delivered: true } | { delivered: false; mode: DeliveryMode; reason: "not-configured" | "provider-error" | "network-error" };

const TIMEOUT_MS = 8_000;

function textBody(data: ContactData): string {
  return [
    `Imię: ${data.name}`,
    `E-mail: ${data.email}`,
    `Firma: ${data.company ?? "—"}`,
    `Usługa: ${labelFor(serviceOptions, data.service)}`,
    `Zakres: ${labelFor(scopeOptions, data.scope)}`,
    "",
    data.message,
  ].join("\n");
}

function htmlBody(data: ContactData): string {
  const rows: [string, string][] = [
    ["Imię", data.name],
    ["E-mail", data.email],
    ["Firma", data.company ?? "—"],
    ["Usługa", labelFor(serviceOptions, data.service)],
    ["Zakres", labelFor(scopeOptions, data.scope)],
  ];
  const table = rows.map(([label, value]) => `<tr><th align="left">${escapeHtml(label)}</th><td>${escapeHtml(value)}</td></tr>`).join("");
  return `<table>${table}</table><p style="white-space:pre-wrap">${escapeHtml(data.message)}</p>`;
}

export async function deliverContact(data: ContactData, env: DeliveryEnv = process.env): Promise<DeliveryResult> {
  const mode = getDeliveryMode(env);
  if (mode === "demo") return { delivered: false, mode, reason: "not-configured" };

  try {
    const response =
      mode === "resend"
        ? await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, "Content-Type": "application/json" },
            body: JSON.stringify({
              from: env.CONTACT_FROM_EMAIL,
              to: env.CONTACT_TO_EMAIL!.split(",").map((address) => address.trim()),
              reply_to: data.email,
              subject: `Zapytanie ze strony: ${labelFor(serviceOptions, data.service)}`,
              text: textBody(data),
              html: htmlBody(data),
            }),
            signal: AbortSignal.timeout(TIMEOUT_MS),
          })
        : await postWebhook(env.CONTACT_WEBHOOK_URL!, env.CONTACT_WEBHOOK_SECRET, data);

    if (!response.ok) {
      // Logujemy wyłącznie tryb i status – bez danych osobowych z formularza.
      console.error("[kontakt] Dostawca odrzucił wiadomość", { mode, status: response.status });
      return { delivered: false, mode, reason: "provider-error" };
    }
    return { delivered: true };
  } catch (error) {
    console.error("[kontakt] Błąd połączenia z dostawcą", { mode, error: error instanceof Error ? error.name : "unknown" });
    return { delivered: false, mode, reason: "network-error" };
  }
}

function postWebhook(url: string, secret: string | undefined, data: ContactData): Promise<Response> {
  const body = JSON.stringify({ type: "contact", submittedAt: new Date().toISOString(), data });
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  // Podpis HMAC pozwala odbiorcy sprawdzić, że żądanie pochodzi z tej strony.
  if (secret) headers["X-Signature-SHA256"] = createHmac("sha256", secret).update(body).digest("hex");
  return fetch(url, { method: "POST", headers, body, signal: AbortSignal.timeout(TIMEOUT_MS) });
}
