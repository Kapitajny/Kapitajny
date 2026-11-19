import { describe, expect, it } from "vitest";
import { buildAvailability, daySlots, isSlotBookable, slotInterval } from "@/lib/booking/slots";
import { addDays, utcToZoned, zonedToUtc } from "@/lib/booking/time";

// środa 18.11.2026, 09:00 czasu polskiego (UTC+1)
const NOW = new Date("2026-11-18T08:00:00Z");

describe("strefa czasowa Europe/Warsaw", () => {
  it("przelicza czas zimowy i letni", () => {
    expect(zonedToUtc("2026-11-20", 600).toISOString()).toBe("2026-11-20T09:00:00.000Z");
    expect(zonedToUtc("2026-07-01", 600).toISOString()).toBe("2026-07-01T08:00:00.000Z");
  });
  it("obsługuje dzień zmiany czasu", () => {
    // 29.03.2026 – przejście na czas letni o 2:00
    expect(zonedToUtc("2026-03-29", 12 * 60).toISOString()).toBe("2026-03-29T10:00:00.000Z");
    // 25.10.2026 – powrót na czas zimowy o 3:00
    expect(zonedToUtc("2026-10-25", 12 * 60).toISOString()).toBe("2026-10-25T11:00:00.000Z");
  });
  it("zamienia moment UTC na lokalny dzień i minuty", () => {
    expect(utcToZoned(new Date("2026-11-18T23:30:00Z"))).toEqual({ date: "2026-11-19", minutes: 30 });
  });
});

describe("silnik terminów", () => {
  it("generuje sloty w godzinach otwarcia, z miejscem na całą sesję", () => {
    const slots = daySlots("2026-11-20", 120, [], NOW); // piątek 10–22
    expect(slots[0].time).toBe("10:00");
    expect(slots.at(-1)!.time).toBe("20:00");
    expect(slots.every((s) => s.available)).toBe(true);
  });

  it("zamyka niedziele i skraca soboty", () => {
    expect(daySlots("2026-11-22", 60, [], NOW)).toEqual([]);
    const sat = daySlots("2026-11-21", 60, [], NOW);
    expect(sat[0].time).toBe("11:00");
    expect(sat.at(-1)!.time).toBe("19:00");
  });

  it("wymaga minimalnego wyprzedzenia 12 h", () => {
    const today = daySlots("2026-11-18", 60, [], NOW);
    expect(today.find((s) => s.time === "20:00")!.available).toBe(false); // 11 h od teraz
    expect(today.find((s) => s.time === "21:00")!.available).toBe(true); // 12 h od teraz
  });

  it("blokuje terminy nachodzące na zajęte przedziały", () => {
    const busy = [slotInterval("2026-11-20", "14:00", 120)];
    const slots = daySlots("2026-11-20", 120, busy, NOW);
    const at = (t: string) => slots.find((s) => s.time === t)!.available;
    expect(at("12:00")).toBe(true); // kończy się dokładnie o 14:00
    expect(at("13:00")).toBe(false);
    expect(at("14:00")).toBe(false);
    expect(at("15:00")).toBe(false);
    expect(at("16:00")).toBe(true);
  });

  it("nie pozwala rezerwować poza horyzontem ani w przeszłości", () => {
    expect(isSlotBookable("2026-11-17", "12:00", 60, [], NOW)).toBe(false);
    expect(isSlotBookable(addDays("2026-11-18", 90), "12:00", 60, [], NOW)).toBe(false);
    expect(isSlotBookable("2026-11-20", "12:30", 60, [], NOW)).toBe(false); // poza siatką
    expect(isSlotBookable("2026-11-20", "21:00", 120, [], NOW)).toBe(false); // wychodzi poza 22:00
  });

  it("buduje kalendarz z oznaczeniem dni zamkniętych", () => {
    const days = buildAvailability("2026-11-20", 3, 60, [], NOW);
    expect(days.map((d) => [d.date, d.closed])).toEqual([
      ["2026-11-20", false],
      ["2026-11-21", false],
      ["2026-11-22", true],
    ]);
  });
});
