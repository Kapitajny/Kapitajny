import {
  BUDGET_IDS,
  PLACEMENT_IDS,
  SIDE_IDS,
  SIZE_IDS,
  STYLE_OPTIONS,
  TIME_IDS,
  type BudgetId,
  type PlacementId,
  type SideId,
  type SizeId,
  type StyleId,
  type TimeId,
} from "@/config/booking";

/**
 * Model i walidacja zgłoszenia — WSPÓLNE dla przeglądarki i serwera.
 * Walidacja zwraca KODY błędów (np. "required", "tooShort"); ich treść w danym języku jest w słownikach
 * (`booking.errors`). Dzięki temu te same reguły działają po polsku i po angielsku.
 */

export interface BookingData {
  fullName: string;
  email: string;
  phone: string;
  contactMethod: "email" | "phone";

  description: string;
  meaning: string;
  firstTattoo: "yes" | "no" | "";
  designType: "new" | "existing" | "";

  styles: StyleId[];
  placement: PlacementId | "";
  placementNote: string;
  side: SideId | "";

  size: SizeId | "";
  budget: BudgetId | "";
  preferredDate: string;
  preferredTime: TimeId;

  privacyAccepted: boolean;
  accuracyConfirmed: boolean;
}

export const EMPTY_BOOKING: BookingData = {
  fullName: "",
  email: "",
  phone: "",
  contactMethod: "email",
  description: "",
  meaning: "",
  firstTattoo: "",
  designType: "",
  styles: [],
  placement: "",
  placementNote: "",
  side: "",
  size: "",
  budget: "",
  preferredDate: "",
  preferredTime: "any",
  privacyAccepted: false,
  accuracyConfirmed: false,
};

export const LIMITS = {
  fullName: { min: 2, max: 100 },
  email: { max: 254 },
  description: { min: 20, max: 3000 },
  meaning: { max: 1500 },
  placementNote: { max: 200 },
  /** Jak daleko w przyszłość można wskazać preferowany termin (dni). */
  maxDaysAhead: 366,
};

export type BookingField = keyof BookingData;

/** Kody błędów dla każdego pola. */
export interface FieldErrorCodes {
  fullName: "required" | "tooShort" | "tooLong";
  email: "required" | "invalid";
  phone: "invalid" | "requiredForPhone";
  contactMethod: "required";
  description: "required" | "tooShort" | "tooLong";
  meaning: "tooLong";
  firstTattoo: "required";
  designType: "required";
  styles: "required" | "invalid";
  placement: "required";
  placementNote: "tooLong";
  side: "required";
  size: "required";
  budget: "required";
  preferredDate: "invalid" | "past" | "tooFar";
  preferredTime: "required";
  privacyAccepted: "required";
  accuracyConfirmed: "required";
}

export type FieldErrors = { [K in BookingField]?: FieldErrorCodes[K] };

/** Kroki kreatora i pola, które każdy z nich weryfikuje. */
export const STEP_FIELDS: BookingField[][] = [
  ["fullName", "email", "phone", "contactMethod"],
  ["description", "meaning", "firstTattoo", "designType"],
  ["styles", "placement", "placementNote", "side"],
  ["size", "budget", "preferredDate", "preferredTime"],
  [],
  ["privacyAccepted", "accuracyConfirmed"],
];

const EMAIL_RE = /^[^\s@"<>()[\],;:]+@[^\s@"<>()[\],;:]+\.[a-z]{2,}$/i;
const PHONE_CHARS_RE = /^\+?[\d\s()\-.]+$/;

const ids = <T extends { id: string }>(list: readonly T[]) => new Set(list.map((o) => o.id));
const STYLE_SET = ids(STYLE_OPTIONS);
const PLACEMENT_SET = new Set<string>(PLACEMENT_IDS);
const SIDE_SET = new Set<string>(SIDE_IDS);
const SIZE_SET = new Set<string>(SIZE_IDS);
const BUDGET_SET = new Set<string>(BUDGET_IDS);
const TIME_SET = new Set<string>(TIME_IDS);

/** Dzisiejsza data w strefie Europe/Warsaw w formacie RRRR-MM-DD. */
export function todayInWarsaw(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Warsaw", year: "numeric", month: "2-digit", day: "2-digit" }).format(now);
}

export function addDays(isoDate: string, days: number): string {
  const date = new Date(`${isoDate}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function isValidIsoDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function phoneDigits(phone: string): number {
  return phone.replace(/\D/g, "").length;
}

/** Waliduje wskazane pola (domyślnie wszystkie). Zwraca kody błędów przy polach. */
export function validateBooking(data: BookingData, fields?: BookingField[], now: Date = new Date()): FieldErrors {
  const errors: FieldErrors = {};
  const check = (field: BookingField) => !fields || fields.includes(field);

  const name = data.fullName.trim();
  if (check("fullName")) {
    if (!name) errors.fullName = "required";
    else if (name.length < LIMITS.fullName.min) errors.fullName = "tooShort";
    else if (name.length > LIMITS.fullName.max) errors.fullName = "tooLong";
  }

  const email = data.email.trim();
  if (check("email")) {
    if (!email) errors.email = "required";
    else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email)) errors.email = "invalid";
  }

  const phone = data.phone.trim();
  if (check("phone")) {
    if (phone && (!PHONE_CHARS_RE.test(phone) || phoneDigits(phone) < 7 || phoneDigits(phone) > 15)) errors.phone = "invalid";
    else if (!phone && data.contactMethod === "phone") errors.phone = "requiredForPhone";
  }

  if (check("contactMethod") && data.contactMethod !== "email" && data.contactMethod !== "phone") errors.contactMethod = "required";

  const description = data.description.trim();
  if (check("description")) {
    if (!description) errors.description = "required";
    else if (description.length < LIMITS.description.min) errors.description = "tooShort";
    else if (description.length > LIMITS.description.max) errors.description = "tooLong";
  }

  if (check("meaning") && data.meaning.trim().length > LIMITS.meaning.max) errors.meaning = "tooLong";
  if (check("firstTattoo") && data.firstTattoo !== "yes" && data.firstTattoo !== "no") errors.firstTattoo = "required";
  if (check("designType") && data.designType !== "new" && data.designType !== "existing") errors.designType = "required";

  if (check("styles")) {
    if (!Array.isArray(data.styles) || data.styles.length === 0) errors.styles = "required";
    else if (data.styles.some((s) => !STYLE_SET.has(s)) || new Set(data.styles).size !== data.styles.length) errors.styles = "invalid";
  }

  if (check("placement") && !PLACEMENT_SET.has(data.placement)) errors.placement = "required";
  if (check("placementNote") && data.placementNote.trim().length > LIMITS.placementNote.max) errors.placementNote = "tooLong";
  if (check("side") && !SIDE_SET.has(data.side)) errors.side = "required";
  if (check("size") && !SIZE_SET.has(data.size)) errors.size = "required";
  if (check("budget") && !BUDGET_SET.has(data.budget)) errors.budget = "required";

  if (check("preferredDate") && data.preferredDate) {
    const today = todayInWarsaw(now);
    if (!isValidIsoDate(data.preferredDate)) errors.preferredDate = "invalid";
    else if (data.preferredDate < today) errors.preferredDate = "past";
    else if (data.preferredDate > addDays(today, LIMITS.maxDaysAhead)) errors.preferredDate = "tooFar";
  }

  if (check("preferredTime") && !TIME_SET.has(data.preferredTime)) errors.preferredTime = "required";
  if (check("privacyAccepted") && data.privacyAccepted !== true) errors.privacyAccepted = "required";
  if (check("accuracyConfirmed") && data.accuracyConfirmed !== true) errors.accuracyConfirmed = "required";

  return errors;
}

/** Odczyt danych z dowolnego obiektu (np. JSON z żądania) — tylko znane pola, tylko właściwe typy. */
export function coerceBooking(input: unknown): BookingData {
  const src = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const str = (key: string) => (typeof src[key] === "string" ? (src[key] as string) : "");
  const bool = (key: string) => src[key] === true;
  return {
    fullName: str("fullName"),
    email: str("email"),
    phone: str("phone"),
    contactMethod: str("contactMethod") as BookingData["contactMethod"],
    description: str("description"),
    meaning: str("meaning"),
    firstTattoo: str("firstTattoo") as BookingData["firstTattoo"],
    designType: str("designType") as BookingData["designType"],
    styles: Array.isArray(src.styles) ? (src.styles.filter((s) => typeof s === "string").slice(0, 20) as StyleId[]) : [],
    placement: str("placement") as BookingData["placement"],
    placementNote: str("placementNote"),
    side: str("side") as BookingData["side"],
    size: str("size") as BookingData["size"],
    budget: str("budget") as BookingData["budget"],
    preferredDate: str("preferredDate"),
    preferredTime: (str("preferredTime") || "any") as TimeId,
    privacyAccepted: bool("privacyAccepted"),
    accuracyConfirmed: bool("accuracyConfirmed"),
  };
}

/** Przycina białe znaki — zapisujemy dane w takiej postaci. */
export function normalizeBooking(data: BookingData): BookingData {
  return {
    ...data,
    fullName: data.fullName.trim().replace(/\s+/g, " "),
    email: data.email.trim().toLowerCase(),
    phone: data.phone.trim(),
    description: data.description.trim(),
    meaning: data.meaning.trim(),
    placementNote: data.placementNote.trim(),
  };
}
