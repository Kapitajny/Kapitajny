import { describe, expect, it } from "vitest";
import { comparison, formatPrice, packageById, packageForPlatformCount, packages } from "@/config/pricing";
import { caseTotals, cases, portfolio } from "@/data/demo";
import { services } from "@/data/services";

describe("cennik", () => {
  it("ceny robocze z briefu", () => {
    expect(packages.map((p) => [p.name, p.priceNet])).toEqual([
      ["START", 799],
      ["GROWTH", 1399],
      ["PROFESSIONAL", 2199],
    ]);
  });

  it("formatuje ceny ze spacją tysięcy (także czterocyfrowe)", () => {
    expect(formatPrice(799)).toBe("799");
    expect(formatPrice(1399)).toBe("1 399");
    expect(formatPrice(12000)).toBe("12 000");
  });

  it("dobiera pakiet do liczby platform", () => {
    expect(packageForPlatformCount(1).id).toBe("start");
    expect(packageForPlatformCount(2).id).toBe("growth");
    expect(packageForPlatformCount(3).id).toBe("professional");
    expect(packageForPlatformCount(4).id).toBe("professional");
    expect(packageForPlatformCount(9).id).toBe("professional");
    expect(packageById("nie-ma")).toBeUndefined();
  });

  it("każdy wiersz porównania ma wartość dla każdego pakietu", () => {
    for (const row of comparison) expect(row.values).toHaveLength(packages.length);
  });
});

describe("dane demonstracyjne", () => {
  it("wszystkie projekty i case studies są oznaczone jako demo", () => {
    expect(portfolio.every((p) => p.isDemo)).toBe(true);
    expect(cases.every((c) => c.isDemo)).toBe(true);
  });

  it("plan projektu używa tylko jego platform i mieści się w 8 tygodniach", () => {
    for (const p of portfolio) {
      for (const [id, start, span] of p.flights) {
        expect(p.platforms).toContain(id);
        expect(start).toBeGreaterThanOrEqual(1);
        expect(start + span - 1).toBeLessThanOrEqual(8);
      }
    }
  });

  it("wskaźniki są liczone z danych tygodniowych", () => {
    const t = caseTotals(cases[0]);
    expect(t.spend).toBe(cases[0].weeks.reduce((s, w) => s + w.spend, 0));
    expect(t.cpa).toBeCloseTo(t.spend / t.conversions);
    expect(t.roas).toBeCloseTo(t.revenue / t.spend);
  });

  it("każda usługa ma oficjalny znak i sekcję „kiedy nie”", () => {
    for (const s of services) {
      expect(s.logo.path.length).toBeGreaterThan(20);
      expect(s.notFor.length).toBeGreaterThan(20);
    }
  });
});

describe("brak nieudokumentowanych wyróżnień", () => {
  it("żaden pakiet nie jest oznaczony jako „najczęstszy wybór”", () => {
    for (const p of packages) expect(p).not.toHaveProperty("featured");
  });
});
