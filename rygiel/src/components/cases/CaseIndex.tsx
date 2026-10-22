"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { caseAreas, caseSectors, filterCases, type CaseFilterState, type CaseStudy } from "@/content/cases";
import { TitleBlock } from "@/components/ui/TitleBlock";
import { caseTitleBlockRows } from "./case-meta";
import styles from "./CaseIndex.module.css";

const INITIAL: CaseFilterState = { area: "all", sector: "all" };

function resultLabel(count: number): string {
  if (count === 1) return "1 realizacja";
  const lastDigit = count % 10;
  const lastTwo = count % 100;
  if (lastDigit >= 2 && lastDigit <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} realizacje`;
  return `${count} realizacji`;
}

export function CaseIndex({ cases }: { cases: CaseStudy[] }) {
  const [filter, setFilter] = useState<CaseFilterState>(INITIAL);
  const statusId = useId();
  const visible = filterCases(cases, filter);
  const isFiltered = filter.area !== "all" || filter.sector !== "all";

  return (
    <div className={styles.root}>
      <div className={styles.filters}>
        <FilterGroup
          label="Obszar"
          options={caseAreas}
          value={filter.area}
          onChange={(area) => setFilter((current) => ({ ...current, area }))}
        />
        <FilterGroup
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
        {isFiltered ? (
          <button type="button" className={styles.reset} onClick={() => setFilter(INITIAL)}>
            Wyczyść filtry
          </button>
        ) : null}
      </div>

      {visible.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyTitle}>Brak realizacji dla tego połączenia filtrów.</p>
          <p className={styles.emptyText}>
            To nie znaczy, że nie pracujemy w tej branży – opisaliśmy dotąd tylko kilka przykładów. Zmień filtry albo opisz nam swoją sytuację.
          </p>
          <div className={styles.emptyActions}>
            <button type="button" className={styles.reset} onClick={() => setFilter(INITIAL)}>
              Pokaż wszystkie realizacje
            </button>
            <Link href="/kontakt" className="text-link">
              Napisz, czego potrzebujesz
            </Link>
          </div>
        </div>
      ) : (
        <ul role="list" className={styles.list}>
          {visible.map((study) => (
            <li key={study.slug} className={styles.item}>
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
                <TitleBlock rows={caseTitleBlockRows(study).filter((row) => row.label !== "Harmonogram")} label="Metryczka realizacji" />
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

type FilterGroupProps<K extends string> = {
  label: string;
  options: Record<K, string>;
  value: K | "all";
  onChange: (value: K | "all") => void;
};

function FilterGroup<K extends string>({ label, options, value, onChange }: FilterGroupProps<K>) {
  const entries = Object.entries(options) as [K, string][];
  return (
    <div className={styles.group} role="group" aria-label={`Filtr: ${label}`}>
      <span className={styles.groupLabel} aria-hidden="true">
        {label}
      </span>
      <div className={styles.chips}>
        <button type="button" className={styles.chip} aria-pressed={value === "all"} onClick={() => onChange("all")}>
          Wszystkie
        </button>
        {entries.map(([key, name]) => (
          <button key={key} type="button" className={styles.chip} aria-pressed={value === key} onClick={() => onChange(key)}>
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
