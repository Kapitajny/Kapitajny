/**
 * Silnik terminów: czyste funkcje, wspólne dla serwera (weryfikacja) i testów.
 * Zajętość (`busy`) pochodzi z bazy: aktywne rezerwacje + blokady ustawione w panelu.
 */
import { BOOKING_RULES, OPENING_HOURS } from "./rules";
import { addDays, toMinutes, toTime, utcToZoned, weekdayOf, zonedToUtc } from "./time";

export interface Interval {
  /** epoch ms */
  start: number;
  end: number;
}

export interface Slot {
  time: string;
  available: boolean;
}

export interface Day {
  date: string;
  /** Studio nieczynne tego dnia (np. niedziela). */
  closed: boolean;
  slots: Slot[];
}

type Rules = Pick<typeof BOOKING_RULES, "slotStepMinutes" | "minLeadHours" | "horizonDays" | "bufferMinutes">;

export const overlaps = (a: Interval, b: Interval, bufferMs = 0) => a.start < b.end + bufferMs && b.start < a.end + bufferMs;

export function daySlots(date: string, durationMin: number, busy: Interval[], now: Date, rules: Rules = BOOKING_RULES): Slot[] {
  const hours = OPENING_HOURS[weekdayOf(date)];
  if (!hours) return [];
  const today = utcToZoned(now).date;
  if (date < today || date > addDays(today, rules.horizonDays)) return [];

  const earliest = now.getTime() + rules.minLeadHours * 3600_000;
  const bufferMs = rules.bufferMinutes * 60_000;
  const slots: Slot[] = [];
  for (let m = toMinutes(hours.open); m + durationMin <= toMinutes(hours.close); m += rules.slotStepMinutes) {
    const start = zonedToUtc(date, m).getTime();
    const candidate = { start, end: start + durationMin * 60_000 };
    const available = start >= earliest && !busy.some((b) => overlaps(candidate, b, bufferMs));
    slots.push({ time: toTime(m), available });
  }
  return slots;
}

export function buildAvailability(from: string, days: number, durationMin: number, busy: Interval[], now: Date, rules: Rules = BOOKING_RULES): Day[] {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(from, i);
    const closed = !OPENING_HOURS[weekdayOf(date)];
    return { date, closed, slots: closed ? [] : daySlots(date, durationMin, busy, now, rules) };
  });
}

/** Czy dany start jest dozwolonym, wolnym terminem? (Weryfikacja po stronie serwera.) */
export function isSlotBookable(date: string, time: string, durationMin: number, busy: Interval[], now: Date, rules: Rules = BOOKING_RULES): boolean {
  return daySlots(date, durationMin, busy, now, rules).some((s) => s.time === time && s.available);
}

export function slotInterval(date: string, time: string, durationMin: number): Interval {
  const start = zonedToUtc(date, toMinutes(time)).getTime();
  return { start, end: start + durationMin * 60_000 };
}
