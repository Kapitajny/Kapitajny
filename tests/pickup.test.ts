import { describe, expect, it } from "vitest";
import { getLocation } from "@/data/locations";
import { addDays, formatPickup, getPickupSlots, getWarsawNow, isValidPickup } from "@/lib/pickup";

const srodmiescie = getLocation("srodmiescie")!; // pon.–pt. 07:30–19:00, weekend 09:00–18:00

describe("getWarsawNow", () => {
  it("przelicza czas na strefę Europe/Warsaw (lato i zima)", () => {
    expect(getWarsawNow(new Date("2026-07-01T10:00:00Z"))).toEqual({ date: "2026-07-01", minutes: 12 * 60 });
    expect(getWarsawNow(new Date("2026-01-15T23:30:00Z"))).toEqual({ date: "2026-01-16", minutes: 30 });
  });
});

describe("getPickupSlots", () => {
  it("dziś: pierwszy termin to teraz + 20 min, zaokrąglone do 15 min", () => {
    // środa 2026-10-14, 10:07 w Gdańsku → najwcześniej 10:27 → 10:30
    const slots = getPickupSlots(srodmiescie, "2026-10-14", { date: "2026-10-14", minutes: 10 * 60 + 7 });
    expect(slots[0]).toBe("10:30");
    expect(slots.at(-1)).toBe("18:45");
  });

  it("jutro: od otwarcia + 15 min, w weekend według godzin weekendowych", () => {
    // piątek → sobota 2026-10-17
    const slots = getPickupSlots(srodmiescie, "2026-10-17", { date: "2026-10-16", minutes: 20 * 60 });
    expect(slots[0]).toBe("09:15");
    expect(slots.at(-1)).toBe("17:45");
  });

  it("po zamknięciu nie ma terminów na dziś", () => {
    expect(getPickupSlots(srodmiescie, "2026-10-14", { date: "2026-10-14", minutes: 18 * 60 + 50 })).toEqual([]);
  });

  it("nie pozwala na przeszłe dni ani na więcej niż jutro", () => {
    const now = { date: "2026-10-14", minutes: 8 * 60 };
    expect(getPickupSlots(srodmiescie, "2026-10-13", now)).toEqual([]);
    expect(getPickupSlots(srodmiescie, addDays("2026-10-14", 2), now)).toEqual([]);
  });
});

describe("isValidPickup", () => {
  const now = { date: "2026-10-14", minutes: 9 * 60 };
  it("akceptuje tylko oferowane terminy", () => {
    expect(isValidPickup(srodmiescie, "2026-10-14", "10:00", now)).toBe(true);
    expect(isValidPickup(srodmiescie, "2026-10-14", "09:05", now)).toBe(false); // za wcześnie
    expect(isValidPickup(srodmiescie, "2026-10-14", "10:10", now)).toBe(false); // poza siatką 15 min
    expect(isValidPickup(srodmiescie, "2026-10-14", "19:00", now)).toBe(false); // zamknięcie
    expect(isValidPickup(srodmiescie, 20261014, "10:00", now)).toBe(false);
  });
});

describe("formatPickup", () => {
  it("opisuje dziś i jutro", () => {
    const now = { date: "2026-10-14", minutes: 0 };
    expect(formatPickup("2026-10-14", "10:30", now)).toBe("dziś, 10:30");
    expect(formatPickup("2026-10-15", "09:15", now)).toMatch(/^jutro \(.+\), 09:15$/);
  });
});
