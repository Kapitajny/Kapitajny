"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  allLocations,
  locationTypeLabels,
  regionLabels,
  verificationLabels,
  type LocationType,
  type Region,
  type SalesLocation,
} from "@/content/locations";
import { EMPTY_FILTER, citySummary, groupByCity, isFilterActive, pluralPl, searchLocations, type LocationFilter } from "@/lib/locations-search";
import { PinIcon, SearchIcon } from "@/components/ui/Icons";
import { MapEmbed } from "./MapEmbed";

const cities = citySummary(allLocations);

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`ui inline-flex min-h-10 shrink-0 cursor-pointer items-center gap-1.5 border px-3 text-[0.875rem] font-medium transition-colors ${
        active ? "border-ink bg-ink text-on-dark" : "border-linen-deep bg-surface text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

function VerificationBadge({ location }: { location: SalesLocation }) {
  const v = location.verification;
  const tone = v === "katalog" ? "border-linen-deep text-muted" : "border-green/40 text-green";
  return (
    <span className={`ui inline-flex items-center border px-1.5 py-0.5 text-[0.75rem] font-medium leading-tight ${tone}`} title={verificationLabels[v].long}>
      {verificationLabels[v].short}
    </span>
  );
}

export function LocationFinder() {
  const [filter, setFilter] = useState<LocationFilter>(EMPTY_FILTER);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const results = useMemo(() => searchLocations(allLocations, filter), [filter]);
  const groups = useMemo(() => groupByCity(results), [results]);
  const selected = results.find((l) => l.slug === selectedSlug) ?? results[0];
  const update = (patch: Partial<LocationFilter>) => setFilter((f) => ({ ...f, ...patch }));
  const active = isFilterActive(filter);

  const showOnMap = (slug: string) => {
    setSelectedSlug(slug);
    // Na telefonie mapa jest pod listą – przewijamy do niej po wyborze punktu.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() => mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }));
    }
  };

  const wholesaleCount = results.filter((l) => l.type === "hurtownia").length;
  const shopCount = results.length - wholesaleCount;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-5">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label htmlFor="punkty-szukaj" className="field-label">
              Miejscowość, ulica lub kod pocztowy
            </label>
            <div className="relative">
              <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="punkty-szukaj"
                type="search"
                value={filter.query}
                onChange={(e) => update({ query: e.target.value })}
                placeholder="np. Siedlce, Marszałkowska, 03-361"
                className="field-input pl-10"
                autoComplete="off"
              />
            </div>
          </div>

          <fieldset>
            <legend className="field-label">Miejscowość</legend>
            <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 sm:flex-wrap sm:overflow-visible">
              <Chip active={filter.city === "all"} onClick={() => update({ city: "all" })}>
                Wszystkie
              </Chip>
              {cities.map((c) => (
                <Chip key={c.city} active={filter.city === c.city} onClick={() => update({ city: filter.city === c.city ? "all" : c.city })}>
                  {c.city}
                  <span className="tabular-nums opacity-70">{c.count}</span>
                </Chip>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="punkty-typ" className="field-label">
                Rodzaj punktu
              </label>
              <select id="punkty-typ" value={filter.type} onChange={(e) => update({ type: e.target.value as LocationType | "all" })} className="field-input">
                <option value="all">Wszystkie</option>
                {(Object.keys(locationTypeLabels) as LocationType[]).map((t) => (
                  <option key={t} value={t}>
                    {locationTypeLabels[t]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="punkty-region" className="field-label">
                Województwo
              </label>
              <select id="punkty-region" value={filter.region} onChange={(e) => update({ region: e.target.value as Region | "all" })} className="field-input">
                <option value="all">Wszystkie</option>
                {(Object.keys(regionLabels) as Region[]).map((r) => (
                  <option key={r} value={r}>
                    {regionLabels[r]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <div className="ui mt-6 flex flex-wrap items-center justify-between gap-3 text-[0.875rem]">
          <p className="text-muted" aria-live="polite">
            {results.length === 0
              ? "Brak punktów dla wybranych filtrów."
              : `${results.length} ${pluralPl(results.length, "punkt", "punkty", "punktów")}: ${wholesaleCount} ${pluralPl(wholesaleCount, "hurtownia", "hurtownie", "hurtowni")}, ${shopCount} ${pluralPl(shopCount, "sklep", "sklepy", "sklepów")}`}
          </p>
          {active && (
            <button type="button" onClick={() => setFilter(EMPTY_FILTER)} className="link cursor-pointer font-semibold">
              Wyczyść filtry
            </button>
          )}
        </div>

        {results.length === 0 ? (
          <div className="mt-4 border border-dashed border-linen-deep bg-surface p-6">
            <p className="display-sm">Nie mamy punktu w tej okolicy</p>
            <p className="mt-2 text-[1rem] text-muted">
              Sprawdź pisownię albo wyczyść filtry. Odbiorcy hurtowi mogą zamówić dostawę na terenie województw lubelskiego i mazowieckiego.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setFilter(EMPTY_FILTER)}>
                Wyczyść filtry
              </button>
              <Link href="/kontakt" className="btn btn-ink btn-sm">
                Kontakt
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-4 border-t border-line lg:max-h-[46rem] lg:overflow-y-auto lg:pr-2">
            {groups.map((group) => (
              <section key={group.city} aria-labelledby={`miasto-${group.city}`}>
                <h2 id={`miasto-${group.city}`} className="label sticky top-0 z-[1] flex items-baseline justify-between bg-paper py-2.5 text-muted">
                  {group.city}
                  <span className="tabular-nums">{group.items.length}</span>
                </h2>
                <ul>
                  {group.items.map((l) => {
                    const isSelected = l.slug === selected?.slug;
                    return (
                      <li key={l.slug} className={`border-b border-line ${isSelected ? "bg-surface" : ""}`}>
                        <div className="flex items-start gap-3 px-2 py-4">
                          <PinIcon size={20} className={`mt-1 shrink-0 ${isSelected ? "text-red" : "text-muted"}`} />
                          <div className="min-w-0 flex-1">
                            <p className="ui flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.8125rem] font-semibold text-red">
                              {locationTypeLabels[l.type]}
                              {l.storeNumber && <span className="font-normal text-muted">{l.storeNumber}</span>}
                            </p>
                            <p className="display-sm mt-0.5 text-[1.2rem]">{l.street}</p>
                            <p className="ui text-[0.875rem] text-muted">
                              {l.postalCode ? `${l.postalCode} ` : ""}
                              {l.city}
                            </p>
                            <div className="mt-2">
                              <VerificationBadge location={l} />
                            </div>
                            <div className="ui mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[0.875rem] font-semibold">
                              <button
                                type="button"
                                onClick={() => showOnMap(l.slug)}
                                aria-pressed={isSelected}
                                className="cursor-pointer underline decoration-1 underline-offset-4 hover:text-red"
                              >
                                {isSelected ? "Na mapie" : "Pokaż na mapie"}
                              </button>
                              <Link href={`/siec-sprzedazy/${l.slug}`} className="underline decoration-1 underline-offset-4 hover:text-red">
                                Szczegóły<span className="sr-only">: {l.name}, {l.street}</span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>

      <div ref={mapRef} className="scroll-mt-28 lg:col-span-7">
        {selected ? (
          <div className="lg:sticky lg:top-28">
            <p className="ui mb-3 text-[0.9375rem]">
              <span className="font-semibold">{selected.name}</span>
              <span className="text-muted">, {selected.street}</span>
            </p>
            <MapEmbed query={selected.mapsQuery} label={selected.name} />
          </div>
        ) : (
          <div className="photo-slot flex aspect-[16/10] items-center justify-center p-6">
            <p className="ui bg-surface px-4 py-3 text-[0.9375rem]">Wybierz punkt z listy, aby zobaczyć go na mapie.</p>
          </div>
        )}
      </div>
    </div>
  );
}
