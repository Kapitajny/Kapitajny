"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { categories, COLORS, FITS, SIZES, type CategorySlug, type Product, type Size } from "@/data/catalog";
import {
  activeFilterCount,
  catalogStock,
  facetsFor,
  filtersFromParams,
  filterProducts,
  getCategory,
  paramsFromFilters,
  SORT_OPTIONS,
  type CatalogFilters,
  type SortKey,
} from "@/lib/catalog";
import { plural } from "@/lib/format";
import { useAllStock } from "@/components/shop/useLiveStock";
import { Modal } from "@/components/ui/Modal";
import { CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/Icons";
import { ProductCard } from "./ProductCard";

export const PAGE_SIZE = 12;

export interface CatalogScope {
  /** Kategoria narzucona przez stronę (np. /kategoria/bluzy). */
  category?: CategorySlug;
  /** Podkategoria narzucona przez stronę (np. /kategoria/spodnie/cargo). */
  style?: string;
}

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * Lista produktów z filtrami zapisanymi w adresie strony – link z filtrami można skopiować,
 * a przycisk „wstecz” przywraca poprzedni wybór.
 */
export function CatalogView({ products, scope = {}, searchMode = false }: { products: Product[]; scope?: CatalogScope; searchMode?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const stock = useAllStock();
  const locked = useMemo<Partial<CatalogFilters>>(
    () => ({ ...(scope.category ? { categories: [scope.category] } : {}), ...(scope.style ? { styles: [scope.style] } : {}) }),
    [scope.category, scope.style],
  );
  const paramsKey = searchParams.toString();
  const filters = useMemo(() => filtersFromParams(new URLSearchParams(paramsKey), locked), [paramsKey, locked]);
  const [visible, setVisible] = useState({ key: paramsKey, count: PAGE_SIZE });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const visibleCount = visible.key === paramsKey ? visible.count : PAGE_SIZE;

  const stockLookup = (product: Product, color: string, size: Size) => stock?.[product.id]?.[color]?.[size] ?? catalogStock(product, color, size);
  const results = filterProducts(products, filters, stockLookup);
  const facets = facetsFor(products);
  const activeCount = activeFilterCount(filters, locked);

  const update = (next: CatalogFilters) => {
    const query = paramsFromFilters(next, locked).toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };
  const clear = () => update({ ...filtersFromParams(new URLSearchParams(), locked), q: searchMode ? filters.q : "", sort: filters.sort });

  const panel = <FilterPanel filters={filters} facets={facets} update={update} scope={scope} />;

  return (
    <div>
      {!searchMode && <SearchWithin value={filters.q} onSearch={(q) => update({ ...filters, q })} />}

      <div className="sticky top-16 z-20 -mx-4 flex items-center justify-between gap-3 border-y border-line bg-ink px-4 py-3 md:top-[4.5rem] md:-mx-8 md:px-8 xl:-mx-12 xl:px-12">
        <p className="text-sm text-muted" aria-live="polite">
          <span className="font-semibold text-paper tabular-nums">{results.length}</span> {plural(results.length, "produkt", "produkty", "produktów")}
        </p>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <button type="button" className="hidden text-sm underline underline-offset-2 hover:text-paper md:inline" onClick={clear}>
              Wyczyść filtry ({activeCount})
            </button>
          )}
          <label htmlFor="catalog-sort" className="sr-only">
            Sortuj
          </label>
          <select id="catalog-sort" className="field !min-h-10 !w-auto max-w-[10.5rem] !py-1.5 text-sm sm:max-w-none" value={filters.sort} onChange={(e) => update({ ...filters, sort: e.target.value as SortKey })}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <button type="button" className="btn btn-outline !min-h-10 !px-3 lg:hidden" onClick={() => setFiltersOpen(true)} aria-haspopup="dialog">
            <FilterIcon size={18} />
            <span className="sr-only sm:not-sr-only">Filtry</span>
            {activeCount > 0 ? <span className="tabular-nums">({activeCount})</span> : null}
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[15rem_1fr] xl:grid-cols-[16.5rem_1fr]">
        <aside aria-label="Filtry" className="hidden lg:block">
          <div className="sticky top-36 max-h-[calc(100dvh-10rem)] overflow-y-auto pb-8 pr-2">{panel}</div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="border border-line px-6 py-16 text-center">
              <p className="display text-3xl md:text-4xl">Nic tu nie ma</p>
              <p className="mx-auto mt-3 max-w-md text-muted">
                {filters.q ? `Żaden produkt nie pasuje do „${filters.q}” przy wybranych filtrach.` : "Żaden produkt nie spełnia wszystkich wybranych filtrów."} Usuń część filtrów albo wyczyść wszystkie.
              </p>
              {activeCount > 0 && (
                <button type="button" className="btn btn-light mt-6" onClick={clear}>
                  Wyczyść filtry
                </button>
              )}
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5">
                {results.slice(0, visibleCount).map((product, i) => (
                  <li key={product.id}>
                    <ProductCard
                      key={filters.colors.join(",")}
                      product={product}
                      availability={stock?.[product.id]}
                      priority={i < 3}
                      initialColor={filters.colors.find((c) => product.variants.some((v) => v.color === c))}
                      sizes="(min-width: 1024px) 26vw, (min-width: 768px) 33vw, 50vw"
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-12 flex flex-col items-center gap-4">
                <p className="text-sm text-muted">
                  Wyświetlono {Math.min(visibleCount, results.length)} z {results.length}
                </p>
                {visibleCount < results.length && (
                  <button type="button" className="btn btn-outline" onClick={() => setVisible({ key: paramsKey, count: visibleCount + PAGE_SIZE })}>
                    Pokaż więcej
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      <Modal open={filtersOpen} onClose={() => setFiltersOpen(false)} labelledBy="filters-title" className="drawer">
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-5">
            <h2 id="filters-title" className="display-sm text-lg">
              Filtry
            </h2>
            <button type="button" className="icon-btn -mr-2" aria-label="Zamknij filtry" onClick={() => setFiltersOpen(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-5 py-2">{panel}</div>
          <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-line p-5">
            <button type="button" className="btn btn-outline" onClick={clear} disabled={activeCount === 0}>
              Wyczyść
            </button>
            <button type="button" className="btn btn-light" onClick={() => setFiltersOpen(false)}>
              Pokaż ({results.length})
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function SearchWithin({ value, onSearch }: { value: string; onSearch: (q: string) => void }) {
  const [draft, setDraft] = useState({ source: value, text: value });
  const text = draft.source === value ? draft.text : value;

  // Szukanie podczas pisania z krótkim opóźnieniem.
  useEffect(() => {
    if (text === value) return;
    const timer = window.setTimeout(() => onSearch(text), 350);
    return () => window.clearTimeout(timer);
  }, [text, value, onSearch]);

  return (
    <form role="search" className="mb-6 max-w-md" onSubmit={(e) => (e.preventDefault(), onSearch(text))}>
      <label htmlFor="catalog-q" className="sr-only">
        Szukaj w tej kategorii
      </label>
      <div className="relative">
        <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
        <input
          id="catalog-q"
          type="search"
          className="field !pl-10"
          placeholder="Szukaj w tej kategorii"
          value={text}
          maxLength={80}
          onChange={(e) => setDraft({ source: value, text: e.target.value })}
        />
      </div>
    </form>
  );
}

function FilterGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0">
      <legend className="float-left mb-3 w-full text-sm font-bold">{title}</legend>
      <div className="clear-left">{children}</div>
    </fieldset>
  );
}

function FilterPanel({
  filters,
  facets,
  update,
  scope,
}: {
  filters: CatalogFilters;
  facets: ReturnType<typeof facetsFor>;
  update: (next: CatalogFilters) => void;
  scope: CatalogScope;
}) {
  const id = useId();
  const styleCategory = scope.category ?? (filters.categories.length === 1 ? filters.categories[0] : undefined);
  const styleOptions = styleCategory && !scope.style ? getCategory(styleCategory)!.subcategories : [];

  return (
    <div>
      {!scope.category && (
        <FilterGroup title="Kategoria">
          <ul className="space-y-2">
            {categories.map((c) => (
              <li key={c.slug}>
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    className="check"
                    checked={filters.categories.includes(c.slug)}
                    onChange={() => update({ ...filters, categories: toggle(filters.categories, c.slug), styles: [] })}
                  />
                  {c.name}
                </label>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      {styleOptions.length > 0 && (
        <FilterGroup title="Rodzaj">
          <ul className="space-y-2">
            {styleOptions.map((s) => (
              <li key={s.slug}>
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <input type="checkbox" className="check" checked={filters.styles.includes(s.slug)} onChange={() => update({ ...filters, styles: toggle(filters.styles, s.slug) })} />
                  {s.name}
                </label>
              </li>
            ))}
          </ul>
        </FilterGroup>
      )}

      <FilterGroup title="Rozmiar">
        <div className="grid grid-cols-3 gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              type="button"
              aria-pressed={filters.sizes.includes(size)}
              onClick={() => update({ ...filters, sizes: toggle(filters.sizes, size) })}
              className="h-10 border border-line text-sm font-semibold hover:border-paper aria-pressed:border-paper aria-pressed:bg-paper aria-pressed:text-ink"
            >
              {size}
            </button>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup title="Kolor">
        <ul className="grid grid-cols-2 gap-x-2 gap-y-1">
          {facets.colors.map((c) => (
            <li key={c}>
              <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm">
                <input type="checkbox" className="peer sr-only" checked={filters.colors.includes(c)} onChange={() => update({ ...filters, colors: toggle(filters.colors, c) })} />
                <span
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-full border border-transparent peer-checked:border-paper peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-paper"
                  aria-hidden="true"
                >
                  <span className="h-4 w-4 rounded-full border border-white/25" style={{ background: COLORS[c].hex }} />
                </span>
                <span className="text-muted peer-checked:font-semibold peer-checked:text-paper">{COLORS[c].name}</span>
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Krój">
        <ul className="space-y-2">
          {facets.fits.map((f) => (
            <li key={f}>
              <label className="flex cursor-pointer items-start gap-3 text-sm">
                <input type="checkbox" className="check" checked={filters.fits.includes(f)} onChange={() => update({ ...filters, fits: toggle(filters.fits, f) })} />
                {FITS[f].name}
              </label>
            </li>
          ))}
        </ul>
      </FilterGroup>

      <FilterGroup title="Cena (zł)">
        <PriceRange key={`${filters.priceMin}-${filters.priceMax}`} id={id} filters={filters} facets={facets} update={update} />
      </FilterGroup>

      <div className="py-5">
        <label className="flex cursor-pointer items-start gap-3 text-sm">
          <input type="checkbox" className="check" checked={filters.availableOnly} onChange={() => update({ ...filters, availableOnly: !filters.availableOnly })} />
          Tylko dostępne od ręki
        </label>
      </div>
    </div>
  );
}

function PriceRange({ id, filters, facets, update }: { id: string; filters: CatalogFilters; facets: ReturnType<typeof facetsFor>; update: (next: CatalogFilters) => void }) {
  const [min, setMin] = useState(filters.priceMin?.toString() ?? "");
  const [max, setMax] = useState(filters.priceMax?.toString() ?? "");
  const parse = (v: string) => (v.trim() === "" || !Number.isFinite(Number(v)) ? null : Math.max(0, Math.round(Number(v))));
  const apply = () => {
    let lo = parse(min);
    let hi = parse(max);
    if (lo !== null && hi !== null && lo > hi) [lo, hi] = [hi, lo];
    if (lo !== filters.priceMin || hi !== filters.priceMax) update({ ...filters, priceMin: lo, priceMax: hi });
  };
  return (
    <form
      className="grid grid-cols-[1fr_auto_1fr] items-end gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
    >
      <div>
        <label htmlFor={`${id}-min`} className="mb-1 block text-xs text-muted">
          Od
        </label>
        <input id={`${id}-min`} className="field !min-h-10 !py-1.5 text-sm" inputMode="numeric" placeholder={String(facets.minPrice)} value={min} onChange={(e) => setMin(e.target.value.replace(/[^\d]/g, ""))} onBlur={apply} />
      </div>
      <span className="pb-2.5 text-muted" aria-hidden="true">
        –
      </span>
      <div>
        <label htmlFor={`${id}-max`} className="mb-1 block text-xs text-muted">
          Do
        </label>
        <input id={`${id}-max`} className="field !min-h-10 !py-1.5 text-sm" inputMode="numeric" placeholder={String(facets.maxPrice)} value={max} onChange={(e) => setMax(e.target.value.replace(/[^\d]/g, ""))} onBlur={apply} />
      </div>
      <button type="submit" className="sr-only">
        Zastosuj cenę
      </button>
    </form>
  );
}

/** Statyczna lista dla pierwszego renderu (bez filtrów) – widoczna dla robotów i przed wczytaniem skryptów. */
export function CatalogFallback({ products }: { products: Product[] }) {
  return (
    <ul className="mt-8 grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 lg:ml-[17.5rem] xl:ml-[19rem]">
      {products.slice(0, PAGE_SIZE).map((product, i) => (
        <li key={product.id}>
          <ProductCard product={product} priority={i < 3} sizes="(min-width: 1024px) 26vw, (min-width: 768px) 33vw, 50vw" />
        </li>
      ))}
    </ul>
  );
}
