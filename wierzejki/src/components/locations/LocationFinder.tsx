"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { allLocations, locationTypeLabels, retailStores, type LocationType, type SalesLocation } from "@/content/locations";
import { searchLocations, type LocationFilter } from "@/lib/locations-search";
import { PinIcon, SearchIcon } from "@/components/ui/Icons";
import { MapEmbed } from "./MapEmbed";

const regionLabels: Record<SalesLocation["region"], string> = { lubelskie: "Lubelskie", mazowieckie: "Mazowieckie" };

export function LocationFinder() {
  const [filter, setFilter] = useState<LocationFilter>({ query: "", type: "all", region: "all" });
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const results = useMemo(() => searchLocations(allLocations, filter), [filter]);
  const selected = results.find((l) => l.slug === selectedSlug) ?? results[0];
  const update = (patch: Partial<LocationFilter>) => setFilter((f) => ({ ...f, ...patch }));
  const searchingShops = filter.type === "sklep" && retailStores.length === 0;

  return (
    <div className="grid gap-10 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="space-y-5">
          <div>
            <label htmlFor="punkty-szukaj" className="field-label">
              Miejscowość lub ulica
            </label>
            <div className="relative">
              <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                id="punkty-szukaj"
                type="search"
                value={filter.query}
                onChange={(e) => update({ query: e.target.value })}
                placeholder="np. Siedlce"
                className="field-input pl-10"
                autoComplete="address-level2"
              />
            </div>
          </div>
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
              <select
                id="punkty-region"
                value={filter.region}
                onChange={(e) => update({ region: e.target.value as LocationFilter["region"] })}
                className="field-input"
              >
                <option value="all">Wszystkie</option>
                {Object.entries(regionLabels).map(([id, label]) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </form>

        <p className="ui mt-6 text-[0.875rem] text-muted" aria-live="polite">
          {results.length === 0 ? "Brak punktów dla wybranych filtrów." : `Znalezione punkty: ${results.length}`}
        </p>

        {results.length === 0 ? (
          <div className="mt-4 border border-dashed border-linen-deep bg-surface p-6">
            {searchingShops ? (
              <>
                <p className="display-sm">Lista sklepów firmowych jest w przygotowaniu</p>
                <p className="mt-2 text-[1rem] text-muted">
                  Adresy sklepów pojawią się tutaj po potwierdzeniu przez firmę. Do tego czasu o najbliższy sklep zapytaj w sekretariacie.
                </p>
              </>
            ) : (
              <>
                <p className="display-sm">Nie mamy punktu w tej okolicy</p>
                <p className="mt-2 text-[1rem] text-muted">Sprawdź pisownię albo wyczyść filtry. Odbiorcy hurtowi mogą też zamówić dostawę.</p>
              </>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setFilter({ query: "", type: "all", region: "all" })}>
                Wyczyść filtry
              </button>
              <Link href="/kontakt" className="btn btn-ink btn-sm">
                Kontakt
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-4 border-t border-line">
            {results.map((l) => {
              const active = l.slug === selected?.slug;
              return (
                <li key={l.slug} className="border-b border-line">
                  <div className={`flex items-start gap-4 py-4 ${active ? "bg-surface" : ""}`}>
                    <button
                      type="button"
                      onClick={() => setSelectedSlug(l.slug)}
                      aria-pressed={active}
                      className="flex flex-1 cursor-pointer items-start gap-3 px-2 text-left"
                    >
                      <PinIcon size={20} className={`mt-1 shrink-0 ${active ? "text-red" : "text-muted"}`} />
                      <span>
                        <span className="ui block text-[0.8125rem] font-semibold text-red">{locationTypeLabels[l.type]}</span>
                        <span className="display-sm block">{l.city}</span>
                        <span className="ui block text-[0.9375rem] text-muted">{l.street}</span>
                      </span>
                    </button>
                    <Link href={`/siec-sprzedazy/${l.slug}`} className="ui mr-2 self-center text-[0.875rem] font-semibold underline underline-offset-4 hover:text-red">
                      Szczegóły<span className="sr-only">: {l.name}</span>
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <div className="lg:col-span-7">
        {selected ? (
          <div className="lg:sticky lg:top-28">
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
