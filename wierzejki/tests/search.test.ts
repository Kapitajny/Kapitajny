import { describe, expect, it } from "vitest";
import { allLocations, retailStores, wholesalePoints } from "@/content/locations";
import { productGroups } from "@/content/products";
import { filterGroups } from "@/lib/catalog";
import { listPl, normalizeForSearch, telHref } from "@/lib/format";

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

describe("punkty sprzedaży", () => {
  it("strona pokazuje cztery hurtownie firmy i nie zawiera niepotwierdzonych sklepów", () => {
    expect(wholesalePoints.map((w) => w.city)).toEqual(["Siedlce", "Łuków", "Otwock", "Warszawa"]);
    expect(retailStores).toEqual([]);
    expect(allLocations.every((l) => l.verification === "firma")).toBe(true);
  });
  it("każdy punkt ma unikalny adres URL", () => {
    expect(new Set(allLocations.map((l) => l.slug)).size).toBe(allLocations.length);
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
