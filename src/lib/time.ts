/**
 * Czas lokalny wypożyczalni (Europe/Warsaw), niezależnie od strefy serwera i przeglądarki.
 * Daty przechowujemy jako "YYYY-MM-DD", godziny jako "HH:MM", momenty jako milisekundy UTC.
 */

export const TIME_ZONE = "Europe/Warsaw";

const partsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

interface LocalParts {
  date: string;
  minutes: number;
}

/** Data i minuta doby w Warszawie dla danego momentu. */
export function toLocal(ms: number): LocalParts {
  const p = Object.fromEntries(partsFormatter.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

function offsetMs(ms: number): number {
  const p = Object.fromEntries(partsFormatter.formatToParts(new Date(ms)).map((x) => [x.type, x.value]));
  const asUtc = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day), Number(p.hour), Number(p.minute), Number(p.second));
  return asUtc - Math.floor(ms / 1000) * 1000;
}

/** Moment UTC odpowiadający lokalnej dacie i minucie doby w Warszawie. */
export function fromLocal(date: string, minutes: number): number {
  const [y, m, d] = date.split("-").map(Number);
  const naive = Date.UTC(y, m - 1, d, 0, minutes);
  let guess = naive - offsetMs(naive);
  guess = naive - offsetMs(guess);
  return guess;
}

export function isDate(value: unknown): value is string {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T12:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export function isTime(value: unknown): value is string {
  return typeof value === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(value);
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function toTime(minutes: number): string {
  const m = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = niedziela … 6 = sobota */
export function weekdayOf(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export const WEEKDAYS = ["Niedziela", "Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"] as const;
export const WEEKDAYS_SHORT = ["Nd", "Pn", "Wt", "Śr", "Cz", "Pt", "So"] as const;

const dateFormatter = new Intl.DateTimeFormat("pl-PL", { timeZone: TIME_ZONE, weekday: "long", day: "numeric", month: "long" });
const dateTimeFormatter = new Intl.DateTimeFormat("pl-PL", {
  timeZone: TIME_ZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** np. „sobota, 14 lipca” */
export function formatDateLong(date: string): string {
  return dateFormatter.format(new Date(fromLocal(date, 12 * 60)));
}

export function formatDateTime(ms: number): string {
  return dateTimeFormatter.format(new Date(ms));
}

export function formatTime(ms: number): string {
  return toTime(toLocal(ms).minutes);
}
