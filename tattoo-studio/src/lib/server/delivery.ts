import "server-only";

import { createHmac } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { isAbsolute, join, resolve } from "node:path";
import nodemailer from "nodemailer";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { pl } from "@/i18n/dictionaries/pl";
import type { BookingData } from "@/lib/booking/schema";
import type { DeliveryConfig } from "./env";

export interface Attachment {
  filename: string;
  contentType: string;
  content: Buffer;
}

export interface BookingSubmission {
  reference: string;
  submittedAt: string;
  /** Język, w którym klient wypełnił formularz. */
  locale: Locale;
  data: BookingData;
  attachments: Attachment[];
}

export interface DeliveryResult {
  channel: "email" | "webhook" | "storage";
  ok: boolean;
  error?: string;
}

/**
 * Czytelne podsumowanie zgłoszenia dla studia — po polsku, niezależnie od języka klienta
 * (język klienta jest podany w polu „Język klienta”, aby odpowiedzieć w tym samym języku).
 */
export function summarize(submission: BookingSubmission): { section: string; rows: [string, string][] }[] {
  const d = submission.data;
  const b = pl.booking;
  const o = b.options;
  const l = b.review.labels;
  const g = b.review.groups;
  const dash = "—";
  return [
    {
      section: g[0],
      rows: [
        [l.fullName, d.fullName],
        [l.email, d.email],
        [l.phone, d.phone || dash],
        [l.contactMethod, d.contactMethod === "phone" ? b.fields.contactPhone : b.fields.contactEmail],
        ["Język klienta", submission.locale === "en" ? "angielski (EN)" : "polski (PL)"],
      ],
    },
    {
      section: g[1],
      rows: [
        [l.description, d.description],
        [l.meaning, d.meaning || dash],
        [l.firstTattoo, d.firstTattoo === "yes" ? b.fields.yes : b.fields.no],
        [l.design, d.designType === "new" ? b.fields.designNew : b.fields.designExisting],
      ],
    },
    {
      section: g[2],
      rows: [
        [l.styles, d.styles.map((s) => o.styles[s].label).join(", ")],
        [l.placement, (d.placement ? o.placements[d.placement] : dash) + (d.placementNote ? ` (${d.placementNote})` : "")],
        [l.side, d.side ? o.sides[d.side] : dash],
      ],
    },
    {
      section: g[3],
      rows: [
        [l.size, d.size ? o.sizes[d.size].label : dash],
        [l.budget, d.budget ? o.budgets[d.budget] : dash],
        [l.date, d.preferredDate || b.review.noPreference],
        [b.fields.preferredTime, o.times[d.preferredTime]],
      ],
    },
    {
      section: g[4],
      rows: [[l.images, submission.attachments.length ? String(submission.attachments.length) : b.review.noImages]],
    },
    {
      section: "Zgody",
      rows: [
        ["Zapoznanie z Polityką prywatności", d.privacyAccepted ? `Tak (${submission.submittedAt})` : "Nie"],
        ["Potwierdzenie prawdziwości danych", d.accuracyConfirmed ? "Tak" : "Nie"],
      ],
    },
  ];
}

const escapeHtml = (value: string) =>
  value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

const singleLine = (value: string) => value.replace(/[\r\n\t]+/g, " ").slice(0, 120);

function emailBodies(submission: BookingSubmission): { text: string; html: string } {
  const sections = summarize(submission);
  const text = [
    `Nowe zgłoszenie projektu tatuażu ${submission.reference}`,
    `Wysłano: ${submission.submittedAt}`,
    "",
    ...sections.flatMap(({ section, rows }) => [section.toUpperCase(), ...rows.map(([k, v]) => `${k}: ${v}`), ""]),
    "To zgłoszenie nie jest potwierdzoną rezerwacją. Odpowiedz na tę wiadomość, aby skontaktować się z klientem.",
  ].join("\n");

  const html = `<!doctype html><html><body style="font-family:Georgia,serif;color:#1a1612;background:#ede8dd;padding:24px">
<div style="max-width:640px;margin:0 auto;background:#f6f2ea;padding:28px">
<p style="font-family:Arial,sans-serif;font-size:12px;letter-spacing:.2em;color:#5e574d;margin:0">${escapeHtml(siteConfig.name)}</p>
<h1 style="font-weight:normal;font-size:24px;margin:8px 0 4px">Nowe zgłoszenie ${escapeHtml(submission.reference)}</h1>
<p style="font-family:Arial,sans-serif;font-size:13px;color:#5e574d;margin:0 0 20px">Wysłano ${escapeHtml(submission.submittedAt)}</p>
${sections
  .map(
    ({ section, rows }) => `<h2 style="font-weight:normal;font-size:17px;border-top:1px solid #d8cdb8;padding-top:14px;margin:18px 0 8px">${escapeHtml(section)}</h2>
<table style="width:100%;border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
      .map(
        ([k, v]) =>
          `<tr><td style="vertical-align:top;color:#5e574d;padding:4px 12px 4px 0;width:38%">${escapeHtml(k)}</td><td style="padding:4px 0;white-space:pre-wrap">${escapeHtml(v)}</td></tr>`,
      )
      .join("")}</table>`,
  )
  .join("")}
<p style="font-family:Arial,sans-serif;font-size:12px;color:#5e574d;margin-top:24px">To zgłoszenie nie jest potwierdzoną rezerwacją. Odpowiedz na tę wiadomość, aby skontaktować się z klientem.</p>
</div></body></html>`;

  return { text, html };
}

async function sendEmail(config: NonNullable<DeliveryConfig["smtp"]>, submission: BookingSubmission): Promise<void> {
  const transport = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.user ? { user: config.user, pass: config.pass } : undefined,
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 20_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  const { text, html } = emailBodies(submission);
  await transport.sendMail({
    from: config.from,
    to: config.to,
    replyTo: { name: singleLine(submission.data.fullName), address: submission.data.email },
    subject: `Nowe zgłoszenie ${submission.reference}: ${singleLine(submission.data.fullName)}`,
    text,
    html,
    attachments: submission.attachments.map((a) => ({ filename: a.filename, content: a.content, contentType: a.contentType })),
  });
}

/** Webhook (np. Make, Zapier, n8n, CRM). Treść podpisana HMAC-SHA256: `X-Booking-Signature: sha256=<hex>` z `${timestamp}.${body}`. */
async function sendWebhook(config: NonNullable<DeliveryConfig["webhook"]>, submission: BookingSubmission): Promise<void> {
  const body = JSON.stringify({
    type: "tattoo_booking_request",
    reference: submission.reference,
    submittedAt: submission.submittedAt,
    locale: submission.locale,
    data: submission.data,
    summary: summarize(submission),
    attachments: submission.attachments.map((a) => ({
      filename: a.filename,
      contentType: a.contentType,
      size: a.content.length,
      base64: a.content.toString("base64"),
    })),
  });
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const headers: Record<string, string> = { "Content-Type": "application/json", "X-Booking-Timestamp": timestamp };
  if (config.secret) {
    headers["X-Booking-Signature"] = `sha256=${createHmac("sha256", config.secret).update(`${timestamp}.${body}`).digest("hex")}`;
  }
  const response = await fetch(config.url, { method: "POST", headers, body, signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error(`Webhook responded with HTTP ${response.status}`);
}

/**
 * Archiwum na dysku serwera: `<BOOKING_STORAGE_DIR>/RRRR/MM/<numer>/request.json` + załączniki.
 * Katalog musi leżeć POZA `public/` — pliki nie mogą być dostępne z internetu.
 */
async function store(dir: string, submission: BookingSubmission): Promise<void> {
  // Ścieżka pochodzi z konfiguracji uruchomieniowej — wyłączamy ją ze statycznego śledzenia plików przy buildzie.
  const cwd = process.cwd();
  const root = isAbsolute(dir) ? dir : resolve(/*turbopackIgnore: true*/ cwd, dir);
  if (root.startsWith(resolve(/*turbopackIgnore: true*/ cwd, "public"))) throw new Error("BOOKING_STORAGE_DIR must not be inside public/");
  const [year, month] = submission.submittedAt.slice(0, 7).split("-");
  const target = join(root, year, month, submission.reference);
  await mkdir(target, { recursive: true, mode: 0o700 });
  await writeFile(
    join(target, "request.json"),
    JSON.stringify(
      {
        reference: submission.reference,
        submittedAt: submission.submittedAt,
        locale: submission.locale,
        data: submission.data,
        attachments: submission.attachments.map((a) => ({ filename: a.filename, contentType: a.contentType, size: a.content.length })),
      },
      null,
      2,
    ),
    { mode: 0o600, flag: "wx" },
  );
  for (const attachment of submission.attachments) {
    await writeFile(join(target, attachment.filename), attachment.content, { mode: 0o600, flag: "wx" });
  }
}

/**
 * Przekazuje zgłoszenie do wszystkich skonfigurowanych kanałów.
 * Zgłoszenie uznajemy za przyjęte, gdy dotarło do studia: jeśli skonfigurowano e-mail lub webhook,
 * co najmniej jeden z nich musi się powieść; jeśli jedynym kanałem jest archiwum — musi się powieść zapis.
 */
export async function deliver(config: DeliveryConfig, submission: BookingSubmission): Promise<{ accepted: boolean; results: DeliveryResult[] }> {
  const tasks: Promise<DeliveryResult>[] = [];
  const run = (channel: DeliveryResult["channel"], task: () => Promise<void>) =>
    tasks.push(
      task().then(
        () => ({ channel, ok: true }),
        (error: unknown) => ({ channel, ok: false, error: error instanceof Error ? error.message : String(error) }),
      ),
    );

  if (config.smtp) run("email", () => sendEmail(config.smtp!, submission));
  if (config.webhook) run("webhook", () => sendWebhook(config.webhook!, submission));
  if (config.storageDir) run("storage", () => store(config.storageDir!, submission));

  const results = await Promise.all(tasks);
  const notify = results.filter((r) => r.channel !== "storage");
  const accepted = notify.length > 0 ? notify.some((r) => r.ok) : results.some((r) => r.ok);
  return { accepted, results };
}
