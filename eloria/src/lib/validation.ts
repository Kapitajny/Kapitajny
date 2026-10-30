/**
 * Walidacja formularzy – wspólna dla przeglądarki (natychmiastowe komunikaty)
 * i serwera (Server Actions; dane z przeglądarki nigdy nie są traktowane jako zaufane).
 */

import { categories, services, type CategorySlug } from "@/data/services";

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
  if (!name) return "Podaj imię i nazwisko.";
  if (name.length < 2) return "Imię i nazwisko jest za krótkie.";
  if (name.length > LIMITS.name) return `Imię i nazwisko może mieć najwyżej ${LIMITS.name} znaków.`;
  if (!NAME_RE.test(name)) return "Imię i nazwisko może zawierać tylko litery, spacje, apostrof i myślnik.";
  return undefined;
}

export function validateEmail(value: unknown): string | undefined {
  const email = text(value);
  if (!email) return "Podaj adres e-mail.";
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) return "Sprawdź adres e-mail – powinien wyglądać jak imie@domena.pl.";
  return undefined;
}

/** Zwraca numer w formacie +48XXXXXXXXX (lub międzynarodowym) albo `null`, gdy numer jest niepoprawny. */
export function normalizePhone(value: unknown): string | null {
  const raw = text(value).replace(/[\s().-]/g, "");
  if (/^\d{9}$/.test(raw)) return `+48${raw}`;
  if (/^(\+48|0048)\d{9}$/.test(raw)) return `+48${raw.slice(-9)}`;
  if (/^(\+|00)[1-9]\d{7,14}$/.test(raw)) return `+${raw.replace(/^(\+|00)/, "")}`;
  return null;
}

export function validatePhone(value: unknown, required: boolean): string | undefined {
  if (!text(value)) return required ? "Podaj numer telefonu, abyśmy mogli oddzwonić." : undefined;
  if (!normalizePhone(value)) return "Sprawdź numer telefonu – np. 600 100 200 lub +48 600 100 200.";
  return undefined;
}

export function validateConsent(value: unknown): string | undefined {
  return value === "on" || value === true || value === "true"
    ? undefined
    : "Zaznacz zgodę – bez niej nie możemy odpowiedzieć na Twoją wiadomość.";
}

/** Dzisiejsza data w strefie Europe/Warsaw w formacie RRRR-MM-DD. */
export function todayInWarsaw(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function addMonths(isoDate: string, months: number): string {
  const [y, m, d] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1 + months, d));
  return date.toISOString().slice(0, 10);
}

export function validateDateFrom(value: unknown, now: Date = new Date()): string | undefined {
  const date = text(value);
  if (!date) return undefined;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) return "Wybierz datę z kalendarza.";
  const today = todayInWarsaw(now);
  if (date < today) return "Ta data już minęła – wybierz dzisiejszą lub późniejszą.";
  if (date > addMonths(today, 12)) return "Przyjmujemy zapytania z wyprzedzeniem do 12 miesięcy.";
  return undefined;
}

/* ─────────────────────────── Formularz kontaktowy ─────────────────────────── */

export const contactTopics = [
  { value: "zabieg", label: "Pytanie o zabieg" },
  { value: "wizyta", label: "Umówiona wizyta" },
  { value: "inne", label: "Inna sprawa" },
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
  if (!contactTopics.some((t) => t.value === topic)) errors.topic = "Wybierz temat wiadomości.";

  const message = text(input.message);
  if (message.length < 10) errors.message = "Napisz kilka słów – co najmniej 10 znaków.";
  else if (message.length > LIMITS.message) errors.message = `Wiadomość może mieć najwyżej ${LIMITS.message} znaków.`;

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

/* ─────────────────────────── Zapytanie o konsultację ─────────────────────────── */

export const UNSURE = "nie-wiem" as const;
export type ConsultationCategory = CategorySlug | typeof UNSURE;

export const weekdays = [
  { value: "pn", label: "Pon." , full: "poniedziałek" },
  { value: "wt", label: "Wt.", full: "wtorek" },
  { value: "sr", label: "Śr.", full: "środa" },
  { value: "cz", label: "Czw.", full: "czwartek" },
  { value: "pt", label: "Pt.", full: "piątek" },
  { value: "sb", label: "Sob.", full: "sobota" },
] as const;

export const timesOfDay = [
  { value: "rano", label: "Rano", hint: "9:00–12:00" },
  { value: "poludnie", label: "W ciągu dnia", hint: "12:00–16:00" },
  { value: "wieczor", label: "Po pracy", hint: "16:00–20:00" },
  { value: "dowolnie", label: "Bez znaczenia", hint: "" },
] as const;

export const contactChannels = [
  { value: "telefon", label: "Telefonicznie" },
  { value: "email", label: "E-mailem" },
] as const;

export type ConsultationField =
  | "category"
  | "service"
  | "firstVisit"
  | "days"
  | "timeOfDay"
  | "dateFrom"
  | "name"
  | "phone"
  | "email"
  | "contactBy"
  | "message"
  | "consent";

export interface ConsultationData {
  category: ConsultationCategory;
  service: string | null;
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
  if (!validCategory) errors.category = "Wybierz obszar, który Cię interesuje.";

  const service = text(input.service);
  if (service) {
    const found = services.find((s) => s.slug === service);
    if (!found) errors.service = "Wybierz zabieg z listy.";
    else if (validCategory && category !== UNSURE && found.category !== category) errors.service = "Ten zabieg należy do innego obszaru – wybierz go ponownie.";
  }

  const firstVisit = text(input.firstVisit);
  if (firstVisit !== "tak" && firstVisit !== "nie") errors.firstVisit = "Zaznacz, czy to Twoja pierwsza wizyta.";

  const rawDays = Array.isArray(input.days) ? input.days : input.days ? [input.days] : [];
  const days = rawDays.map(text).filter(Boolean);
  if (days.some((d) => !weekdays.some((w) => w.value === d))) errors.days = "Wybierz dni z listy.";

  const timeOfDay = text(input.timeOfDay) || "dowolnie";
  if (!timesOfDay.some((t) => t.value === timeOfDay)) errors.timeOfDay = "Wybierz porę dnia.";

  errors.dateFrom = validateDateFrom(input.dateFrom, now);
  errors.name = validateName(input.name);
  errors.phone = validatePhone(input.phone, true);
  errors.email = validateEmail(input.email);

  const contactBy = text(input.contactBy) || "telefon";
  if (!contactChannels.some((c) => c.value === contactBy)) errors.contactBy = "Wybierz preferowaną formę kontaktu.";

  const message = text(input.message);
  if (message.length > LIMITS.consultationMessage) errors.message = `Wiadomość może mieć najwyżej ${LIMITS.consultationMessage} znaków.`;

  errors.consent = validateConsent(input.consent);

  const clean = stripEmpty(errors);
  if (Object.keys(clean).length) return { data: null, errors: clean };
  return {
    data: {
      category: category as ConsultationCategory,
      service: service || null,
      firstVisit: firstVisit === "tak",
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

/** Zamienia FormData na zwykły obiekt; pola wielokrotne (checkboxy) stają się tablicami. */
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
