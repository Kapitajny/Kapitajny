/**
 * Formularz kontaktowy – pola, walidacja i normalizacja danych.
 * Ten sam kod sprawdza dane w przeglądarce i na serwerze.
 *
 * Formularz celowo NIE zbiera szczegółowych informacji o stanie zdrowia.
 */
import { getService } from "@/data/services";

export const CONTACT_METHODS = {
  phone: "Telefon",
  email: "E-mail",
} as const;
export type ContactMethod = keyof typeof CONTACT_METHODS;

export const TIME_PREFERENCES = {
  any: "Bez preferencji",
  morning: "Przed południem",
  afternoon: "Po południu",
} as const;
export type TimePreference = keyof typeof TIME_PREFERENCES;

export const MESSAGE_MAX_LENGTH = 600;

export interface ContactInput {
  name?: unknown;
  contactMethod?: unknown;
  phone?: unknown;
  email?: unknown;
  preferredDate?: unknown;
  preferredTime?: unknown;
  service?: unknown;
  message?: unknown;
  /** Pole-pułapka na boty – ukryte dla ludzi, musi zostać puste. */
  website?: unknown;
}

export type ContactField = "name" | "contactMethod" | "phone" | "email" | "preferredDate" | "preferredTime" | "service" | "message";

export interface ContactRequest {
  name: string;
  contactMethod: ContactMethod;
  phone: string | null;
  email: string | null;
  /** RRRR-MM-DD albo `null`. */
  preferredDate: string | null;
  preferredTime: TimePreference;
  /** Slug usługi z data/services.ts albo `null`. */
  service: string | null;
  message: string | null;
}

export type ContactValidation = { ok: true; value: ContactRequest } | { ok: false; errors: Partial<Record<ContactField, string>> };

const NAME_RE = /^[\p{L}][\p{L}\p{M} .'-]*$/u;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function validateName(value: unknown): string | null {
  const name = text(value);
  if (!name) return "Podaj imię, abyśmy wiedzieli, jak się do Ciebie zwracać.";
  if (name.length < 2) return "Imię powinno mieć co najmniej 2 znaki.";
  if (name.length > 60) return "Imię może mieć maksymalnie 60 znaków.";
  if (!NAME_RE.test(name)) return "Imię może zawierać tylko litery, spacje, apostrof i myślnik.";
  return null;
}

/** Zwraca numer bez spacji i myślników (z ewentualnym „+” na początku) albo `null`, gdy jest niepoprawny. */
export function normalizePhone(value: unknown): string | null {
  const raw = text(value);
  if (!/^\+?[\d\s()-]+$/.test(raw)) return null;
  const digits = raw.replace(/[\s()-]/g, "");
  const count = digits.replace("+", "").length;
  return count >= 9 && count <= 15 ? digits : null;
}

export function validatePhone(value: unknown): string | null {
  if (!text(value)) return "Podaj numer telefonu.";
  return normalizePhone(value) ? null : "Podaj poprawny numer telefonu, np. 600 100 200.";
}

export function validateEmail(value: unknown): string | null {
  const email = text(value);
  if (!email) return "Podaj adres e-mail.";
  if (email.length > 254 || !EMAIL_RE.test(email)) return "Podaj poprawny adres e-mail, np. anna@example.com.";
  return null;
}

/** Dzisiejsza data w strefie Europe/Warsaw w formacie RRRR-MM-DD. */
export function todayInWarsaw(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

/** Data o `days` dni późniejsza (RRRR-MM-DD → RRRR-MM-DD). */
export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const MAX_DAYS_AHEAD = 180;

export function validatePreferredDate(value: unknown, today: string = todayInWarsaw()): string | null {
  const date = text(value);
  if (!date) return null;
  const parsed = new Date(`${date}T12:00:00Z`);
  if (!DATE_RE.test(date) || Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== date) {
    return "Podaj poprawną datę.";
  }
  if (date < today) return "Wybierz dzisiejszą lub przyszłą datę.";
  if (date > addDays(today, MAX_DAYS_AHEAD)) return "Wybierz termin w ciągu najbliższych 6 miesięcy.";
  return null;
}

export function validateContact(input: ContactInput, today: string = todayInWarsaw()): ContactValidation {
  const errors: Partial<Record<ContactField, string>> = {};

  const nameError = validateName(input.name);
  if (nameError) errors.name = nameError;

  const method = input.contactMethod;
  if (method !== "phone" && method !== "email") {
    errors.contactMethod = "Wybierz, jak mamy się z Tobą skontaktować.";
  } else if (method === "phone") {
    const phoneError = validatePhone(input.phone);
    if (phoneError) errors.phone = phoneError;
  } else {
    const emailError = validateEmail(input.email);
    if (emailError) errors.email = emailError;
  }

  const dateError = validatePreferredDate(input.preferredDate, today);
  if (dateError) errors.preferredDate = dateError;

  const time = input.preferredTime ?? "any";
  if (typeof time !== "string" || !Object.hasOwn(TIME_PREFERENCES, time)) errors.preferredTime = "Wybierz porę dnia z listy.";

  const serviceSlug = text(input.service);
  if (serviceSlug && !getService(serviceSlug)) errors.service = "Wybierz usługę z listy.";

  const message = text(input.message);
  if (message.length > MESSAGE_MAX_LENGTH) errors.message = `Wiadomość może mieć maksymalnie ${MESSAGE_MAX_LENGTH} znaków.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };

  return {
    ok: true,
    value: {
      name: text(input.name),
      contactMethod: method as ContactMethod,
      phone: method === "phone" ? normalizePhone(input.phone) : null,
      email: method === "email" ? text(input.email).toLowerCase() : null,
      preferredDate: text(input.preferredDate) || null,
      preferredTime: time as TimePreference,
      service: serviceSlug || null,
      message: message || null,
    },
  };
}
