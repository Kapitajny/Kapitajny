/**
 * Wspólne definicje wynajmu: czasy, typy danych i reguły dostępności.
 * Moduł jest „czysty” (bez bazy i bez Reacta) – używa go serwer, przeglądarka i testy.
 */
import { addDays, fromLocal, toLocal, toMinutes, weekdayOf } from "@/lib/time";

/** Dostępne czasy wynajmu w minutach. Minimum to 1 godzina. */
export const DURATIONS = [60, 120, 180, 240, 360, 720, 1440] as const;
export type Duration = (typeof DURATIONS)[number];

export function isDuration(value: unknown): value is Duration {
  return typeof value === "number" && (DURATIONS as readonly number[]).includes(value);
}

/** Wynajmy od tylu minut mogą trwać po godzinie zamknięcia (zwrot następnego dnia lub wieczorem). */
export const LONG_RENTAL_MIN = 720;

export function durationLabel(min: number): string {
  if (min < 60) return `${min} min`;
  return `${min / 60} h`;
}

export function durationLabelLong(min: number): string {
  if (min < 60) return `${min} minut`;
  const h = min / 60;
  if (h === 1) return "1 godzina";
  if (h >= 2 && h <= 4) return `${h} godziny`;
  if (h === 24) return "24 godziny";
  return `${h} godzin`;
}

export type LicenseRequirement = "none" | "required" | "unknown";

export interface Jetski {
  id: string;
  manufacturer: string | null;
  model: string | null;
  name: string;
  description: string | null;
  powerHp: number | null;
  seats: number | null;
  license: LicenseRequirement;
  /** Warunki prowadzenia bez patentu lub opis wymaganych uprawnień (wpisuje administrator). */
  licenseNote: string | null;
  depositGr: number | null;
  image: string | null;
  imageAlt: string | null;
  active: boolean;
  needsReview: boolean;
  sort: number;
  /** Ceny w groszach dla każdego czasu wynajmu; null = nie ustalono. */
  prices: Record<Duration, number | null>;
}

export interface OpeningDay {
  weekday: number;
  open: string | null;
  close: string | null;
}

export interface BookingRules {
  prepMinutes: number;
  leadMinutes: number;
  slotStepMinutes: number;
  horizonDays: number;
  cancelFreeHours: number;
}

export interface BusyInterval {
  /** początek w ms UTC */
  start: number;
  /** koniec w ms UTC (bez bufora) */
  end: number;
  /** true = rezerwacja (dolicza się bufor przygotowania), false = blokada terminu */
  booking: boolean;
}

export function emptyPrices(): Record<Duration, number | null> {
  return Object.fromEntries(DURATIONS.map((d) => [d, null])) as Record<Duration, number | null>;
}

/**
 * Cennik liniowy ze stawki za godzinę (w groszach): każdy czas = stawka × liczba godzin,
 * np. 170 zł/h → 1 h 170 zł, 2 h 340 zł … 24 h 4080 zł.
 */
export function pricesFromHourly(hourlyGr: number): Record<Duration, number> {
  return Object.fromEntries(DURATIONS.map((d) => [d, Math.round((hourlyGr * d) / 60)])) as Record<Duration, number>;
}

/** Stawka za godzinę wynikająca z ceny danego czasu (w groszach). */
export function hourlyRate(priceGr: number, durationMin: number): number {
  return Math.round((priceGr * 60) / durationMin);
}

export function lowestPrice(jetski: Jetski): { duration: Duration; price: number } | null {
  for (const d of DURATIONS) {
    const p = jetski.prices[d];
    if (p != null) return { duration: d, price: p };
  }
  return null;
}

export function hasAnyPrice(jetski: Jetski): boolean {
  return DURATIONS.some((d) => jetski.prices[d] != null);
}

export function jetskiTitle(j: Pick<Jetski, "manufacturer" | "model" | "name">): string {
  return j.name || [j.manufacturer, j.model].filter(Boolean).join(" ") || "Skuter";
}

/** Czy dwa przedziały kolidują, z uwzględnieniem bufora przygotowania po rezerwacjach. */
export function conflicts(start: number, end: number, busy: BusyInterval[], prepMinutes: number): boolean {
  const prep = prepMinutes * 60_000;
  return busy.some((b) => {
    if (b.booking) return start < b.end + prep && b.start < end + prep;
    return start < b.end && b.start < end;
  });
}

export function hoursFor(date: string, hours: OpeningDay[]): { open: number; close: number } | null {
  const day = hours.find((h) => h.weekday === weekdayOf(date));
  if (!day?.open || !day.close) return null;
  const open = toMinutes(day.open);
  const close = toMinutes(day.close);
  return close > open ? { open, close } : null;
}

export type SlotProblem = "closed" | "past" | "too-far" | "after-close" | "return-closed" | "busy";

/**
 * Sprawdza, czy wynajem może rozpocząć się danego dnia o danej minucie.
 * Zasady:
 *  - start w godzinach otwarcia, nie wcześniej niż `leadMinutes` od teraz i nie dalej niż `horizonDays`;
 *  - wynajem krótszy niż 12 h musi skończyć się najpóźniej o zamknięciu;
 *  - wynajem 12 h i 24 h kończy się w godzinach otwarcia dnia zwrotu;
 *  - brak kolizji z innymi rezerwacjami (z buforem) i blokadami.
 */
export function checkSlot(
  date: string,
  startMin: number,
  duration: Duration,
  ctx: { now: number; hours: OpeningDay[]; rules: BookingRules; busy: BusyInterval[] },
): SlotProblem | null {
  const h = hoursFor(date, ctx.hours);
  if (!h || startMin < h.open || startMin >= h.close) return "closed";
  const start = fromLocal(date, startMin);
  const end = start + duration * 60_000;
  if (start < ctx.now + ctx.rules.leadMinutes * 60_000) return "past";
  const today = toLocal(ctx.now).date;
  if (date > addDays(today, ctx.rules.horizonDays)) return "too-far";

  if (duration < LONG_RENTAL_MIN) {
    if (startMin + duration > h.close) return "after-close";
  } else {
    const ret = toLocal(end);
    const rh = hoursFor(ret.date, ctx.hours);
    if (!rh || ret.minutes < rh.open || ret.minutes > rh.close) return "return-closed";
  }
  if (conflicts(start, end, ctx.busy, ctx.rules.prepMinutes)) return "busy";
  return null;
}

export interface Slot {
  time: string;
  available: boolean;
}

/** Wszystkie godziny rozpoczęcia w danym dniu z informacją o dostępności. */
export function daySlots(
  date: string,
  duration: Duration,
  ctx: { now: number; hours: OpeningDay[]; rules: BookingRules; busy: BusyInterval[] },
): Slot[] {
  const h = hoursFor(date, ctx.hours);
  if (!h) return [];
  const slots: Slot[] = [];
  for (let m = h.open; m < h.close; m += ctx.rules.slotStepMinutes) {
    const problem = checkSlot(date, m, duration, ctx);
    // godzin, które z założenia nie mogą być dostępne (przeszłe, za późno na ten czas), nie pokazujemy
    if (problem === "past" || problem === "after-close" || problem === "return-closed" || problem === "too-far") continue;
    slots.push({ time: `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`, available: problem === null });
  }
  return slots;
}

export function formatPrice(gr: number | null | undefined): string {
  if (gr == null) return "—";
  const zl = gr / 100;
  return `${new Intl.NumberFormat("pl-PL", { minimumFractionDigits: Number.isInteger(zl) ? 0 : 2, maximumFractionDigits: 2 }).format(zl)} zł`;
}

export const BOOKING_STATUSES = ["pending", "confirmed", "completed", "cancelled", "no_show"] as const;
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Wstępna",
  confirmed: "Potwierdzona",
  completed: "Zakończona",
  cancelled: "Anulowana",
  no_show: "Nieobecność",
};

/** Statusy, które zajmują skuter w kalendarzu. */
export const ACTIVE_STATUSES: BookingStatus[] = ["pending", "confirmed"];

export type NoLicenseMode = "models" | "instructor" | "hidden";
