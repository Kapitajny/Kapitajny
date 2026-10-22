import type { LevelId } from "./levels";

/**
 * GRAFIK ZAJĘĆ – TERMINY PRZYKŁADOWE.
 * Zastąp je rzeczywistym grafikiem studia. `day`: 0 = poniedziałek … 6 = niedziela.
 */

export const DAYS = [
  { id: 0, short: "Pn", name: "Poniedziałek" },
  { id: 1, short: "Wt", name: "Wtorek" },
  { id: 2, short: "Śr", name: "Środa" },
  { id: 3, short: "Cz", name: "Czwartek" },
  { id: 4, short: "Pt", name: "Piątek" },
  { id: 5, short: "Sb", name: "Sobota" },
  { id: 6, short: "Nd", name: "Niedziela" },
] as const;

export type DayId = (typeof DAYS)[number]["id"];

export interface ScheduleEntry {
  id: string;
  day: DayId;
  /** Godzina rozpoczęcia, format HH:MM. */
  start: string;
  /** Długość zajęć w minutach. */
  duration: number;
  styleId: string;
  level: LevelId;
  instructorId: string;
}

export const SCHEDULE: ScheduleEntry[] = [
  { id: "pn-1", day: 0, start: "17:30", duration: 60, styleId: "pierwsze-kroki", level: "start", instructorId: "kai" },
  { id: "pn-2", day: 0, start: "18:45", duration: 75, styleId: "wspolczesny", level: "basic", instructorId: "hana" },
  { id: "pn-3", day: 0, start: "20:15", duration: 60, styleId: "hip-hop", level: "intermediate", instructorId: "daniel" },

  { id: "wt-1", day: 1, start: "18:00", duration: 60, styleId: "balet", level: "start", instructorId: "hana" },
  { id: "wt-2", day: 1, start: "19:15", duration: 60, styleId: "high-heels", level: "basic", instructorId: "lena" },
  { id: "wt-3", day: 1, start: "20:30", duration: 60, styleId: "hip-hop", level: "basic", instructorId: "kai" },

  { id: "sr-1", day: 2, start: "17:30", duration: 60, styleId: "hip-hop", level: "start", instructorId: "daniel" },
  { id: "sr-2", day: 2, start: "18:45", duration: 75, styleId: "wspolczesny", level: "intermediate", instructorId: "hana" },
  { id: "sr-3", day: 2, start: "20:15", duration: 60, styleId: "high-heels", level: "intermediate", instructorId: "lena" },

  { id: "cz-1", day: 3, start: "18:00", duration: 60, styleId: "pierwsze-kroki", level: "start", instructorId: "lena" },
  { id: "cz-2", day: 3, start: "19:15", duration: 75, styleId: "balet", level: "basic", instructorId: "hana" },
  { id: "cz-3", day: 3, start: "20:45", duration: 75, styleId: "hip-hop", level: "advanced", instructorId: "daniel" },

  { id: "pt-1", day: 4, start: "18:00", duration: 60, styleId: "high-heels", level: "start", instructorId: "lena" },
  { id: "pt-2", day: 4, start: "19:15", duration: 90, styleId: "wspolczesny", level: "advanced", instructorId: "hana" },

  { id: "sb-1", day: 5, start: "10:00", duration: 60, styleId: "pierwsze-kroki", level: "start", instructorId: "kai" },
  { id: "sb-2", day: 5, start: "11:15", duration: 60, styleId: "balet", level: "start", instructorId: "hana" },
  { id: "sb-3", day: 5, start: "12:30", duration: 60, styleId: "hip-hop", level: "basic", instructorId: "kai" },
];
