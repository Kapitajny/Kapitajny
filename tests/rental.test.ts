import { describe, expect, it } from "vitest";
import { checkSlot, conflicts, daySlots, durationLabelLong, formatPrice, type BookingRules, type OpeningDay } from "@/lib/rental";
import { fromLocal, toLocal } from "@/lib/time";

const hours: OpeningDay[] = Array.from({ length: 7 }, (_, d) => ({ weekday: d, open: "10:00", close: "20:00" }));
const rules: BookingRules = { prepMinutes: 15, leadMinutes: 60, slotStepMinutes: 30, horizonDays: 60, cancelFreeHours: 24 };
// 1 lipca 2027, 08:00 w Warszawie
const now = fromLocal("2027-07-01", 8 * 60);

describe("czas lokalny", () => {
  it("przelicza czas letni i zimowy", () => {
    expect(new Date(fromLocal("2027-07-01", 12 * 60)).toISOString()).toBe("2027-07-01T10:00:00.000Z");
    expect(new Date(fromLocal("2027-01-15", 12 * 60)).toISOString()).toBe("2027-01-15T11:00:00.000Z");
    expect(toLocal(fromLocal("2027-03-28", 3 * 60 + 30))).toEqual({ date: "2027-03-28", minutes: 210 });
  });
});

describe("reguły dostępności", () => {
  const ctx = { now, hours, rules, busy: [] };

  it("dopuszcza start w godzinach otwarcia", () => {
    expect(checkSlot("2027-07-02", 10 * 60, 60, ctx)).toBeNull();
  });

  it("odrzuca wynajem kończący się po zamknięciu", () => {
    expect(checkSlot("2027-07-02", 19 * 60, 120, ctx)).toBe("after-close");
    expect(checkSlot("2027-07-02", 18 * 60, 120, ctx)).toBeNull();
  });

  it("wymaga zwrotu w godzinach otwarcia dla 12 h i 24 h", () => {
    expect(checkSlot("2027-07-02", 10 * 60, 1440, ctx)).toBeNull();
    expect(checkSlot("2027-07-02", 11 * 60, 720, ctx)).toBe("return-closed");
    expect(checkSlot("2027-07-02", 8 * 60, 720, ctx)).toBe("closed");
  });

  it("odrzuca termin zbyt bliski lub zbyt odległy", () => {
    expect(checkSlot("2027-07-01", 8 * 60 + 30, 30, { ...ctx, hours: [{ weekday: 4, open: "08:00", close: "20:00" }] })).toBe("past");
    expect(checkSlot("2027-12-01", 10 * 60, 60, ctx)).toBe("too-far");
  });

  it("uwzględnia bufor przygotowania po rezerwacji", () => {
    const start = fromLocal("2027-07-02", 10 * 60);
    const busy = [{ start, end: start + 60 * 60_000, booking: true }];
    expect(conflicts(start + 60 * 60_000, start + 90 * 60_000, busy, 15)).toBe(true);
    expect(conflicts(start + 75 * 60_000, start + 105 * 60_000, busy, 15)).toBe(false);
    // blokada nie ma bufora
    expect(conflicts(start + 60 * 60_000, start + 90 * 60_000, [{ ...busy[0], booking: false }], 15)).toBe(false);
  });

  it("pokazuje zajęte godziny jako niedostępne", () => {
    const start = fromLocal("2027-07-02", 12 * 60);
    const slots = daySlots("2027-07-02", 60, { ...ctx, busy: [{ start, end: start + 3_600_000, booking: true }] });
    expect(slots.find((s) => s.time === "11:00")?.available).toBe(false);
    expect(slots.find((s) => s.time === "12:30")?.available).toBe(false);
    expect(slots.find((s) => s.time === "13:30")?.available).toBe(true);
    expect(slots.at(-1)?.time).toBe("19:00");
  });

  it("nie zwraca godzin w dniu zamkniętym", () => {
    expect(daySlots("2027-07-02", 60, { ...ctx, hours: hours.map((h) => (h.weekday === 5 ? { ...h, open: null, close: null } : h)) })).toEqual([]);
  });
});

describe("formatowanie", () => {
  it("formatuje ceny i czasy", () => {
    expect(formatPrice(null)).toBe("—");
    expect(formatPrice(25000).replace(/\s/g, " ")).toBe("250 zł");
    expect(durationLabelLong(30)).toBe("30 minut");
    expect(durationLabelLong(120)).toBe("2 godziny");
    expect(durationLabelLong(360)).toBe("6 godzin");
  });
});

describe("cennik godzinowy", () => {
  it("liczy każdą godzinę po 170 zł brutto", async () => {
    const { pricesFromHourly, hourlyRate } = await import("@/lib/rental");
    expect(pricesFromHourly(17_000)).toEqual({ 30: 8_500, 60: 17_000, 120: 34_000, 180: 51_000, 240: 68_000, 360: 102_000, 720: 204_000, 1440: 408_000 });
    expect(hourlyRate(408_000, 1440)).toBe(17_000);
  });
});
