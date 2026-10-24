import { describe, expect, it } from "vitest";
import { allLocations, retailStores, wholesalePoints } from "@/content/locations";
import { productGroups } from "@/content/products";
import { filterGroups } from "@/lib/catalog";
import { listPl, normalizeForSearch, telHref } from "@/lib/format";
import { EMPTY_FILTER, citySummary, groupByCity, pluralPl, searchLocations } from "@/lib/locations-search";

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

describe("searchLocations", () => {
  const all = EMPTY_FILTER;
  it("znajduje hurtownię bez polskich znaków", () => {
    const found = searchLocations(allLocations, { ...all, query: "lukow" });
    expect(found.map((l) => l.city)).toContain("Łuków");
    expect(found.map((l) => l.street)).toContain("ul. Łukowska 16");
  });
  it("filtruje po województwie", () => {
    expect(searchLocations(allLocations, { ...all, region: "lubelskie" })).toHaveLength(
      allLocations.filter((l) => l.region === "lubelskie").length,
    );
  });
  it("zwraca pustą listę dla nieznanej miejscowości", () => {
    expect(searchLocations(allLocations, { ...all, query: "Gdańsk" })).toEqual([]);
  });
  it("każdy punkt ma unikalny adres URL", () => {
    expect(new Set(allLocations.map((l) => l.slug)).size).toBe(allLocations.length);
  });
  it("szuka po kodzie pocztowym i numerze sklepu", () => {
    expect(searchLocations(allLocations, { ...all, query: "03-361" }).map((l) => l.street)).toEqual(["ul. Ludwika Kondratowicza 23"]);
    expect(searchLocations(allLocations, { ...all, query: "nr 45" }).map((l) => l.street)).toEqual(["ul. Złota 67"]);
  });
  it("filtruje po miejscowości i stawia hurtownie przed sklepami", () => {
    const siedlce = searchLocations(allLocations, { ...all, city: "Siedlce" });
    expect(siedlce.every((l) => l.city === "Siedlce")).toBe(true);
    expect(siedlce[0].type).toBe("hurtownia");
  });
  it("grupuje wyniki po miejscowości bez powtórzeń", () => {
    const groups = groupByCity(searchLocations(allLocations, all));
    expect(new Set(groups.map((g) => g.city)).size).toBe(groups.length);
    expect(groups.reduce((n, g) => n + g.items.length, 0)).toBe(allLocations.length);
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
