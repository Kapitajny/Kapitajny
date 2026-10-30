/**
 * Form validation – shared by the browser (instant messages) and the server
 * (Server Actions; data from the browser is never trusted).
 */

import { categories, treatments, type CategorySlug } from "@/data/treatments";

export type FieldErrors<K extends string = string> = Partial<Record<K, string>>;

export interface ValidationResult<T, K extends string> {
  data: T | null;
  errors: FieldErrors<K>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const NAME_RE = /^[\p{L}][\p{L}\p{M}' .-]*$/u;

export const LIMITS = { name: 80, email: 120, message: 2000, consultationMessage: 1000 } as const;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateName(value: unknown): string | undefined {
  const name = text(value);
  if (!name) return "Enter your full name.";
  if (name.length < 2) return "The name is too short.";
  if (name.length > LIMITS.name) return `The name can be up to ${LIMITS.name} characters.`;
  if (!NAME_RE.test(name)) return "Use letters, spaces, apostrophes and hyphens only.";
  return undefined;
}

export function validateEmail(value: unknown): string | undefined {
  const email = text(value);
  if (!email) return "Enter your e-mail address.";
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return "Check the e-mail address – it should look like name@domain.com.";
  return undefined;
}

/** Returns the number as +48XXXXXXXXX (or international), or `null` when it is not valid. */
export function normalizePhone(value: unknown): string | null {
  const raw = text(value).replace(/[\s().-]/g, "");
  if (/^\d{9}$/.test(raw)) return `+48${raw}`;
  if (/^(\+48|0048)\d{9}$/.test(raw)) return `+48${raw.slice(-9)}`;
  if (/^(\+|00)[1-9]\d{7,14}$/.test(raw)) return `+${raw.replace(/^(\+|00)/, "")}`;
  return null;
}

export function validatePhone(value: unknown, required: boolean): string | undefined {
  if (!text(value)) return required ? "Enter a phone number so we can call you back." : undefined;
  if (!normalizePhone(value)) return "Check the phone number – for example 600 100 200 or +48 600 100 200.";
  return undefined;
}

export function validateConsent(value: unknown): string | undefined {
  return value === "on" || value === true || value === "true" ? undefined : "Tick the consent box – without it we can't reply to you.";
}

/** Today's date in Europe/Warsaw as YYYY-MM-DD. */
export function todayInWarsaw(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function addMonths(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1 + months, d)).toISOString().slice(0, 10);
}

export function maxBookingDate(now: Date = new Date()): string {
  return addMonths(todayInWarsaw(now), 6);
}

export function validateDateFrom(value: unknown, now: Date = new Date()): string | undefined {
  const date = text(value);
  if (!date) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) return "Choose a date from the calendar.";
  if (date < todayInWarsaw(now)) return "That date has passed – choose today or a later date.";
  if (date > maxBookingDate(now)) return "We take requests up to six months ahead.";
  return undefined;
}

/* ─────────────────────────── Contact form ─────────────────────────── */

export const contactTopics = [
  { value: "treatment", label: "A question about a treatment" },
  { value: "appointment", label: "An existing appointment" },
  { value: "other", label: "Something else" },
] as const;

export type ContactField = "name" | "email" | "phone" | "topic" | "message" | "consent";

export interface ContactData {
  name: string;
  email: string;
  phone: string | null;
  topic: (typeof contactTopics)[number]["value"];
  message: string;
}

export function validateContact(input: Record<string, unknown>): ValidationResult<ContactData, ContactField> {
  const errors: FieldErrors<ContactField> = {};
  errors.name = validateName(input.name);
  errors.email = validateEmail(input.email);
  errors.phone = validatePhone(input.phone, false);

  const topic = text(input.topic);
  if (!contactTopics.some((t) => t.value === topic)) errors.topic = "Choose what your message is about.";

  const message = text(input.message);
  if (message.length < 10) errors.message = "Write a few words – at least 10 characters.";
  else if (message.length > LIMITS.message) errors.message = `The message can be up to ${LIMITS.message} characters.`;

  errors.consent = validateConsent(input.consent);

  const clean = stripEmpty(errors);
  if (Object.keys(clean).length) return { data: null, errors: clean };
  return {
    data: {
      name: text(input.name),
      email: text(input.email).toLowerCase(),
      phone: text(input.phone) ? normalizePhone(input.phone) : null,
      topic: topic as ContactData["topic"],
      message,
    },
    errors: {},
  };
}

/* ─────────────────────────── Consultation request ─────────────────────────── */

export const UNSURE = "not-sure" as const;
export type ConsultationCategory = CategorySlug | typeof UNSURE;

export const weekdays = [
  { value: "mon", label: "Mon", full: "Monday" },
  { value: "tue", label: "Tue", full: "Tuesday" },
  { value: "wed", label: "Wed", full: "Wednesday" },
  { value: "thu", label: "Thu", full: "Thursday" },
  { value: "fri", label: "Fri", full: "Friday" },
  { value: "sat", label: "Sat", full: "Saturday" },
] as const;

export const timesOfDay = [
  { value: "morning", label: "Morning", hint: "9:00–12:00" },
  { value: "midday", label: "Midday", hint: "12:00–16:00" },
  { value: "evening", label: "After work", hint: "16:00–20:00" },
  { value: "any", label: "Any time", hint: "" },
] as const;

export const contactChannels = [
  { value: "phone", label: "By phone" },
  { value: "email", label: "By e-mail" },
] as const;

export type ConsultationField = "category" | "treatment" | "firstVisit" | "days" | "timeOfDay" | "dateFrom" | "name" | "phone" | "email" | "contactBy" | "message" | "consent";

export interface ConsultationData {
  category: ConsultationCategory;
  treatment: string | null;
  firstVisit: boolean;
  days: string[];
  timeOfDay: (typeof timesOfDay)[number]["value"];
  dateFrom: string | null;
  name: string;
  phone: string;
  email: string;
  contactBy: (typeof contactChannels)[number]["value"];
  message: string | null;
}

export function validateConsultation(input: Record<string, unknown>, now: Date = new Date()): ValidationResult<ConsultationData, ConsultationField> {
  const errors: FieldErrors<ConsultationField> = {};

  const category = text(input.category);
  const validCategory = category === UNSURE || categories.some((c) => c.slug === category);
  if (!validCategory) errors.category = "Choose the area you are interested in.";

  const treatment = text(input.treatment);
  if (treatment) {
    const found = treatments.find((t) => t.slug === treatment);
    if (!found) errors.treatment = "Choose a treatment from the list.";
    else if (validCategory && category !== UNSURE && found.category !== category) errors.treatment = "This treatment belongs to another area – choose it again.";
  }

  const firstVisit = text(input.firstVisit);
  if (firstVisit !== "yes" && firstVisit !== "no") errors.firstVisit = "Tell us whether this is your first visit.";

  const rawDays = Array.isArray(input.days) ? input.days : input.days ? [input.days] : [];
  const days = rawDays.map(text).filter(Boolean);
  if (days.some((d) => !weekdays.some((w) => w.value === d))) errors.days = "Choose days from the list.";

  const timeOfDay = text(input.timeOfDay) || "any";
  if (!timesOfDay.some((t) => t.value === timeOfDay)) errors.timeOfDay = "Choose a time of day.";

  errors.dateFrom = validateDateFrom(input.dateFrom, now);
  errors.name = validateName(input.name);
  errors.phone = validatePhone(input.phone, true);
  errors.email = validateEmail(input.email);

  const contactBy = text(input.contactBy) || "phone";
  if (!contactChannels.some((c) => c.value === contactBy)) errors.contactBy = "Choose how we should contact you.";

  const message = text(input.message);
  if (message.length > LIMITS.consultationMessage) errors.message = `The note can be up to ${LIMITS.consultationMessage} characters.`;

  errors.consent = validateConsent(input.consent);

  const clean = stripEmpty(errors);
  if (Object.keys(clean).length) return { data: null, errors: clean };
  return {
    data: {
      category: category as ConsultationCategory,
      treatment: treatment || null,
      firstVisit: firstVisit === "yes",
      days,
      timeOfDay: timeOfDay as ConsultationData["timeOfDay"],
      dateFrom: text(input.dateFrom) || null,
      name: text(input.name),
      phone: normalizePhone(input.phone)!,
      email: text(input.email).toLowerCase(),
      contactBy: contactBy as ConsultationData["contactBy"],
      message: message || null,
    },
    errors: {},
  };
}

function stripEmpty<K extends string>(errors: FieldErrors<K>): FieldErrors<K> {
  return Object.fromEntries(Object.entries(errors).filter(([, v]) => Boolean(v))) as FieldErrors<K>;
}

/** Turns FormData into a plain object; repeated fields (checkboxes) become arrays. */
export function formDataToObject(formData: FormData): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith("$ACTION")) continue;
    const v = typeof value === "string" ? value : "";
    if (key in out) out[key] = ([] as unknown[]).concat(out[key], v);
    else out[key] = key === "days" ? [v] : v;
  }
  return out;
}
