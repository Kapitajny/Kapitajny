import { findService } from "@/data/services";

/** Wspólna walidacja formularza kontaktowego – używana w przeglądarce i na serwerze. */

export const OTHER_SERVICE = "inne";

export interface ContactInput {
  name: string;
  phone: string;
  email: string;
  service: string;
  pickup: string;
  destination: string;
  /** Data w formacie RRRR-MM-DD (opcjonalnie). */
  date: string;
  /** Godzina w formacie GG:MM (opcjonalnie). */
  time: string;
  message: string;
  consent: boolean;
}

export type ContactField = keyof ContactInput;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const emptyContact: ContactInput = {
  name: "",
  phone: "",
  email: "",
  service: "",
  pickup: "",
  destination: "",
  date: "",
  time: "",
  message: "",
  consent: false,
};

export const LIMITS = { name: 100, phone: 20, email: 120, place: 200, message: 1500 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

/** Dzisiejsza data w strefie Europe/Warsaw (RRRR-MM-DD). */
export function todayInWarsaw(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

function addDays(isoDate: string, days: number): string {
  const d = new Date(`${isoDate}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function isRealDate(isoDate: string): boolean {
  const d = new Date(`${isoDate}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === isoDate;
}

/** Czy wybrana usługa to transport (wymaga miejsca odbioru i miejsca docelowego). */
export function requiresRoute(service: string): boolean {
  const s = findService(service);
  return s ? s.isTransport : false;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** Normalizuje dowolne dane wejściowe do `ContactInput` (bez walidacji). */
export function normalizeContact(raw: unknown): ContactInput {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  return {
    name: str(r.name).replace(/\s+/g, " "),
    phone: str(r.phone),
    email: str(r.email).toLowerCase(),
    service: str(r.service),
    pickup: str(r.pickup),
    destination: str(r.destination),
    date: str(r.date),
    time: str(r.time),
    message: str(r.message),
    consent: r.consent === true,
  };
}

export function validateContact(input: ContactInput, now: Date = new Date()): ContactErrors {
  const e: ContactErrors = {};

  if (!input.name) e.name = "Podaj imię i nazwisko.";
  else if (input.name.length < 3 || !/\p{L}/u.test(input.name)) e.name = "Imię i nazwisko wydaje się niepełne.";
  else if (input.name.length > LIMITS.name) e.name = `Maksymalnie ${LIMITS.name} znaków.`;

  const digits = input.phone.replace(/[\s()-]/g, "");
  if (!input.phone) e.phone = "Podaj numer telefonu – zadzwonimy, aby potwierdzić szczegóły.";
  else if (!/^\+?\d{9,15}$/.test(digits)) e.phone = "Wpisz poprawny numer telefonu, np. 500 600 700 lub +48 500 600 700.";

  if (!input.email) e.email = "Podaj adres e-mail.";
  else if (input.email.length > LIMITS.email || !EMAIL_RE.test(input.email)) e.email = "Wpisz poprawny adres e-mail, np. jan.kowalski@poczta.pl.";

  if (!input.service) e.service = "Wybierz rodzaj usługi.";
  else if (input.service !== OTHER_SERVICE && !findService(input.service)) e.service = "Wybierz usługę z listy.";

  const route = requiresRoute(input.service);
  if (route && !input.pickup) e.pickup = "Podaj miejsce odbioru pacjenta (miejscowość i adres lub nazwę placówki).";
  else if (input.pickup.length > LIMITS.place) e.pickup = `Maksymalnie ${LIMITS.place} znaków.`;
  if (route && !input.destination) e.destination = "Podaj miejsce docelowe.";
  else if (input.destination.length > LIMITS.place) e.destination = `Maksymalnie ${LIMITS.place} znaków.`;

  if (input.date) {
    const today = todayInWarsaw(now);
    if (!DATE_RE.test(input.date) || !isRealDate(input.date)) e.date = "Wybierz poprawną datę.";
    else if (input.date < today) e.date = "Data nie może być wcześniejsza niż dzisiejsza.";
    else if (input.date > addDays(today, 366)) e.date = "Możemy przyjąć zapytanie z wyprzedzeniem maksymalnie jednego roku.";
  }
  if (input.time && !TIME_RE.test(input.time)) e.time = "Wybierz poprawną godzinę.";
  else if (input.time && !input.date) e.date = "Podaj datę, do której odnosi się godzina.";

  if (input.message.length > LIMITS.message) e.message = `Maksymalnie ${LIMITS.message} znaków.`;

  if (!input.consent) e.consent = "Aby wysłać zapytanie, zaakceptuj politykę prywatności.";

  return e;
}

export function serviceLabel(slug: string): string {
  if (slug === OTHER_SERVICE) return "Inna usługa / pytanie ogólne";
  return findService(slug)?.title ?? slug;
}
