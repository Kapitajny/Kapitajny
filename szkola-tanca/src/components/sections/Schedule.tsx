"use client";

import { useId } from "react";
import { useStudio } from "@/components/schedule/StudioProvider";
import { DemoBadge } from "@/components/ui/DemoBadge";
import { Clock } from "@/components/ui/Icons";
import { getInstructor, INSTRUCTORS } from "@/data/instructors";
import { LEVEL_IDS, LEVELS, type LevelId } from "@/data/levels";
import { DAYS, SCHEDULE, type DayId } from "@/data/schedule";
import { getStyle, STYLES } from "@/data/styles";
import { EMPTY_FILTERS, endTime, filterSchedule, groupByDay, hasActiveFilters, pluralizeSlots } from "@/lib/schedule";

/** Dni, w których są jakiekolwiek zajęcia – tylko one trafiają do filtrów. */
const ACTIVE_DAYS = DAYS.filter((day) => SCHEDULE.some((entry) => entry.day === day.id));

export function Schedule() {
  const { filters, setFilters, requestTrial } = useStudio();
  const ids = useId();
  const results = filterSchedule(SCHEDULE, filters);
  const groups = groupByDay(results);
  const active = hasActiveFilters(filters);

  return (
    <section id="grafik" aria-labelledby="grafik-title" className="section-y">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="grafik-title" className="h2 text-wine lg:col-span-7" tabIndex={-1} data-section-focus>
            Tydzień w studiu
          </h2>
          <div className="lg:col-span-5">
            <p className="prose-measure">
              Filtruj zajęcia według dnia, stylu, poziomu lub instruktora. Przy każdym terminie możesz od razu zapisać się na lekcję próbną.
            </p>
            <DemoBadge className="mt-5">Terminy przykładowe, grafik demonstracyjny</DemoBadge>
          </div>
        </div>

        <div className="mt-10 rounded-[1.75rem] bg-blush p-5 sm:p-7">
          <div role="group" aria-label="Dzień tygodnia" className="flex flex-wrap gap-2">
            <button type="button" className="chip" aria-pressed={filters.day === null} onClick={() => setFilters({ ...filters, day: null })}>
              Wszystkie dni
            </button>
            {ACTIVE_DAYS.map((day) => (
              <button
                key={day.id}
                type="button"
                className="chip"
                aria-pressed={filters.day === day.id}
                onClick={() => setFilters({ ...filters, day: filters.day === day.id ? null : (day.id as DayId) })}
              >
                <span aria-hidden="true">{day.short}</span>
                <span className="sr-only">{day.name}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-[repeat(3,minmax(0,1fr))_auto] lg:items-end">
            <div>
              <label htmlFor={`${ids}-style`} className="field-label">
                Styl
              </label>
              <select
                id={`${ids}-style`}
                className="field-input"
                value={filters.styleId ?? ""}
                onChange={(event) => setFilters({ ...filters, styleId: event.target.value || null })}
              >
                <option value="">Wszystkie style</option>
                {STYLES.map((style) => (
                  <option key={style.id} value={style.id}>
                    {style.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${ids}-level`} className="field-label">
                Poziom
              </label>
              <select
                id={`${ids}-level`}
                className="field-input"
                value={filters.level ?? ""}
                onChange={(event) => setFilters({ ...filters, level: (event.target.value || null) as LevelId | null })}
              >
                <option value="">Wszystkie poziomy</option>
                {LEVEL_IDS.map((level) => (
                  <option key={level} value={level}>
                    {LEVELS[level].label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${ids}-instructor`} className="field-label">
                Instruktor
              </label>
              <select
                id={`${ids}-instructor`}
                className="field-input"
                value={filters.instructorId ?? ""}
                onChange={(event) => setFilters({ ...filters, instructorId: event.target.value || null })}
              >
                <option value="">Wszyscy instruktorzy</option>
                {INSTRUCTORS.map((instructor) => (
                  <option key={instructor.id} value={instructor.id}>
                    {instructor.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="button" className="btn btn-secondary" onClick={() => setFilters(EMPTY_FILTERS)} disabled={!active}>
              Wyczyść filtry
            </button>
          </div>
        </div>

        <p className="mt-6 font-semibold" role="status" aria-live="polite">
          {results.length === 0 ? "Brak zajęć dla wybranych filtrów." : active ? `Pasujące do filtrów: ${pluralizeSlots(results.length)}.` : `Cały tydzień: ${pluralizeSlots(results.length)}.`}
        </p>

        {groups.length === 0 ? (
          <div className="mt-6 rounded-[1.75rem] border-2 border-dashed border-cocoa/25 px-6 py-12 text-center">
            <p className="h3">Żadne zajęcia nie pasują do tych filtrów</p>
            <p className="mx-auto mt-3 max-w-[46ch]">Spróbuj zmienić dzień lub poziom albo napisz do nas – pomożemy znaleźć grupę, która pasuje do Twojego planu.</p>
            <button type="button" className="btn btn-primary mt-6" onClick={() => setFilters(EMPTY_FILTERS)}>
              Pokaż cały grafik
            </button>
          </div>
        ) : (
          <div
            className="mt-5 grid gap-x-3 gap-y-8 lg:[grid-template-columns:repeat(var(--days),minmax(0,1fr))]"
            style={{ "--days": groups.length } as React.CSSProperties}
          >
            {groups.map(({ day, entries }) => (
              <div key={day.id}>
                <h3 className="h3 border-b-2 border-cocoa pb-2">{day.name}</h3>
                <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                  {entries.map((entry) => {
                    const style = getStyle(entry.styleId);
                    const instructor = getInstructor(entry.instructorId);
                    return (
                      <li key={entry.id} className="flex flex-col rounded-[1.25rem] bg-blush p-4">
                        <p className="text-2xl font-bold leading-none [font-stretch:80%]">
                          <time>{entry.start}</time>
                          <span className="ml-1.5 text-sm font-medium">do {endTime(entry.start, entry.duration)}</span>
                        </p>
                        <p className="mt-2 text-lg font-semibold leading-snug">{style?.name}</p>
                        <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
                          <span className="rounded-full bg-ivory px-2.5 py-0.5 font-semibold">{LEVELS[entry.level].label}</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock size={14} className="text-wine" />
                            {entry.duration} min
                          </span>
                        </p>
                        <p className="mt-2 text-sm">
                          <span className="sr-only">Prowadzi: </span>
                          {instructor?.name}
                        </p>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary mt-4 self-start"
                          onClick={() => requestTrial({ style: entry.styleId, level: entry.level, day: String(entry.day) })}
                        >
                          Zapisz się<span className="sr-only">: {style?.name}, {day.name.toLowerCase()} {entry.start}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
