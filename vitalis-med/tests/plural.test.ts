import { describe, expect, it } from "vitest";
import { vehicles } from "@/lib/plural";
import { fleet, fleetTotal } from "@/data/fleet";

describe("vehicles", () => {
  it("uses correct Polish plural forms", () => {
    expect([1, 2, 4, 5, 11, 12, 22, 25].map(vehicles)).toEqual([
      "1 pojazd",
      "2 pojazdy",
      "4 pojazdy",
      "5 pojazdów",
      "11 pojazdów",
      "12 pojazdów",
      "22 pojazdy",
      "25 pojazdów",
    ]);
  });
  it("fleet adds up to 20 ambulances (4 T, 5 S, 11 P)", () => {
    expect(fleetTotal).toBe(20);
    expect(Object.fromEntries(fleet.map((c) => [c.type, c.count]))).toEqual({ T: 4, S: 5, P: 11 });
  });
});
