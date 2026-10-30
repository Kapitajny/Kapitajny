import { SESSION_TYPES, type SessionType } from "@/data/services";

/** Walidacja zapytania – wspólna dla przeglądarki i serwera. */

export interface InquiryInput {
  name: string;
  email: string;
  session: SessionType | "";
  date: string;
  message: string;
}

export type InquiryField = keyof InquiryInput;
export type InquiryErrors = Partial<Record<InquiryField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isSessionType(value: unknown): value is SessionType {
  return SESSION_TYPES.some((type) => type.value === value);
}

/** Dzisiejsza data w strefie Europe/Warsaw w formacie `YYYY-MM-DD`. */
export function todayInWarsaw(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function validateInquiry(input: InquiryInput, today = todayInWarsaw()): InquiryErrors {
  const errors: InquiryErrors = {};
  const name = input.name.trim();
  if (name.length < 2) errors.name = "Enter your full name.";
  else if (name.length > 120) errors.name = "Keep your name under 120 characters.";

  const email = input.email.trim();
  if (!email) errors.email = "Enter your email address so we can reply.";
  else if (!EMAIL_PATTERN.test(email) || email.length > 200) errors.email = "Enter an email address in the format name@example.com.";

  if (!isSessionType(input.session)) errors.session = "Choose the type of session.";

  if (input.date) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date) || Number.isNaN(Date.parse(input.date))) errors.date = "Enter the date as day, month and year.";
    else if (input.date < today) errors.date = "Choose a date from today onwards.";
  }

  const message = input.message.trim();
  if (message.length < 10) errors.message = "Tell us a little about what you have in mind (at least 10 characters).";
  else if (message.length > 3000) errors.message = "Keep your message under 3000 characters.";

  return errors;
}

/** Przekształca dowolne dane (np. z JSON) w `InquiryInput`. */
export function toInquiryInput(value: unknown): InquiryInput {
  const source = (typeof value === "object" && value !== null ? value : {}) as Record<string, unknown>;
  const text = (key: string) => (typeof source[key] === "string" ? (source[key] as string) : "");
  const session = text("session");
  return { name: text("name"), email: text("email"), session: isSessionType(session) ? session : "", date: text("date"), message: text("message") };
}
