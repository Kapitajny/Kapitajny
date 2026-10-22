import { describe, expect, it } from "vitest";
import { INSTRUCTORS } from "@/data/instructors";
import { LEVELS } from "@/data/levels";
import { SCHEDULE } from "@/data/schedule";
import { STYLES } from "@/data/styles";
import { EMPTY_FILTERS, endTime, filterSchedule, groupByDay, hasActiveFilters, pluralizeSlots } from "@/lib/schedule";

describe("dane grafiku", () => {
  it("odwołują się wyłącznie do istniejących stylów, poziomów i instruktorów", () => {
    for (const entry of SCHEDULE) {
      expect(STYLES.some((style) => style.id === entry.styleId), entry.id).toBe(true);
      expect(INSTRUCTORS.some((instructor) => instructor.id === entry.instructorId), entry.id).toBe(true);
      expect(entry.level in LEVELS, entry.id).toBe(true);
    }
  });

  it("mają unikalne identyfikatory", () => {
    expect(new Set(SCHEDULE.map((entry) => entry.id)).size).toBe(SCHEDULE.length);
  });

  it("każdy styl ma w grafiku grupy na wszystkich deklarowanych poziomach", () => {
    for (const style of STYLES) {
      const levels = new Set(SCHEDULE.filter((entry) => entry.styleId === style.id).map((entry) => entry.level));
      expect([...levels].sort(), style.id).toEqual([...style.levels].sort());
    }
  });
});

describe("filterSchedule", () => {
  it("bez filtrów zwraca cały grafik", () => {
    expect(filterSchedule(SCHEDULE, EMPTY_FILTERS)).toHaveLength(SCHEDULE.length);
    expect(hasActiveFilters(EMPTY_FILTERS)).toBe(false);
  });

  it("łączy filtry warunkiem „i”", () => {
    const filters = { ...EMPTY_FILTERS, styleId: "hip-hop", level: "start" as const };
    const result = filterSchedule(SCHEDULE, filters);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((entry) => entry.styleId === "hip-hop" && entry.level === "start")).toBe(true);
    expect(hasActiveFilters(filters)).toBe(true);
  });

  it("zwraca pustą listę, gdy nic nie pasuje", () => {
    expect(filterSchedule(SCHEDULE, { ...EMPTY_FILTERS, day: 6 })).toEqual([]);
  });
});

describe("groupByDay", () => {
  it("zachowuje kolejność dni tygodnia i godzin oraz pomija puste dni", () => {
    const groups = groupByDay([...SCHEDULE].reverse());
    expect(groups.map((group) => group.day.id)).toEqual([0, 1, 2, 3, 4, 5]);
    for (const group of groups) {
      const starts = group.entries.map((entry) => entry.start);
      expect(starts).toEqual([...starts].sort());
    }
  });
});

describe("endTime", () => {
  it("dodaje długość zajęć do godziny rozpoczęcia", () => {
    expect(endTime("18:45", 75)).toBe("20:00");
    expect(endTime("09:30", 60)).toBe("10:30");
    expect(endTime("23:30", 60)).toBe("00:30");
  });
});

describe("pluralizeSlots", () => {
  it("odmienia słowo „termin”", () => {
    expect([1, 2, 5, 12, 17, 22, 25].map(pluralizeSlots)).toEqual(["1 termin", "2 terminy", "5 terminów", "12 terminów", "17 terminów", "22 terminy", "25 terminów"]);
  });
});
