import { describe, expect, it } from "vitest";
import { allLocations, retailStores, wholesalePoints } from "@/content/locations";
import { productGroups } from "@/content/products";
import { filterGroups } from "@/lib/catalog";
import { listPl, normalizeForSearch, telHref } from "@/lib/format";
import { cityAnchor, citySummary, groupByCity, pluralPl } from "@/lib/locations-search";

describe("format", () => {
  it("buduje link tel: z zapisu numeru", () => {
    expect(telHref("+48 25 643 75 00")).toBe("tel:+48256437500");
  });
  it("normalizuje polskie znaki", () => {
    expect(normalizeForSearch("Łuków ŻÓŁĆ")).toBe("lukow zolc");
  });
  it("łączy listę po polsku", () => {
    expect(listPl(["A", "B", "C"])).toBe("A, B i C");
  });
});

describe("spis punktów sprzedaży", () => {
  const groups = groupByCity(allLocations);
  it("każdy punkt trafia do dokładnie jednej grupy miasta", () => {
    expect(new Set(groups.map((g) => g.city)).size).toBe(groups.length);
    expect(groups.reduce((n, g) => n + g.items.length, 0)).toBe(allLocations.length);
    expect(groups.every((g) => g.items.every((l) => l.city === g.city))).toBe(true);
  });
  it("miasta od największej liczby punktów, w mieście najpierw hurtownia", () => {
    expect(groups[0].city).toBe("Warszawa");
    const siedlce = groups.find((g) => g.city === "Siedlce")!;
    expect(siedlce.items[0].type).toBe("hurtownia");
  });
  it("kotwice miast są bez polskich znaków i unikalne", () => {
    expect(cityAnchor("Łódź")).toBe("punkty-lodz");
    expect(cityAnchor("Ząbki")).toBe("punkty-zabki");
    expect(new Set(groups.map((g) => cityAnchor(g.city))).size).toBe(groups.length);
  });
  it("każdy punkt ma unikalny adres URL", () => {
    expect(new Set(allLocations.map((l) => l.slug)).size).toBe(allLocations.length);
  });
  it("każdy sklep ma źródło, a sklepy z Wolt także link", () => {
    expect(retailStores.every((s) => s.source && s.verification !== "firma")).toBe(true);
    expect(retailStores.filter((s) => s.verification === "wolt").every((s) => s.sourceUrl?.startsWith("https://wolt.com/"))).toBe(true);
    expect(wholesalePoints.length).toBe(4);
  });
  it("liczy miejscowości od największej", () => {
    const summary = citySummary(allLocations);
    expect(summary[0].count).toBeGreaterThanOrEqual(summary[summary.length - 1].count);
  });
  it("odmienia liczebniki", () => {
    expect([1, 2, 5, 12, 22, 25].map((n) => pluralPl(n, "punkt", "punkty", "punktów"))).toEqual(["punkt", "punkty", "punktów", "punktów", "punkty", "punktów"]);
  });
});

describe("filterGroups", () => {
  const all = { category: "all", channel: "all", query: "" } as const;
  it("filtruje po kategorii", () => {
    expect(filterGroups(productGroups, { ...all, category: "garmaz" }).every((g) => g.category === "garmaz")).toBe(true);
  });
  it("szuka w przykładach produktów", () => {
    expect(filterGroups(productGroups, { ...all, query: "ruskie" }).map((g) => g.id)).toEqual(["pierogi"]);
  });
  it("łączy filtr kanału z frazą", () => {
    expect(filterGroups(productGroups, { ...all, channel: "horeca", query: "kabanosy" })).toEqual([]);
  });
});
