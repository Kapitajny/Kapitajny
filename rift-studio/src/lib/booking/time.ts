/**
 * Obliczenia dat w strefie studia (Europe/Warsaw), niezależnie od strefy serwera i przeglądarki.
 * Daty dni: `YYYY-MM-DD`; godziny: minuty od północy.
 */
import { BOOKING_RULES } from "./rules";

const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: BOOKING_RULES.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

function zonedParts(at: Date) {
  const p = Object.fromEntries(formatter.formatToParts(at).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour, min: +p.minute };
}

/** Przesunięcie strefy studia względem UTC w minutach (np. 60 zimą, 120 latem). */
function offsetMinutes(at: Date): number {
  const p = zonedParts(at);
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.min);
  return Math.round((asUtc - Math.floor(at.getTime() / 60000) * 60000) / 60000);
}

/** Lokalny czas studia → moment w UTC. */
export function zonedToUtc(date: string, minutes: number): Date {
  const [y, m, d] = date.split("-").map(Number);
  const guess = Date.UTC(y, m - 1, d, 0, minutes);
  const first = offsetMinutes(new Date(guess));
  let ts = guess - first * 60000;
  const second = offsetMinutes(new Date(ts));
  if (second !== first) ts = guess - second * 60000;
  return new Date(ts);
}

/** Moment w UTC → lokalny dzień i minuty w strefie studia. */
export function utcToZoned(at: Date): { date: string; minutes: number } {
  const p = zonedParts(at);
  return { date: `${p.y}-${String(p.m).padStart(2, "0")}-${String(p.d).padStart(2, "0")}`, minutes: p.h * 60 + p.min };
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export const weekdayOf = (date: string): number => new Date(`${date}T12:00:00Z`).getUTCDay();

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export const toTime = (minutes: number): string =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;

export const isDateString = (v: unknown): v is string =>
  typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v) && !Number.isNaN(Date.parse(`${v}T00:00:00Z`)) && new Date(`${v}T12:00:00Z`).toISOString().startsWith(v);

export const isTimeString = (v: unknown): v is string => typeof v === "string" && /^([01]\d|2[0-3]):[0-5]\d$/.test(v);
