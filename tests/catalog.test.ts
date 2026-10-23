import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { categories, collections, COLORS, products, SIZE_CHARTS, SIZES } from "@/data/catalog";
import {
  activeFilterCount,
  EMPTY_FILTERS,
  filterProducts,
  filtersFromParams,
  matchesQuery,
  paramsFromFilters,
  productsInSubcategory,
  relatedProducts,
} from "@/lib/catalog";

const publicPath = (src: string) => join(process.cwd(), "public", src);

describe("dane katalogu", () => {
  it("ma od 30 do 50 produktów z unikalnymi identyfikatorami i adresami", () => {
    expect(products.length).toBeGreaterThanOrEqual(30);
    expect(products.length).toBeLessThanOrEqual(50);
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
    expect(new Set(products.map((p) => p.slug)).size).toBe(products.length);
  });

  it("każdy wariant ma własne, istniejące zdjęcie i zdjęcie detalu", () => {
    const images = products.flatMap((p) => p.variants.map((v) => v.image));
    expect(new Set(images).size).toBe(images.length);
    for (const image of images) {
      expect(existsSync(publicPath(`images/products/${image}.jpg`)), image).toBe(true);
      expect(existsSync(publicPath(`images/products/${image}-detail.jpg`)), `${image}-detail`).toBe(true);
    }
    for (const c of collections) expect(existsSync(publicPath(`images/products/${c.coverImage}.jpg`))).toBe(true);
  });

  it("produkty należą tylko do kategorii bluzy/spodnie i do istniejących podkategorii", () => {
    for (const p of products) {
      const category = categories.find((c) => c.slug === p.category);
      expect(category).toBeDefined();
      for (const style of p.styles) expect(category!.subcategories.some((s) => s.slug === style), `${p.slug}: ${style}`).toBe(true);
      for (const v of p.variants) {
        expect(Object.hasOwn(COLORS, v.color)).toBe(true);
        expect(v.stock).toHaveLength(SIZES.length);
      }
      expect(p.price).toBeGreaterThan(0);
      expect(SIZE_CHARTS[p.fit]).toBeDefined();
    }
  });

  it("każda podkategoria ma produkty", () => {
    for (const c of categories) for (const s of c.subcategories) expect(productsInSubcategory(c.slug, s.slug).length, `${c.slug}/${s.slug}`).toBeGreaterThan(0);
  });

  it("w danych są niedostępne rozmiary (do testu blokady)", () => {
    expect(products.some((p) => p.variants.some((v) => v.stock.includes(0)))).toBe(true);
  });

  it("nie ma fałszywych cen promocyjnych", () => {
    for (const p of products) if (p.compareAtPrice !== undefined) expect(p.compareAtPrice).toBeGreaterThan(p.price);
  });
});

describe("filtrowanie i sortowanie", () => {
  const f = (patch: Partial<typeof EMPTY_FILTERS>) => ({ ...EMPTY_FILTERS, ...patch });

  it("filtruje po kategorii i podkategorii", () => {
    const result = filterProducts(products, f({ categories: ["spodnie"], styles: ["cargo"] }));
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((p) => p.category === "spodnie" && p.styles.includes("cargo"))).toBe(true);
  });

  it("filtruje po kolorze i rozmiarze łącznie (wariant musi mieć rozmiar w tym kolorze)", () => {
    const result = filterProducts(products, f({ colors: ["graphite"], sizes: ["XS"] }));
    for (const p of result) {
      const v = p.variants.find((x) => x.color === "graphite")!;
      expect(v.stock[0]).toBeGreaterThan(0);
    }
    // CORE Hoodie grafitowy ma XS = 0 → nie może się pojawić
    expect(result.some((p) => p.slug === "core-hoodie")).toBe(false);
  });

  it("filtruje po cenie i sortuje rosnąco/malejąco", () => {
    const result = filterProducts(products, f({ priceMin: 250, priceMax: 300, sort: "cena-rosnaco" }));
    expect(result.every((p) => p.price >= 25000 && p.price <= 30000)).toBe(true);
    const prices = result.map((p) => p.price);
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
    const desc = filterProducts(products, f({ sort: "cena-malejaco" })).map((p) => p.price);
    expect(desc).toEqual([...desc].sort((a, b) => b - a));
  });

  it("wyszukuje bez polskich znaków i po odmianie", () => {
    const cargo = products.find((p) => p.slug === "parachute-cargo")!;
    expect(matchesQuery(cargo, "CARGO czarne")).toBe(true);
    expect(matchesQuery(cargo, "spodnie")).toBe(true);
    expect(matchesQuery(cargo, "bluza")).toBe(false);
    const hoodie = products.find((p) => p.slug === "core-hoodie")!;
    expect(matchesQuery(hoodie, "bluzy z kapturem")).toBe(true);
    expect(matchesQuery(hoodie, "grafitowa")).toBe(true);
  });

  it("zapisuje filtry w adresie i odczytuje je z powrotem", () => {
    const filters = f({ q: "zip", sizes: ["M", "L"], colors: ["black"], fits: ["oversize"], priceMin: 100, priceMax: 400, availableOnly: true, sort: "najnowsze" });
    const params = paramsFromFilters(filters);
    expect(filtersFromParams(params)).toEqual(filters);
    expect(activeFilterCount(filters)).toBe(8);
  });

  it("ignoruje niepoprawne wartości w adresie", () => {
    const parsed = filtersFromParams(new URLSearchParams("rozmiar=XXXL,M&kolor=pink&cena-od=abc&sort=zly"));
    expect(parsed.sizes).toEqual(["M"]);
    expect(parsed.colors).toEqual([]);
    expect(parsed.priceMin).toBeNull();
    expect(parsed.sort).toBe("polecane");
  });

  it("produkty powiązane nie zawierają bieżącego", () => {
    const p = products[0];
    const related = relatedProducts(p, 4);
    expect(related).toHaveLength(4);
    expect(related.some((r) => r.id === p.id)).toBe(false);
  });
});
