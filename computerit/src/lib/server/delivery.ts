import "server-only";
import nodemailer from "nodemailer";
import { budgets, projectTypes } from "@/data/offer";
import { CONSENT_TEXT, labelOf, type ContactInput } from "@/lib/contact";

/**
 * Dostarczanie zapytań z formularza. Obsługiwane kanały (można włączyć oba naraz):
 *  - SMTP – wiadomość e-mail na adres CONTACT_TO_EMAIL (np. skrzynka w hostingu, Google Workspace, Resend SMTP),
 *  - webhook – JSON wysyłany na CONTACT_WEBHOOK_URL (np. Make, Zapier, n8n, własny CRM).
 * Bez żadnego kanału formularz NIE udaje wysyłki – API zwraca 503 z jasnym komunikatem.
 */

type SmtpConfig = { host: string; port: number; secure: boolean; user: string | null; pass: string | null; from: string; to: string };

const env = (name: string) => process.env[name]?.trim() || null;

export function getSmtpConfig(): SmtpConfig | null {
  const host = env("SMTP_HOST");
  const to = env("CONTACT_TO_EMAIL");
  if (!host || !to) return null;
  const port = Number(env("SMTP_PORT") ?? 587);
  const user = env("SMTP_USER");
  return {
    host,
    port,
    secure: env("SMTP_SECURE") ? env("SMTP_SECURE") === "true" : port === 465,
    user,
    pass: env("SMTP_PASSWORD"),
    from: env("CONTACT_FROM_EMAIL") ?? user ?? to,
    to,
  };
}

export function getWebhookConfig(): { url: string; secret: string | null } | null {
  const url = env("CONTACT_WEBHOOK_URL");
  return url ? { url, secret: env("CONTACT_WEBHOOK_SECRET") } : null;
}

export function isDeliveryConfigured(): boolean {
  return Boolean(getSmtpConfig() || getWebhookConfig());
}

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);

export function describeInquiry(data: ContactInput) {
  const rows: [string, string][] = [
    ["Imię", data.name],
    ["E-mail", data.email],
    ["Firma", data.company || "—"],
    ["Rodzaj projektu", labelOf(projectTypes, data.projectType)],
    ["Budżet", labelOf(budgets, data.budget)],
  ];
  const subject = `Zapytanie ze strony: ${labelOf(projectTypes, data.projectType)} – ${data.name}`;
  const text = [...rows.map(([k, v]) => `${k}: ${v}`), "", data.message, "", `Zgoda: ${CONSENT_TEXT}`].join("\n");
  const html = `<table cellpadding="6" style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#4b5b7a">${k}</td><td><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join("")}</table><p style="font-family:Arial,sans-serif;font-size:14px;white-space:pre-wrap">${escapeHtml(
    data.message,
  )}</p><p style="font-family:Arial,sans-serif;font-size:12px;color:#4b5b7a">Zgoda: ${escapeHtml(CONSENT_TEXT)}</p>`;
  return { subject, text, html };
}

/** Wysyła zapytanie wszystkimi skonfigurowanymi kanałami. Rzuca wyjątek, gdy którykolwiek zawiedzie. */
export async function deliverInquiry(data: ContactInput): Promise<void> {
  const smtp = getSmtpConfig();
  const webhook = getWebhookConfig();
  const tasks: Promise<unknown>[] = [];

  if (smtp) {
    const transporter = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      ...(smtp.user ? { auth: { user: smtp.user, pass: smtp.pass ?? "" } } : {}),
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000,
    });
    const { subject, text, html } = describeInquiry(data);
    tasks.push(transporter.sendMail({ from: `ComputerIT – formularz <${smtp.from}>`, to: smtp.to, replyTo: data.email, subject, text, html }));
  }

  if (webhook) {
    tasks.push(
      fetch(webhook.url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(webhook.secret ? { Authorization: `Bearer ${webhook.secret}` } : {}) },
        body: JSON.stringify({
          ...data,
          projectTypeLabel: labelOf(projectTypes, data.projectType),
          budgetLabel: labelOf(budgets, data.budget),
          consentText: CONSENT_TEXT,
          submittedAt: new Date().toISOString(),
          source: "computerit-website",
        }),
        signal: AbortSignal.timeout(10_000),
      }).then((response) => {
        if (!response.ok) throw new Error(`Contact webhook responded ${response.status}`);
      }),
    );
  }

  await Promise.all(tasks);
}
