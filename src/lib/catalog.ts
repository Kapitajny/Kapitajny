import {
  categories,
  collections,
  COLORS,
  drops,
  FITS,
  products,
  SIZES,
  type Category,
  type CategorySlug,
  type ColorId,
  type ColorVariant,
  type Fit,
  type Product,
  type Size,
} from "@/data/catalog";

/* --------------------------------------------------------------------------------------------
 * Odczyt katalogu
 * ------------------------------------------------------------------------------------------ */

const bySlug = new Map(products.map((p) => [p.slug, p]));
const byId = new Map(products.map((p) => [p.id, p]));

export const getProduct = (slug: string) => bySlug.get(slug) ?? null;
export const getProductById = (id: string) => byId.get(id) ?? null;
export const getCategory = (slug: string): Category | null => categories.find((c) => c.slug === slug) ?? null;
export const getSubcategory = (category: string, slug: string) => getCategory(category)?.subcategories.find((s) => s.slug === slug) ?? null;
export const getCollection = (slug: string) => collections.find((c) => c.slug === slug) ?? null;

export const isSize = (value: unknown): value is Size => typeof value === "string" && (SIZES as readonly string[]).includes(value);
export const isColor = (value: unknown): value is ColorId => typeof value === "string" && Object.hasOwn(COLORS, value);

export const colorName = (color: ColorId) => COLORS[color].name;
export const fitName = (fit: Fit) => FITS[fit].name;

export function getVariant(product: Product, color: string): ColorVariant | null {
  return product.variants.find((v) => v.color === color) ?? null;
}

/** Stan początkowy z katalogu (bez uwzględnienia sprzedaży). */
export function catalogStock(product: Product, color: string, size: Size): number {
  const variant = getVariant(product, color);
  return variant ? variant.stock[SIZES.indexOf(size)] : 0;
}

export const imageSrc = (image: string) => `/images/products/${image}.jpg`;
export const detailSrc = (image: string) => `/images/products/${image}-detail.jpg`;

export function productHref(product: Product, color?: string): string {
  return color && color !== product.variants[0].color ? `/produkt/${product.slug}?kolor=${color}` : `/produkt/${product.slug}`;
}

/** Identyfikator wariantu: produkt + kolor + rozmiar. */
export const skuOf = (productId: string, color: string, size: string) => `${productId}-${color}-${size}`;

export const latestDrop = drops.reduce((a, b) => (a.date > b.date ? a : b));
export const dropOf = (product: Product) => drops.find((d) => d.id === product.drop)!;
export const isNewArrival = (product: Product) => product.drop === latestDrop.id;

export const newArrivals = () => products.filter(isNewArrival);
export const productsInCategory = (category: CategorySlug) => products.filter((p) => p.category === category);
export const productsInSubcategory = (category: CategorySlug, sub: string) => products.filter((p) => p.category === category && p.styles.includes(sub));
export const productsInCollection = (slug: string) => products.filter((p) => p.collections.includes(slug));

/** Produkty powiązane: ta sama podkategoria lub kolekcja, potem reszta kategorii. */
export function relatedProducts(product: Product, limit = 4): Product[] {
  const score = (other: Product) =>
    (other.category === product.category ? 2 : 0) +
    other.styles.filter((s) => product.styles.includes(s)).length +
    other.collections.filter((c) => product.collections.includes(c)).length * 2;
  return products
    .filter((p) => p.id !== product.id)
    .map((p) => ({ p, s: score(p) }))
    .sort((a, b) => b.s - a.s || a.p.id.localeCompare(b.p.id))
    .slice(0, limit)
    .map(({ p }) => p);
}

/* --------------------------------------------------------------------------------------------
 * Filtrowanie, sortowanie, wyszukiwanie
 * ------------------------------------------------------------------------------------------ */

export type SortKey = "polecane" | "najnowsze" | "cena-rosnaco" | "cena-malejaco";

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "polecane", label: "Polecane" },
  { value: "najnowsze", label: "Najnowsze" },
  { value: "cena-rosnaco", label: "Cena: od najniższej" },
  { value: "cena-malejaco", label: "Cena: od najwyższej" },
];

export interface CatalogFilters {
  q: string;
  categories: CategorySlug[];
  styles: string[];
  sizes: Size[];
  colors: ColorId[];
  fits: Fit[];
  /** Ceny w złotych (pełne kwoty), `null` = bez ograniczenia. */
  priceMin: number | null;
  priceMax: number | null;
  availableOnly: boolean;
  sort: SortKey;
}

export const EMPTY_FILTERS: CatalogFilters = {
  q: "",
  categories: [],
  styles: [],
  sizes: [],
  colors: [],
  fits: [],
  priceMin: null,
  priceMax: null,
  availableOnly: false,
  sort: "polecane",
};

/** Usuwa polskie znaki i wielkość liter, żeby „bluzy”, „Bluzę” i „BLUZE” pasowały do siebie. */
export function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/ł/g, "l");
}

function searchText(product: Product): string {
  const category = getCategory(product.category)!;
  const styles = product.styles.map((s) => getSubcategory(product.category, s)?.name ?? s);
  const colorsText = product.variants.map((v) => COLORS[v.color].name);
  return normalize([product.name, product.kind, category.name, ...styles, ...colorsText, FITS[product.fit].name, product.material, product.description].join(" "));
}
const searchIndex = new Map(products.map((p) => [p.id, searchText(p)]));

/** Każde słowo zapytania musi wystąpić (dopasowanie po początku słowa w tekście produktu). */
export function matchesQuery(product: Product, query: string): boolean {
  const terms = normalize(query).split(/\s+/).filter(Boolean);
  if (!terms.length) return true;
  const haystack = searchIndex.get(product.id) ?? searchText(product);
  // Rdzeń słowa: „bluzy”/„bluza”/„bluze” → „bluz”; krótkie słowa bez zmian.
  return terms.every((term) => {
    const stem = term.length > 4 ? term.slice(0, -1) : term;
    return new RegExp(`(^|[^a-z0-9])${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(haystack);
  });
}

export type StockLookup = (product: Product, color: ColorId, size: Size) => number;

const defaultStock: StockLookup = (product, color, size) => catalogStock(product, color, size);

export function filterProducts(list: Product[], filters: CatalogFilters, stock: StockLookup = defaultStock): Product[] {
  const result = list.filter((product) => {
    if (filters.categories.length && !filters.categories.includes(product.category)) return false;
    if (filters.styles.length && !filters.styles.some((s) => product.styles.includes(s))) return false;
    if (filters.fits.length && !filters.fits.includes(product.fit)) return false;
    const zl = product.price / 100;
    if (filters.priceMin !== null && zl < filters.priceMin) return false;
    if (filters.priceMax !== null && zl > filters.priceMax) return false;
    if (!matchesQuery(product, filters.q)) return false;

    // Kolor i rozmiar sprawdzamy łącznie: wariant w wybranym kolorze musi mieć wybrany rozmiar.
    const variants = filters.colors.length ? product.variants.filter((v) => filters.colors.includes(v.color)) : product.variants;
    if (!variants.length) return false;
    if (filters.sizes.length || filters.availableOnly) {
      const sizes = filters.sizes.length ? filters.sizes : SIZES;
      const ok = variants.some((v) => sizes.some((size) => stock(product, v.color, size) > 0));
      if (!ok) return false;
    }
    return true;
  });
  return sortProducts(result, filters.sort);
}

export function sortProducts(list: Product[], sort: SortKey): Product[] {
  const copy = [...list];
  const order = new Map(products.map((p, i) => [p.id, i]));
  switch (sort) {
    case "najnowsze":
      return copy.sort((a, b) => dropOf(b).date.localeCompare(dropOf(a).date) || order.get(a.id)! - order.get(b.id)!);
    case "cena-rosnaco":
      return copy.sort((a, b) => a.price - b.price || order.get(a.id)! - order.get(b.id)!);
    case "cena-malejaco":
      return copy.sort((a, b) => b.price - a.price || order.get(a.id)! - order.get(b.id)!);
    default:
      return copy.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
  }
}

/* --------------------------------------------------------------------------------------------
 * Filtry ↔ parametry adresu (?rozmiar=M&kolor=black&cena-od=200 …)
 * ------------------------------------------------------------------------------------------ */

const FIT_KEYS = Object.keys(FITS) as Fit[];

export function filtersFromParams(params: URLSearchParams, base: Partial<CatalogFilters> = {}): CatalogFilters {
  const list = (key: string) => params.getAll(key).flatMap((v) => v.split(",")).filter(Boolean);
  const num = (key: string) => {
    const raw = params.get(key);
    if (raw === null || raw.trim() === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? Math.round(value) : null;
  };
  const sort = params.get("sort");
  return {
    ...EMPTY_FILTERS,
    ...base,
    q: (params.get("q") ?? "").slice(0, 80),
    categories: base.categories?.length ? base.categories : (list("kategoria").filter((c) => getCategory(c)) as CategorySlug[]),
    styles: base.styles?.length ? base.styles : list("styl"),
    sizes: list("rozmiar").filter(isSize),
    colors: list("kolor").filter(isColor),
    fits: list("kroj").filter((f): f is Fit => FIT_KEYS.includes(f as Fit)),
    priceMin: num("cena-od"),
    priceMax: num("cena-do"),
    availableOnly: params.get("dostepne") === "1",
    sort: SORT_OPTIONS.some((o) => o.value === sort) ? (sort as SortKey) : "polecane",
  };
}

/** Parametry adresu dla filtrów (bez wartości narzuconych przez stronę, np. kategorii). */
export function paramsFromFilters(filters: CatalogFilters, locked: Partial<CatalogFilters> = {}): URLSearchParams {
  const params = new URLSearchParams();
  if (filters.q.trim()) params.set("q", filters.q.trim());
  if (!locked.categories?.length && filters.categories.length) params.set("kategoria", filters.categories.join(","));
  if (!locked.styles?.length && filters.styles.length) params.set("styl", filters.styles.join(","));
  if (filters.sizes.length) params.set("rozmiar", filters.sizes.join(","));
  if (filters.colors.length) params.set("kolor", filters.colors.join(","));
  if (filters.fits.length) params.set("kroj", filters.fits.join(","));
  if (filters.priceMin !== null) params.set("cena-od", String(filters.priceMin));
  if (filters.priceMax !== null) params.set("cena-do", String(filters.priceMax));
  if (filters.availableOnly) params.set("dostepne", "1");
  if (filters.sort !== "polecane") params.set("sort", filters.sort);
  return params;
}

/** Liczba aktywnych filtrów wybranych przez użytkownika (do przycisku „Wyczyść”). */
export function activeFilterCount(filters: CatalogFilters, locked: Partial<CatalogFilters> = {}): number {
  return (
    (filters.q.trim() ? 1 : 0) +
    (locked.categories?.length ? 0 : filters.categories.length) +
    (locked.styles?.length ? 0 : filters.styles.length) +
    filters.sizes.length +
    filters.colors.length +
    filters.fits.length +
    (filters.priceMin !== null ? 1 : 0) +
    (filters.priceMax !== null ? 1 : 0) +
    (filters.availableOnly ? 1 : 0)
  );
}

/** Kolory i kroje faktycznie występujące w danym zbiorze produktów (do budowy panelu filtrów). */
export function facetsFor(list: Product[]) {
  const colors = new Set<ColorId>();
  const fits = new Set<Fit>();
  for (const p of list) {
    fits.add(p.fit);
    for (const v of p.variants) colors.add(v.color);
  }
  const prices = list.map((p) => p.price / 100);
  return {
    colors: (Object.keys(COLORS) as ColorId[]).filter((c) => colors.has(c)),
    fits: FIT_KEYS.filter((f) => fits.has(f)),
    minPrice: prices.length ? Math.floor(Math.min(...prices)) : 0,
    maxPrice: prices.length ? Math.ceil(Math.max(...prices)) : 0,
  };
}
