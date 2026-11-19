import "server-only";

import { site } from "@/config/site";
import { getService } from "@/data/services";
import { localePath, type Locale } from "@/i18n/config";
import { BOOKING_RULES } from "@/lib/booking/rules";
import { env } from "./env";
import { escapeHtml, sendMail } from "./mail";
import type { Booking } from "./store/types";

export const CLIENT_CANCEL_REASON = "client";

export type ClientEvent ="created" | "confirmed" | "cancelled" | "rescheduled";
export type StudioEvent = "created" | "cancelled_by_client" | "rescheduled_by_client";

const copy = {
  pl: {
    subject: {
      created: "Rezerwacja przyjęta",
      confirmed: "Sesja potwierdzona",
      cancelled: "Rezerwacja anulowana",
      rescheduled: "Termin zmieniony",
    },
    lead: {
      created: "Dzięki! Mamy Twoją rezerwację. Termin jest zablokowany – potwierdzimy go w ciągu 24 godzin.",
      confirmed: "Twoja sesja jest potwierdzona. Do zobaczenia w studiu.",
      cancelled: "Rezerwacja została anulowana. Termin jest znowu wolny.",
      rescheduled: "Zmieniliśmy termin Twojej rezerwacji. Nowy termin czeka na potwierdzenie studia.",
    },
    service: "Usługa",
    when: "Termin",
    length: "Długość",
    where: "Adres",
    manage: "Zmień termin lub anuluj",
    manageNote: `Zmiana i anulowanie przez link są możliwe do ${BOOKING_RULES.selfServiceCutoffHours} h przed sesją.`,
    reason: "Powód",
    hours: (h: number) => `${h} h`,
    footer: "Wiadomość wysłana automatycznie przez system rezerwacji RIFT Studio.",
  },
  en: {
    subject: {
      created: "Booking received",
      confirmed: "Session confirmed",
      cancelled: "Booking cancelled",
      rescheduled: "Booking moved",
    },
    lead: {
      created: "Thanks! We have your booking. The slot is held for you and we will confirm it within 24 hours.",
      confirmed: "Your session is confirmed. See you at the studio.",
      cancelled: "Your booking has been cancelled. The slot is free again.",
      rescheduled: "Your booking has been moved. The new time is waiting for the studio to confirm it.",
    },
    service: "Service",
    when: "Date",
    length: "Length",
    where: "Address",
    manage: "Change or cancel",
    manageNote: `You can change or cancel through this link up to ${BOOKING_RULES.selfServiceCutoffHours} hours before the session.`,
    reason: "Reason",
    hours: (h: number) => `${h} h`,
    footer: "Sent automatically by the RIFT Studio booking system.",
  },
} as const;

export function formatSlot(b: Pick<Booking, "startsAt" | "endsAt">, lang: Locale): string {
  const loc = lang === "pl" ? "pl-PL" : "en-GB";
  const tz = BOOKING_RULES.timeZone;
  const day = new Intl.DateTimeFormat(loc, { timeZone: tz, weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date(b.startsAt));
  const time = new Intl.DateTimeFormat(loc, { timeZone: tz, hour: "2-digit", minute: "2-digit" });
  return `${day}, ${time.format(new Date(b.startsAt))}–${time.format(new Date(b.endsAt))}`;
}

const address = `${site.address.street}, ${site.address.postalCode} ${site.address.city}`;

function layout(title: string, rows: [string, string][], lead: string, cta?: { href: string; label: string; note: string }, footer = "") {
  const rowsHtml = rows
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#8C95A5">${escapeHtml(k)}</td><td style="padding:6px 0;color:#E9EDF3">${escapeHtml(v)}</td></tr>`)
    .join("");
  const ctaHtml = cta
    ? `<p style="margin:28px 0 8px"><a href="${escapeHtml(cta.href)}" style="background:#3D6BFF;color:#fff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:600">${escapeHtml(cta.label)}</a></p><p style="color:#8C95A5;font-size:13px">${escapeHtml(cta.note)}</p>`
    : "";
  return `<!doctype html><html><body style="margin:0;background:#030407;font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:1.55">
<div style="max-width:560px;margin:0 auto;padding:32px 24px;color:#E9EDF3">
<p style="font-size:22px;font-weight:800;letter-spacing:.04em;margin:0 0 4px">RIFT<span style="color:#3BE8FF">/</span>STUDIO</p>
<div style="height:2px;background:linear-gradient(90deg,#3BE8FF,#8A63FF);margin:0 0 24px"></div>
<h1 style="font-size:20px;margin:0 0 12px">${escapeHtml(title)}</h1>
<p style="margin:0 0 20px;color:#C9D0DB">${escapeHtml(lead)}</p>
<table style="border-collapse:collapse;font-size:14px">${rowsHtml}</table>${ctaHtml}
<p style="margin-top:32px;color:#5E6676;font-size:12px">${escapeHtml(footer)}</p></div></body></html>`;
}

export async function notifyClient(event: ClientEvent, b: Booking, manageToken?: string) {
  const t = copy[b.lang];
  const rows: [string, string][] = [
    [t.service, getService(b.service).name[b.lang]],
    [t.when, formatSlot(b, b.lang)],
    [t.length, t.hours(b.durationMin / 60)],
    [t.where, address],
  ];
  // „client” to wewnętrzny znacznik anulowania przez samego klienta – nie pokazujemy go jako powodu.
  if (event === "cancelled" && b.cancelReason && b.cancelReason !== CLIENT_CANCEL_REASON) rows.push([t.reason, b.cancelReason]);
  const cta =
    manageToken && event !== "cancelled"
      ? { href: `${env.siteUrl()}${localePath(b.lang, `/rezerwacja/${manageToken}`)}`, label: t.manage, note: t.manageNote }
      : undefined;
  const subject = `${t.subject[event]} – RIFT Studio`;
  const text = [t.lead[event], "", ...rows.map(([k, v]) => `${k}: ${v}`), cta ? `\n${cta.label}: ${cta.href}\n${cta.note}` : "", "", t.footer].join("\n");
  return sendMail({ to: b.email, subject, text, html: layout(t.subject[event], rows, t.lead[event], cta, t.footer), replyTo: site.contact.email });
}

const studioCopy: Record<StudioEvent, string> = {
  created: "Nowa rezerwacja do potwierdzenia",
  cancelled_by_client: "Klient anulował rezerwację",
  rescheduled_by_client: "Klient zmienił termin – do potwierdzenia",
};

export async function notifyStudio(event: StudioEvent, b: Booking) {
  const to = env.studioEmail();
  if (!to) return false;
  const rows: [string, string][] = [
    ["Usługa", getService(b.service).name.pl],
    ["Termin", formatSlot(b, "pl")],
    ["Klient", b.name],
    ["E-mail", b.email],
    ["Telefon", b.phone || "—"],
    ["Brzmienie", b.sound || "—"],
    ["Wiadomość", b.message || "—"],
    ["Język", b.lang.toUpperCase()],
  ];
  const cta = { href: `${env.siteUrl()}/admin`, label: "Otwórz panel rezerwacji", note: `ID: ${b.id}` };
  const text = [studioCopy[event], "", ...rows.map(([k, v]) => `${k}: ${v}`), "", `${cta.label}: ${cta.href}`].join("\n");
  return sendMail({ to, subject: `${studioCopy[event]}: ${b.name}`, text, html: layout(studioCopy[event], rows, "", cta), replyTo: b.email });
}
