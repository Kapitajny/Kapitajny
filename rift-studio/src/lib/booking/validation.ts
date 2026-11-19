/**
 * Walidacja formularza rezerwacji – ta sama w przeglądarce (komunikaty przy polach)
 * i na serwerze (jedyne źródło prawdy). Zwraca kody błędów tłumaczone w słownikach.
 */
import { hasLocale, type Locale } from "@/i18n/config";
import { isSoundId, type SoundId } from "@/data/sounds";
import { getService, isServiceId, type ServiceId } from "@/data/services";
import { isDateString, isTimeString } from "./time";

export type FieldError = "required" | "invalid" | "too_short" | "too_long";

export interface BookingInput {
  service: ServiceId;
  durationMin: number;
  date: string;
  time: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  sound: SoundId | "";
  acceptTerms: true;
  acceptContact: true;
  lang: Locale;
}

export type BookingField = keyof Omit<BookingInput, "lang">;

export const LIMITS = { name: [2, 80], email: 254, phone: [7, 20], message: 1500 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[0-9 ()-]+$/;

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export function validateBooking(raw: Record<string, unknown>):
  | { ok: true; value: BookingInput }
  | { ok: false; errors: Partial<Record<BookingField, FieldError>> } {
  const errors: Partial<Record<BookingField, FieldError>> = {};

  const service = raw.service;
  if (!isServiceId(service)) errors.service = service ? "invalid" : "required";

  const durationMin = Number(raw.durationMin);
  if (isServiceId(service) && !getService(service).durations.includes(durationMin)) errors.durationMin = "invalid";

  if (!isDateString(raw.date)) errors.date = raw.date ? "invalid" : "required";
  if (!isTimeString(raw.time)) errors.time = raw.time ? "invalid" : "required";

  const name = str(raw.name);
  if (!name) errors.name = "required";
  else if (name.length < LIMITS.name[0]) errors.name = "too_short";
  else if (name.length > LIMITS.name[1]) errors.name = "too_long";

  const email = str(raw.email).toLowerCase();
  if (!email) errors.email = "required";
  else if (email.length > LIMITS.email || !EMAIL_RE.test(email)) errors.email = "invalid";

  const phone = str(raw.phone);
  if (phone) {
    const digits = phone.replace(/\D/g, "").length;
    if (!PHONE_RE.test(phone) || digits < LIMITS.phone[0] || phone.length > LIMITS.phone[1]) errors.phone = "invalid";
  }

  const message = str(raw.message);
  if (message.length > LIMITS.message) errors.message = "too_long";

  const sound = str(raw.sound);
  if (sound && !isSoundId(sound)) errors.sound = "invalid";

  if (raw.acceptTerms !== true) errors.acceptTerms = "required";
  if (raw.acceptContact !== true) errors.acceptContact = "required";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      service: service as ServiceId,
      durationMin,
      date: raw.date as string,
      time: raw.time as string,
      name,
      email,
      phone,
      message,
      sound: sound as SoundId | "",
      acceptTerms: true,
      acceptContact: true,
      lang: typeof raw.lang === "string" && hasLocale(raw.lang) ? raw.lang : "pl",
    },
  };
}
