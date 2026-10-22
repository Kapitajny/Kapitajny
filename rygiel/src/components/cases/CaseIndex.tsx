"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { caseAreas, caseSectors, filterCases, type CaseFilterState } from "@/content/taxonomy";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { caseTitleBlockRows, type CaseSummary } from "./case-meta";
import styles from "./CaseIndex.module.css";

const INITIAL: CaseFilterState = { area: "all", sector: "all" };

function resultLabel(count: number): string {
  if (count === 1) return "1 realizacja";
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} realizacje`;
  return `${count} realizacji`;
}

export function CaseIndex({ cases }: { cases: CaseSummary[] }) {
  const [filter, setFilter] = useState<CaseFilterState>(INITIAL);
  const statusId = useId();
  const visible = filterCases(cases, filter);
  const isFiltered = filter.area !== "all" || filter.sector !== "all";

  return (
    // Wszystkie elementy są w DOM, a filtr tylko je ukrywa – dzięki temu statyczna wersja strony może filtrować bez Reacta.
    <div className={styles.root} data-case-index="">
      <div className={styles.filters}>
        <FilterGroup
          filterKey="area"
          label="Obszar"
          options={caseAreas}
          value={filter.area}
          onChange={(area) => setFilter((current) => ({ ...current, area }))}
        />
        <FilterGroup
          filterKey="sector"
          label="Branża"
          options={caseSectors}
          value={filter.sector}
          onChange={(sector) => setFilter((current) => ({ ...current, sector }))}
        />
      </div>

      <div className={styles.status}>
        <p id={statusId} role="status" aria-live="polite">
          {isFiltered ? `Pasujące: ${resultLabel(visible.length)} z ${cases.length}` : `Wszystkie realizacje: ${cases.length}`}
        </p>
        <button type="button" className={styles.reset} onClick={() => setFilter(INITIAL)} hidden={!isFiltered} data-filter-reset="">
          Wyczyść filtry
        </button>
      </div>

      <div className={styles.empty} hidden={visible.length > 0} data-filter-empty="">
        <p className={styles.emptyTitle}>Brak realizacji dla tego połączenia filtrów.</p>
        <p className={styles.emptyText}>
          To nie znaczy, że nie pracujemy w&nbsp;tej branży – opisaliśmy dotąd tylko kilka przykładów. Zmień filtry albo opisz nam swoją sytuację.
        </p>
        <div className={styles.emptyActions}>
          <button type="button" className={styles.reset} onClick={() => setFilter(INITIAL)} data-filter-reset="">
            Pokaż wszystkie realizacje
          </button>
          <Link href="/kontakt" className="text-link">
            Napisz, czego potrzebujesz
          </Link>
        </div>
      </div>

      <ul role="list" className={styles.list} hidden={visible.length === 0}>
        {cases.map((study) => (
          <li key={study.slug} className={styles.item} hidden={!visible.includes(study)} data-area={study.area} data-sector={study.sector}>
            <article className={styles.article} aria-labelledby={`case-${study.slug}`}>
              <div className={styles.copy}>
                <h2 id={`case-${study.slug}`} className={styles.title}>
                  <Link href={`/realizacje/${study.slug}`} className={styles.titleLink}>
                    {study.title}
                  </Link>
                </h2>
                <p className={styles.summary}>{study.summary}</p>
                <p className={styles.more} aria-hidden="true">
                  Czytaj studium przypadku
                </p>
              </div>
              <TitleBlock rows={caseTitleBlockRows(study)} label="Metryczka realizacji" />
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}

type FilterGroupProps<K extends string> = {
  filterKey: string;
  label: string;
  options: Record<K, string>;
  value: K | "all";
  onChange: (value: K | "all") => void;
};

function FilterGroup<K extends string>({ filterKey, label, options, value, onChange }: FilterGroupProps<K>) {
  const entries = Object.entries(options) as [K, string][];
  return (
    <div className={styles.group} role="group" aria-label={`Filtr: ${label}`} data-filter-key={filterKey}>
      <span className={styles.groupLabel} aria-hidden="true">
        {label}
      </span>
      <div className={styles.chips}>
        <button type="button" className={styles.chip} aria-pressed={value === "all"} onClick={() => onChange("all")} data-value="all">
          Wszystkie
        </button>
        {entries.map(([key, name]) => (
          <button key={key} type="button" className={styles.chip} aria-pressed={value === key} onClick={() => onChange(key)} data-value={key}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
