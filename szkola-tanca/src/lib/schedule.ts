import type { LevelId } from "@/data/levels";
import { DAYS, type DayId, type ScheduleEntry } from "@/data/schedule";

export interface ScheduleFilters {
  day: DayId | null;
  styleId: string | null;
  level: LevelId | null;
  instructorId: string | null;
}

export const EMPTY_FILTERS: ScheduleFilters = { day: null, styleId: null, level: null, instructorId: null };

export function hasActiveFilters(filters: ScheduleFilters): boolean {
  return Object.values(filters).some((value) => value !== null);
}

export function filterSchedule(entries: ScheduleEntry[], filters: ScheduleFilters): ScheduleEntry[] {
  return entries.filter(
    (entry) =>
      (filters.day === null || entry.day === filters.day) &&
      (filters.styleId === null || entry.styleId === filters.styleId) &&
      (filters.level === null || entry.level === filters.level) &&
      (filters.instructorId === null || entry.instructorId === filters.instructorId),
  );
}

export interface ScheduleDay {
  day: (typeof DAYS)[number];
  entries: ScheduleEntry[];
}

/** Grupuje zajęcia według dni (w kolejności tygodnia) i sortuje po godzinie. Pomija dni bez zajęć. */
export function groupByDay(entries: ScheduleEntry[]): ScheduleDay[] {
  return DAYS.map((day) => ({
    day,
    entries: entries.filter((entry) => entry.day === day.id).sort((a, b) => a.start.localeCompare(b.start)),
  })).filter((group) => group.entries.length > 0);
}

/** „18:45” + 75 min → „20:00”. */
export function endTime(start: string, duration: number): string {
  const [hours, minutes] = start.split(":").map(Number);
  const total = hours * 60 + minutes + duration;
  return `${String(Math.floor(total / 60) % 24).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

/** Odmiana słowa „termin”: 1 termin, 3 terminy, 5 terminów, 22 terminy. */
export function pluralizeSlots(count: number): string {
  if (count === 1) return "1 termin";
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  const form = lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14) ? "terminy" : "terminów";
  return `${count} ${form}`;
}
