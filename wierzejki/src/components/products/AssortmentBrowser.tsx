"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { categories, channelLabels, productGroups, type CategoryId, type ProductGroup } from "@/content/products";
import { filterGroups, type GroupFilter } from "@/lib/catalog";
import { SearchIcon } from "@/components/ui/Icons";

const channelOptions = Object.entries(channelLabels) as [ProductGroup["channels"][number], string][];

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`ui inline-flex min-h-10 cursor-pointer items-center border px-3.5 text-[0.9rem] font-medium transition-colors ${
        active ? "border-ink bg-ink text-on-dark" : "border-linen-deep bg-surface text-ink hover:border-ink"
      }`}
    >
      {children}
    </button>
  );
}

export function AssortmentBrowser() {
  const [filter, setFilter] = useState<GroupFilter>({ category: "all", channel: "all", query: "" });
  const results = useMemo(() => filterGroups(productGroups, filter), [filter]);
  const update = (patch: Partial<GroupFilter>) => setFilter((f) => ({ ...f, ...patch }));
  const categoryName = (id: CategoryId) => categories.find((c) => c.id === id)!;

  return (
    <div>
      <div className="grid gap-6 border-y border-line py-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="space-y-4">
          <fieldset>
            <legend className="label mb-2 text-muted">Kategoria</legend>
            <div className="flex flex-wrap gap-2">
              <Chip active={filter.category === "all"} onClick={() => update({ category: "all" })}>
                Wszystkie
              </Chip>
              {categories.map((c) => (
                <Chip key={c.id} active={filter.category === c.id} onClick={() => update({ category: c.id })}>
                  {c.name}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="label mb-2 text-muted">Dla kogo</legend>
            <div className="flex flex-wrap gap-2">
              <Chip active={filter.channel === "all"} onClick={() => update({ channel: "all" })}>
                Wszyscy odbiorcy
              </Chip>
              {channelOptions.map(([id, label]) => (
                <Chip key={id} active={filter.channel === id} onClick={() => update({ channel: id })}>
                  {label}
                </Chip>
              ))}
            </div>
          </fieldset>
        </div>
        <div className="lg:w-80">
          <label htmlFor="asortyment-szukaj" className="field-label">
            Szukaj w asortymencie
          </label>
          <div className="relative">
            <SearchIcon size={18} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              id="asortyment-szukaj"
              type="search"
              value={filter.query}
              onChange={(e) => update({ query: e.target.value })}
              placeholder="np. pierogi, kiełbasa, schab"
              className="field-input pl-10"
              autoComplete="off"
            />
          </div>
        </div>
      </div>

      <p className="ui mt-5 text-[0.875rem] text-muted" aria-live="polite">
        {results.length === 0 ? "Brak grup pasujących do filtrów." : `Grupy asortymentowe: ${results.length}`}
      </p>

      {results.length === 0 ? (
        <div className="mt-6 border border-dashed border-linen-deep bg-surface p-8">
          <p className="display-sm">Nie znaleźliśmy takiej grupy produktów</p>
          <p className="mt-2 max-w-[36rem] text-muted">
            Spróbuj innej nazwy lub wyczyść filtry. Pełną listę wyrobów zawierają katalogi PDF przy każdej kategorii.
          </p>
          <button type="button" onClick={() => setFilter({ category: "all", channel: "all", query: "" })} className="btn btn-outline mt-5">
            Wyczyść filtry
          </button>
        </div>
      ) : (
        <ul className="mt-6 grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
          {results.map((g) => {
            const category = categoryName(g.category);
            return (
              <li key={g.id} className="flex flex-col bg-paper p-6">
                <Link href={`/produkty/${category.slug}`} className="ui text-[0.8125rem] font-semibold text-red hover:underline">
                  {category.name}
                </Link>
                <h3 className="display-sm mt-2">{g.name}</h3>
                <p className="mt-2 text-[1rem] text-muted">{g.description}</p>
                {g.examples.length > 0 && <p className="ui mt-4 text-[0.875rem]">Np.: {g.examples.join(", ")}</p>}
                <p className="ui mt-auto pt-4 text-[0.8125rem] text-muted">{g.channels.map((c) => channelLabels[c]).join(" / ")}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
