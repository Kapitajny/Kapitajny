/**
 * Godziny odbioru zamówień. Wszystkie obliczenia w strefie Europe/Warsaw,
 * niezależnie od strefy czasowej serwera i przeglądarki.
 */
import type { Location, OpeningHours } from "@/data/locations";

export const PICKUP_RULES = {
  timeZone: "Europe/Warsaw",
  /** Minimalny czas od złożenia zamówienia do odbioru (przygotowanie + płatność). */
  leadMinutes: 20,
  slotMinutes: 15,
  /** Ostatni odbiór na tyle minut przed zamknięciem lokalu. */
  lastPickupBeforeCloseMinutes: 15,
  /** 0 = tylko dziś, 1 = dziś i jutro. */
  daysAhead: 1,
} as const;

export interface WarsawNow {
  /** YYYY-MM-DD */
  date: string;
  /** Minuty od północy. */
  minutes: number;
}

const partsFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: PICKUP_RULES.timeZone,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

export function getWarsawNow(at: Date = new Date()): WarsawNow {
  const parts = Object.fromEntries(partsFormatter.formatToParts(at).map((p) => [p.type, p.value]));
  return { date: `${parts.year}-${parts.month}-${parts.day}`, minutes: Number(parts.hour) * 60 + Number(parts.minute) };
}

export function addDays(date: string, days: number): string {
  const d = new Date(`${date}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function weekdayOf(date: string): number {
  return new Date(`${date}T12:00:00Z`).getUTCDay();
}

export function getHoursForDate(location: Location, date: string): OpeningHours {
  const day = weekdayOf(date);
  return day === 0 || day === 6 ? location.hours.weekend : location.hours.weekdays;
}

export function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function toTime(minutes: number): string {
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
}

/** Dostępne godziny odbioru w danym dniu (pusta lista = brak możliwości odbioru). */
export function getPickupSlots(location: Location, date: string, now: WarsawNow): string[] {
  if (!location.acceptsOrders) return [];
  if (date < now.date || date > addDays(now.date, PICKUP_RULES.daysAhead)) return [];

  const hours = getHoursForDate(location, date);
  const { slotMinutes, leadMinutes, lastPickupBeforeCloseMinutes } = PICKUP_RULES;
  let start = toMinutes(hours.open) + slotMinutes; // pierwszy odbiór chwilę po otwarciu
  const end = toMinutes(hours.close) - lastPickupBeforeCloseMinutes;
  if (date === now.date) start = Math.max(start, now.minutes + leadMinutes);
  start = Math.ceil(start / slotMinutes) * slotMinutes;

  const slots: string[] = [];
  for (let m = start; m <= end; m += slotMinutes) slots.push(toTime(m));
  return slots;
}

export interface PickupDay {
  date: string;
  label: string;
  dateLabel: string;
}

const dayFormatter = new Intl.DateTimeFormat("pl-PL", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

export function getPickupDays(now: WarsawNow): PickupDay[] {
  const labels = ["Dziś", "Jutro"];
  return Array.from({ length: PICKUP_RULES.daysAhead + 1 }, (_, i) => {
    const date = addDays(now.date, i);
    return { date, label: labels[i] ?? date, dateLabel: dayFormatter.format(new Date(`${date}T12:00:00Z`)) };
  });
}

export function isValidPickup(location: Location, date: unknown, time: unknown, now: WarsawNow): boolean {
  if (typeof date !== "string" || typeof time !== "string") return false;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return false;
  return getPickupSlots(location, date, now).includes(time);
}

/** „dziś, 10:30” / „jutro (sob., 18 paź), 09:15” – względem bieżącej daty. */
export function formatPickup(date: string, time: string, now: WarsawNow = getWarsawNow()): string {
  if (date === now.date) return `dziś, ${time}`;
  const label = dayFormatter.format(new Date(`${date}T12:00:00Z`));
  if (date === addDays(now.date, 1)) return `jutro (${label}), ${time}`;
  return `${label}, ${time}`;
}
