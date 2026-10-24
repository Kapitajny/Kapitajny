import { describe, expect, it } from "vitest";
import { allLocations, wholesalePoints } from "@/content/locations";
import { productGroups } from "@/content/products";
import { filterGroups } from "@/lib/catalog";
import { listPl, normalizeForSearch, telHref } from "@/lib/format";
import { searchLocations } from "@/lib/locations-search";

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
  const all = { query: "", type: "all", region: "all" } as const;
  it("znajduje hurtownię bez polskich znaków", () => {
    expect(searchLocations(allLocations, { ...all, query: "lukow" }).map((l) => l.city)).toEqual(["Łuków"]);
  });
  it("filtruje po województwie", () => {
    expect(searchLocations(allLocations, { ...all, region: "lubelskie" })).toHaveLength(
      allLocations.filter((l) => l.region === "lubelskie").length,
    );
  });
  it("zwraca pustą listę dla nieznanej miejscowości", () => {
    expect(searchLocations(allLocations, { ...all, query: "Gdańsk" })).toEqual([]);
  });
  it("każda hurtownia ma unikalny adres URL", () => {
    expect(new Set(wholesalePoints.map((w) => w.slug)).size).toBe(wholesalePoints.length);
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
