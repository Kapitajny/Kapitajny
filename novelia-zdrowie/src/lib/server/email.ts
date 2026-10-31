import "server-only";

import { mkdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { formatPrice } from "@/lib/format";
import type { DownloadLink } from "./downloads";
import type { OrderRecord } from "./orders";

/**
 * Wysyłka e-maili transakcyjnych.
 *
 * EMAIL_PROVIDER=resend  → API Resend (RESEND_API_KEY)
 * EMAIL_PROVIDER=smtp    → dowolny serwer SMTP (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS)
 * brak konfiguracji      → e-mail NIE jest wysyłany. W trybie deweloperskim zapisujemy go do data/outbox/
 *                          (wyłącznie do podglądu), w produkcji – tylko ostrzeżenie w logach.
 */

export interface EmailMessage {
  to: string;
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
}

export type EmailResult = { sent: true; provider: string } | { sent: false; error: string; preview?: string };

export function emailProvider(): "resend" | "smtp" | null {
  const p = process.env.EMAIL_PROVIDER?.trim().toLowerCase();
  return p === "resend" || p === "smtp" ? p : null;
}

export function isEmailConfigured(): boolean {
  const provider = emailProvider();
  if (!provider || !process.env.EMAIL_FROM?.trim()) return false;
  if (provider === "resend") return !!process.env.RESEND_API_KEY?.trim();
  return !!process.env.SMTP_HOST?.trim();
}

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  const provider = emailProvider();
  const from = process.env.EMAIL_FROM?.trim();
  if (!provider || !from || !isEmailConfigured()) return writeOutbox(message);

  try {
    if (provider === "resend") {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [message.to], subject: message.subject, html: message.html, text: message.text, ...(message.replyTo ? { reply_to: message.replyTo } : {}) }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error(`Resend ${response.status}: ${(await response.text()).slice(0, 200)}`);
      return { sent: true, provider };
    }
    const { createTransport } = await import("nodemailer");
    const port = Number(process.env.SMTP_PORT || 465);
    const transport = createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
    });
    await transport.sendMail({ from, to: message.to, subject: message.subject, html: message.html, text: message.text, replyTo: message.replyTo });
    return { sent: true, provider };
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("[email] Błąd wysyłki", msg);
    return { sent: false, error: msg };
  }
}

function writeOutbox(message: EmailMessage): EmailResult {
  if (process.env.NODE_ENV === "production") {
    console.warn(`[email] E-maile nie są skonfigurowane – nie wysłano wiadomości „${message.subject}” do ${message.to}.`);
    return { sent: false, error: "Wysyłka e-maili nie jest skonfigurowana." };
  }
  const dir = resolve(/* turbopackIgnore: true */ process.cwd(), "data", "outbox");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${new Date().toISOString().replace(/[:.]/g, "-")}-${message.to.replace(/[^a-z0-9@._-]/gi, "_")}.html`);
  writeFileSync(file, `<!-- DO: ${message.to}\nTEMAT: ${message.subject}\nWIADOMOŚĆ NIE ZOSTAŁA WYSŁANA (brak konfiguracji EMAIL_PROVIDER) -->\n${message.html}`);
  console.info(`[email] (tryb deweloperski) Zapisano podgląd e-maila: ${file}`);
  return { sent: false, error: "Wysyłka e-maili nie jest skonfigurowana (podgląd zapisany w data/outbox).", preview: file };
}

/* ------------------------------------------------------------------ szablony */

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function layout(title: string, body: string, siteUrl: string): string {
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${esc(title)}</title></head>
<body style="margin:0;background:#f6f1e6;font-family:Arial,Helvetica,sans-serif;color:#23271f">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1e6;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#fbf8f1;border:1px solid #ddd3bf">
<tr><td style="background:#1f3a2b;padding:28px 32px;text-align:center;color:#f6f1e6;letter-spacing:6px;font-size:13px">NOVELIA ZDROWIE</td></tr>
<tr><td style="padding:32px">${body}</td></tr>
<tr><td style="padding:20px 32px;border-top:1px solid #ddd3bf;font-size:12px;line-height:1.6;color:#5e6455">
Wiadomość wysłana automatycznie przez sklep NOVELIA ZDROWIE (${esc(siteUrl.replace(/^https?:\/\//, ""))}).<br>
Publikacje mają charakter edukacyjny i nie zastępują konsultacji z lekarzem lub dietetykiem.</td></tr>
</table></td></tr></table></body></html>`;
}

function linksHtml(links: DownloadLink[]): string {
  return links
    .map(
      (l) => `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 14px;border:1px solid #ddd3bf;background:#ffffff"><tr><td style="padding:16px 18px">
<div style="font-family:Georgia,serif;font-size:18px;color:#1f3a2b">${esc(l.title)}</div>
<div style="font-size:12px;color:#5e6455;margin:4px 0 12px">PDF · link ważny do ${esc(formatDate(l.expiresAt))} · pozostało pobrań: ${l.remaining}</div>
<a href="${esc(l.url)}" style="display:inline-block;background:#1f3a2b;color:#f6f1e6;text-decoration:none;padding:12px 22px;font-size:14px;letter-spacing:1px">POBIERZ PDF</a>
</td></tr></table>`,
    )
    .join("");
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("pl-PL", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Warsaw" }).format(new Date(iso));
}

export function orderPaidEmail(order: OrderRecord, links: DownloadLink[], siteUrl: string): EmailMessage {
  const items = order.items.map((i) => `<tr><td style="padding:6px 0">${esc(i.title)}</td><td style="padding:6px 0;text-align:right">${formatPrice(i.price)}</td></tr>`).join("");
  const body = `<h1 style="font-family:Georgia,serif;font-weight:normal;color:#1f3a2b;font-size:26px;margin:0 0 12px">Dziękujemy za zakup!</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 20px">Płatność za zamówienie <strong>${esc(order.number)}</strong> została potwierdzona. Twoje publikacje są gotowe do pobrania:</p>
${linksHtml(links)}
<p style="font-size:13px;line-height:1.6;color:#5e6455">Jeśli link wygaśnie lub wykorzystasz limit pobrań, wygenerujesz nowe linki na stronie <a href="${esc(siteUrl)}/pobieranie" style="color:#1f3a2b">${esc(siteUrl.replace(/^https?:\/\//, ""))}/pobieranie</a>, podając adres e-mail i numer zamówienia.</p>
<h2 style="font-family:Georgia,serif;font-weight:normal;color:#1f3a2b;font-size:18px;margin:28px 0 8px">Podsumowanie zamówienia</h2>
<table role="presentation" width="100%" style="font-size:14px;border-top:1px solid #ddd3bf">${items}<tr><td style="padding:8px 0;border-top:1px solid #ddd3bf"><strong>Razem</strong></td><td style="padding:8px 0;border-top:1px solid #ddd3bf;text-align:right"><strong>${formatPrice(order.total)}</strong></td></tr></table>
<h2 style="font-family:Georgia,serif;font-weight:normal;color:#1f3a2b;font-size:18px;margin:28px 0 8px">Potwierdzenie złożonych oświadczeń</h2>
<p style="font-size:12px;line-height:1.6;color:#5e6455;margin:0 0 8px">Przy składaniu zamówienia (${esc(formatDate(order.createdAt))}) zaakceptowano Regulamin sklepu i Regulamin sprzedaży treści cyfrowych oraz złożono oświadczenie:</p>
<p style="font-size:12px;line-height:1.6;color:#23271f;margin:0;padding:10px 12px;background:#f6f1e6">„${esc(order.digitalConsentText)}”</p>
<p style="font-size:12px;line-height:1.6;color:#5e6455;margin:12px 0 0">Regulaminy: <a href="${esc(siteUrl)}/regulamin" style="color:#1f3a2b">Regulamin sklepu</a> · <a href="${esc(siteUrl)}/regulamin-tresci-cyfrowych" style="color:#1f3a2b">Regulamin sprzedaży treści cyfrowych</a></p>`;
  const text = [
    "Dziękujemy za zakup w NOVELIA ZDROWIE!",
    `Płatność za zamówienie ${order.number} została potwierdzona.`,
    "",
    ...links.map((l) => `${l.title}: ${l.url} (ważny do ${formatDate(l.expiresAt)}, pozostało pobrań: ${l.remaining})`),
    "",
    `Nowe linki: ${siteUrl}/pobieranie`,
    `Razem: ${formatPrice(order.total)}`,
    "",
    `Oświadczenie złożone przy zamówieniu: „${order.digitalConsentText}”`,
  ].join("\n");
  return { to: order.customerEmail, subject: `Twoje e-booki są gotowe do pobrania – zamówienie ${order.number}`, html: layout("Twoje e-booki", body, siteUrl), text };
}

export function resendLinksEmail(order: OrderRecord, links: DownloadLink[], siteUrl: string): EmailMessage {
  const body = `<h1 style="font-family:Georgia,serif;font-weight:normal;color:#1f3a2b;font-size:24px;margin:0 0 12px">Nowe linki do pobrania</h1>
<p style="font-size:15px;line-height:1.6;margin:0 0 20px">Na Twoją prośbę przygotowaliśmy nowe linki do publikacji z zamówienia <strong>${esc(order.number)}</strong>:</p>${linksHtml(links)}
<p style="font-size:13px;line-height:1.6;color:#5e6455">Jeśli ta wiadomość nie jest odpowiedzią na Twoją prośbę, możesz ją zignorować.</p>`;
  const text = [`Nowe linki do zamówienia ${order.number}:`, ...links.map((l) => `${l.title}: ${l.url} (ważny do ${formatDate(l.expiresAt)})`)].join("\n");
  return { to: order.customerEmail, subject: `Nowe linki do pobrania – zamówienie ${order.number}`, html: layout("Nowe linki do pobrania", body, siteUrl), text };
}

export function shopNotificationEmail(order: OrderRecord, to: string, siteUrl: string): EmailMessage {
  const list = order.items.map((i) => `${i.title} – ${formatPrice(i.price)}`).join("\n");
  const body = `<h1 style="font-family:Georgia,serif;font-weight:normal;color:#1f3a2b;font-size:22px;margin:0 0 12px">Nowe opłacone zamówienie ${esc(order.number)}</h1>
<p style="font-size:14px;line-height:1.6;white-space:pre-line">${esc(list)}\nRazem: ${formatPrice(order.total)}\nKlient: ${esc(order.customerName || "—")} &lt;${esc(order.customerEmail)}&gt;</p>`;
  return { to, subject: `Nowe zamówienie ${order.number} – ${formatPrice(order.total)}`, html: layout("Nowe zamówienie", body, siteUrl), text: `${order.number}\n${list}\nRazem: ${formatPrice(order.total)}\n${order.customerEmail}` };
}

export function contactEmail(input: { name: string; email: string; topic: string; message: string }, to: string, siteUrl: string): EmailMessage {
  const body = `<h1 style="font-family:Georgia,serif;font-weight:normal;color:#1f3a2b;font-size:22px;margin:0 0 12px">Wiadomość z formularza kontaktowego</h1>
<p style="font-size:14px;line-height:1.6"><strong>Od:</strong> ${esc(input.name)} &lt;${esc(input.email)}&gt;<br><strong>Temat:</strong> ${esc(input.topic)}</p>
<p style="font-size:14px;line-height:1.7;white-space:pre-line;background:#f6f1e6;padding:14px">${esc(input.message)}</p>`;
  return {
    to,
    subject: `[Kontakt] ${input.topic}`,
    html: layout("Wiadomość z formularza", body, siteUrl),
    text: `Od: ${input.name} <${input.email}>\nTemat: ${input.topic}\n\n${input.message}`,
    replyTo: input.email,
  };
}
