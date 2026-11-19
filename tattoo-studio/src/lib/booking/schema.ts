import {
  BUDGET_OPTIONS,
  PLACEMENT_OPTIONS,
  SIDE_OPTIONS,
  SIZE_OPTIONS,
  STYLE_OPTIONS,
  TIME_OPTIONS,
  type BudgetId,
  type PlacementId,
  type SideId,
  type SizeId,
  type StyleId,
  type TimeId,
} from "@/config/booking";

/**
 * Model i walidacja zgłoszenia — WSPÓLNE dla przeglądarki i serwera.
 * Przeglądarka używa ich do blokowania przejścia między krokami, serwer — do ostatecznej weryfikacji.
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
export type FieldErrors = Partial<Record<BookingField, string>>;

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
const STYLE_IDS = ids(STYLE_OPTIONS);
const PLACEMENT_IDS = ids(PLACEMENT_OPTIONS);
const SIDE_IDS = ids(SIDE_OPTIONS);
const SIZE_IDS = ids(SIZE_OPTIONS);
const BUDGET_IDS = ids(BUDGET_OPTIONS);
const TIME_IDS = ids(TIME_OPTIONS);

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

/** Waliduje wskazane pola (domyślnie wszystkie). Zwraca komunikaty błędów do wyświetlenia przy polach. */
export function validateBooking(data: BookingData, fields?: BookingField[], now: Date = new Date()): FieldErrors {
  const errors: FieldErrors = {};
  const check = (field: BookingField) => !fields || fields.includes(field);

  const name = data.fullName.trim();
  if (check("fullName")) {
    if (!name) errors.fullName = "Please enter your full name.";
    else if (name.length < LIMITS.fullName.min) errors.fullName = "Your name looks too short.";
    else if (name.length > LIMITS.fullName.max) errors.fullName = `Please use at most ${LIMITS.fullName.max} characters.`;
  }

  const email = data.email.trim();
  if (check("email")) {
    if (!email) errors.email = "Please enter your email address.";
    else if (email.length > LIMITS.email.max || !EMAIL_RE.test(email)) errors.email = "Enter an email address like name@example.com.";
  }

  const phone = data.phone.trim();
  if (check("phone")) {
    if (phone && (!PHONE_CHARS_RE.test(phone) || phoneDigits(phone) < 7 || phoneDigits(phone) > 15)) {
      errors.phone = "Enter a phone number with 7–15 digits, e.g. +48 600 000 000.";
    } else if (!phone && data.contactMethod === "phone") {
      errors.phone = "Add a phone number, or choose email as your contact method.";
    }
  }

  if (check("contactMethod") && data.contactMethod !== "email" && data.contactMethod !== "phone") {
    errors.contactMethod = "Choose how we should contact you.";
  }

  const description = data.description.trim();
  if (check("description")) {
    if (!description) errors.description = "Please describe your tattoo idea.";
    else if (description.length < LIMITS.description.min)
      errors.description = `Tell us a little more — at least ${LIMITS.description.min} characters.`;
    else if (description.length > LIMITS.description.max)
      errors.description = `Please shorten your description to ${LIMITS.description.max} characters.`;
  }

  if (check("meaning") && data.meaning.trim().length > LIMITS.meaning.max) {
    errors.meaning = `Please shorten this to ${LIMITS.meaning.max} characters.`;
  }

  if (check("firstTattoo") && data.firstTattoo !== "yes" && data.firstTattoo !== "no") {
    errors.firstTattoo = "Let us know if this is your first tattoo.";
  }

  if (check("designType") && data.designType !== "new" && data.designType !== "existing") {
    errors.designType = "Choose a new design or an existing concept.";
  }

  if (check("styles")) {
    if (!Array.isArray(data.styles) || data.styles.length === 0) errors.styles = "Choose at least one style, or “Other / Not Sure Yet”.";
    else if (data.styles.some((s) => !STYLE_IDS.has(s)) || new Set(data.styles).size !== data.styles.length)
      errors.styles = "Choose styles from the list.";
  }

  if (check("placement") && !PLACEMENT_IDS.has(data.placement)) {
    errors.placement = "Choose where you'd like the tattoo, or “Other / Not Sure Yet”.";
  }

  if (check("placementNote") && data.placementNote.trim().length > LIMITS.placementNote.max) {
    errors.placementNote = `Please use at most ${LIMITS.placementNote.max} characters.`;
  }

  if (check("side") && !SIDE_IDS.has(data.side)) {
    errors.side = "Choose a side of the body, or “Not Sure”.";
  }

  if (check("size") && !SIZE_IDS.has(data.size)) errors.size = "Choose a size, or “Not Sure Yet”.";
  if (check("budget") && !BUDGET_IDS.has(data.budget)) errors.budget = "Choose a budget range, or “I need a consultation first”.";

  if (check("preferredDate") && data.preferredDate) {
    const today = todayInWarsaw(now);
    if (!isValidIsoDate(data.preferredDate)) errors.preferredDate = "Enter a valid date.";
    else if (data.preferredDate < today) errors.preferredDate = "Choose a date from today onwards.";
    else if (data.preferredDate > addDays(today, LIMITS.maxDaysAhead)) errors.preferredDate = "Choose a date within the next year.";
  }

  if (check("preferredTime") && !TIME_IDS.has(data.preferredTime)) errors.preferredTime = "Choose a time of day.";

  if (check("privacyAccepted") && data.privacyAccepted !== true) {
    errors.privacyAccepted = "Please confirm you have read the Privacy Policy.";
  }
  if (check("accuracyConfirmed") && data.accuracyConfirmed !== true) {
    errors.accuracyConfirmed = "Please confirm your details are correct.";
  }

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

export const labelOf = <T extends { id: string; label: string }>(list: readonly T[], id: string): string =>
  list.find((o) => o.id === id)?.label ?? id;
