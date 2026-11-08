import { SESSION_TYPES, type SessionType } from "@/data/services";
import type { Dictionary } from "@/i18n/pl";

/** Walidacja zapytania – wspólna dla przeglądarki i serwera. Komunikaty pochodzą ze słownika. */

export interface InquiryInput {
  name: string;
  email: string;
  session: SessionType | "";
  date: string;
  message: string;
}

export type InquiryField = keyof InquiryInput;
export type InquiryErrors = Partial<Record<InquiryField, string>>;
export type InquiryMessages = Dictionary["form"]["errors"];

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isSessionType(value: unknown): value is SessionType {
  return SESSION_TYPES.includes(value as SessionType);
}

/** Dzisiejsza data w strefie Europe/Warsaw w formacie `YYYY-MM-DD`. */
export function todayInWarsaw(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function validateInquiry(input: InquiryInput, messages: InquiryMessages, today = todayInWarsaw()): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = input.name.trim();
  if (name.length < 2) errors.name = messages.nameMissing;
  else if (name.length > 120) errors.name = messages.nameLong;

  const email = input.email.trim();
  if (!email) errors.email = messages.emailMissing;
  else if (!EMAIL_PATTERN.test(email) || email.length > 200) errors.email = messages.emailInvalid;

  if (!isSessionType(input.session)) errors.session = messages.session;

  if (input.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date))) errors.date = messages.dateInvalid;
    else if (input.date < today) errors.date = messages.datePast;
  }

  const message = input.message.trim();
  if (message.length < 10) errors.message = messages.messageShort;
  else if (message.length > 3000) errors.message = messages.messageLong;

  return errors;
}

/** Przekształca dowolne dane (np. z JSON) w `InquiryInput`. */
export function toInquiryInput(value: unknown): InquiryInput {
  const source = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
  const text = (key: string) => (typeof source[key] === "string" ? (source[key] as string) : "");
  const session = text("session");
  return { name: text("name"), email: text("email"), session: isSessionType(session) ? session : "", date: text("date"), message: text("message") };
}
