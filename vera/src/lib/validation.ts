/**
 * Form validation shared by the browser (instant messages) and the server (Server Actions –
 * input from the browser is never trusted).
 */

import { categories, treatments, type CategorySlug } from "@/data/treatments";

export type Errors<K extends string = string> = Partial<Record<K, string>>;

export interface Result<T, K extends string> {
  data: T | null;
  errors: Errors<K>;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME = /^[\p{L}][\p{L}\p{M}' .-]*$/u;

export const LIMITS = { name: 80, email: 120, message: 2000, notes: 1000 } as const;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function checkName(v: unknown) {
  const s = str(v);
  if (!s) return "Please enter your full name.";
  if (s.length < 2) return "That name looks too short.";
  if (s.length > LIMITS.name) return `Please keep your name under ${LIMITS.name} characters.`;
  if (!NAME.test(s)) return "Use letters, spaces, hyphens or apostrophes only.";
  return undefined;
}

export function checkEmail(v: unknown) {
  const s = str(v);
  if (!s) return "Please enter your e-mail address.";
  if (s.length > LIMITS.email || !EMAIL.test(s)) return "Check the e-mail address – it should look like name@example.com.";
  return undefined;
}

/** Returns the number as +48XXXXXXXXX (or international +…) or `null` if it isn't a valid number. */
export function normalisePhone(v: unknown): string | null {
  const raw = str(v).replace(/[\s().-]/g, "");
  if (/^\d{9}$/.test(raw)) return `+48${raw}`;
  if (/^(\+48|0048)\d{9}$/.test(raw)) return `+48${raw.slice(-9)}`;
  if (/^(\+|00)[1-9]\d{7,14}$/.test(raw)) return `+${raw.replace(/^(\+|00)/, "")}`;
  return null;
}

export function checkPhone(v: unknown, required: boolean) {
  if (!str(v)) return required ? "Please enter a phone number so we can call you back." : undefined;
  if (!normalisePhone(v)) return "Check the phone number – e.g. 600 100 200 or +48 600 100 200.";
  return undefined;
}

export function checkConsent(v: unknown) {
  return v === "on" || v === true || v === "true" ? undefined : "Please tick the consent box – we can't reply without it.";
}

/** Today's date in Europe/Warsaw as YYYY-MM-DD. */
export function todayInPoland(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function plusMonths(iso: string, months: number) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + months, d)).toISOString().slice(0, 10);
}

export function checkEarliestDate(v: unknown, now = new Date()) {
  const s = str(v);
  if (!s) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s) || Number.isNaN(Date.parse(`${s}T00:00:00Z`))) return "Choose a date from the calendar.";
  const today = todayInPoland(now);
  if (s < today) return "That date has passed – choose today or later.";
  if (s > plusMonths(today, 12)) return "We take requests up to 12 months ahead.";
  return undefined;
}

const drop = <K extends string>(e: Errors<K>) => Object.fromEntries(Object.entries(e).filter(([, v]) => Boolean(v))) as Errors<K>;

/* ── Contact form ─────────────────────────────────────────────────────── */

export const subjects = [
  { value: "treatment", label: "A question about a treatment" },
  { value: "appointment", label: "An existing appointment" },
  { value: "other", label: "Something else" },
] as const;

export type ContactField = "name" | "email" | "phone" | "subject" | "message" | "consent";
export interface ContactData {
  name: string;
  email: string;
  phone: string | null;
  subject: (typeof subjects)[number]["value"];
  message: string;
}

export function validateContact(input: Record<string, unknown>): Result<ContactData, ContactField> {
  const e: Errors<ContactField> = {
    name: checkName(input.name),
    email: checkEmail(input.email),
    phone: checkPhone(input.phone, false),
    consent: checkConsent(input.consent),
  };
  const subject = str(input.subject);
  if (!subjects.some((s) => s.value === subject)) e.subject = "Choose what your message is about.";
  const message = str(input.message);
  if (message.length < 10) e.message = "Please write a little more – at least 10 characters.";
  else if (message.length > LIMITS.message) e.message = `Please keep your message under ${LIMITS.message} characters.`;

  const errors = drop(e);
  if (Object.keys(errors).length) return { data: null, errors };
  return {
    data: { name: str(input.name), email: str(input.email).toLowerCase(), phone: str(input.phone) ? normalisePhone(input.phone) : null, subject: subject as ContactData["subject"], message },
    errors: {},
  };
}

/* ── Consultation request (multi-step) ────────────────────────────────── */

export const NOT_SURE = "not-sure" as const;
export type Area = CategorySlug | typeof NOT_SURE;

export const days = [
  { value: "mon", label: "Mon", full: "Monday" },
  { value: "tue", label: "Tue", full: "Tuesday" },
  { value: "wed", label: "Wed", full: "Wednesday" },
  { value: "thu", label: "Thu", full: "Thursday" },
  { value: "fri", label: "Fri", full: "Friday" },
  { value: "sat", label: "Sat", full: "Saturday" },
] as const;

export const times = [
  { value: "morning", label: "Morning", hint: "10:00–13:00" },
  { value: "afternoon", label: "Afternoon", hint: "13:00–17:00" },
  { value: "evening", label: "After work", hint: "17:00–20:00" },
  { value: "any", label: "Any time", hint: "" },
] as const;

export const channels = [
  { value: "phone", label: "Phone call" },
  { value: "email", label: "E-mail" },
] as const;

export type BookingField = "area" | "treatment" | "firstVisit" | "days" | "time" | "earliest" | "name" | "phone" | "email" | "contactBy" | "notes" | "consent";

/** Fields validated on each step of the booking form. */
export const bookingSteps: BookingField[][] = [
  ["area", "treatment", "firstVisit"],
  ["days", "time", "earliest"],
  ["name", "phone", "email", "contactBy", "notes", "consent"],
];

export interface BookingData {
  area: Area;
  treatment: string | null;
  firstVisit: boolean;
  days: string[];
  time: (typeof times)[number]["value"];
  earliest: string | null;
  name: string;
  phone: string;
  email: string;
  contactBy: (typeof channels)[number]["value"];
  notes: string | null;
}

export function validateBooking(input: Record<string, unknown>, now = new Date()): Result<BookingData, BookingField> {
  const e: Errors<BookingField> = {};
  const area = str(input.area);
  const areaOk = area === NOT_SURE || categories.some((c) => c.slug === area);
  if (!areaOk) e.area = "Choose the area you're interested in.";

  const treatment = str(input.treatment);
  if (treatment) {
    const t = treatments.find((x) => x.slug === treatment);
    if (!t) e.treatment = "Choose a treatment from the list.";
    else if (areaOk && area !== NOT_SURE && t.category !== area) e.treatment = "This treatment belongs to another area – please choose again.";
  }

  const firstVisit = str(input.firstVisit);
  if (firstVisit !== "yes" && firstVisit !== "no") e.firstVisit = "Let us know whether this is your first visit.";

  const rawDays = Array.isArray(input.days) ? input.days : input.days ? [input.days] : [];
  const picked = rawDays.map(str).filter(Boolean);
  if (picked.some((d) => !days.some((x) => x.value === d))) e.days = "Choose days from the list.";

  const time = str(input.time) || "any";
  if (!times.some((t) => t.value === time)) e.time = "Choose a time of day.";

  e.earliest = checkEarliestDate(input.earliest, now);
  e.name = checkName(input.name);
  e.phone = checkPhone(input.phone, true);
  e.email = checkEmail(input.email);

  const contactBy = str(input.contactBy) || "phone";
  if (!channels.some((c) => c.value === contactBy)) e.contactBy = "Choose how we should contact you.";

  const notes = str(input.notes);
  if (notes.length > LIMITS.notes) e.notes = `Please keep notes under ${LIMITS.notes} characters.`;
  e.consent = checkConsent(input.consent);

  const errors = drop(e);
  if (Object.keys(errors).length) return { data: null, errors };
  return {
    data: {
      area: area as Area,
      treatment: treatment || null,
      firstVisit: firstVisit === "yes",
      days: picked,
      time: time as BookingData["time"],
      earliest: str(input.earliest) || null,
      name: str(input.name),
      phone: normalisePhone(input.phone)!,
      email: str(input.email).toLowerCase(),
      contactBy: contactBy as BookingData["contactBy"],
      notes: notes || null,
    },
    errors: {},
  };
}

/** FormData → plain object; repeated fields (checkboxes) become arrays. */
export function formToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION")) continue;
    const v = typeof value === "string" ? value : "";
    if (key in out) out[key] = ([] as unknown[]).concat(out[key], v);
    else out[key] = key === "days" ? [v] : v;
  }
  return out;
}
