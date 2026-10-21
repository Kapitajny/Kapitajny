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
    <section id="grafik" aria-labelledby="grafik-title" className="section-y bg-blush">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <p className="eyebrow">Grafik zajęć</p>
            <h2 id="grafik-title" className="h2 mt-5 text-wine" tabIndex={-1} data-section-focus>
              Wybierz termin, który pasuje do Twojego tygodnia
            </h2>
          </div>
          <div className="lg:col-span-5">
            <p className="prose-measure">
              Filtruj zajęcia według dnia, stylu, poziomu lub instruktora. Przy każdym terminie możesz od razu zapisać się na lekcję próbną.
            </p>
            <DemoBadge className="mt-5">Terminy przykładowe – grafik demonstracyjny</DemoBadge>
          </div>
        </div>

        <div className="mt-12 border-y border-cocoa/20 py-6">
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

        <p className="mt-6 text-sm font-semibold" role="status" aria-live="polite">
          {results.length === 0 ? "Brak zajęć dla wybranych filtrów." : active ? `Pasujące do filtrów: ${pluralizeSlots(results.length)}.` : `Cały tydzień: ${pluralizeSlots(results.length)}.`}
        </p>

        {groups.length === 0 ? (
          <div className="mt-6 border border-dashed border-cocoa/30 px-6 py-12 text-center">
            <p className="font-serif text-3xl">Nic tu jeszcze nie ma</p>
            <p className="mx-auto mt-3 max-w-[46ch]">Spróbuj zmienić dzień lub poziom albo napisz do nas – pomożemy znaleźć grupę, która pasuje do Twojego planu.</p>
            <button type="button" className="btn btn-primary mt-6" onClick={() => setFilters(EMPTY_FILTERS)}>
              Pokaż cały grafik
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-10">
            {groups.map(({ day, entries }) => (
              <div key={day.id} className="grid gap-3 lg:grid-cols-[11rem_1fr] lg:gap-8">
                <h3 className="font-serif text-3xl lg:pt-5">{day.name}</h3>
                <ul className="divide-y divide-cocoa/15 border-y border-cocoa/15">
                  {entries.map((entry) => {
                    const style = getStyle(entry.styleId);
                    const instructor = getInstructor(entry.instructorId);
                    return (
                      <li
                        key={entry.id}
                        className="grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-2 py-5 md:grid-cols-[6.5rem_minmax(0,1.4fr)_minmax(0,1fr)_auto] md:items-center md:gap-x-6"
                      >
                        <p className="font-serif text-2xl leading-none md:text-[1.7rem]">
                          <time>{entry.start}</time>
                          <span className="mt-1 block font-sans text-xs font-medium">do {endTime(entry.start, entry.duration)}</span>
                        </p>
                        <div>
                          <p className="text-lg font-semibold leading-snug">{style?.name}</p>
                          <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                            <span className="rounded-full bg-ivory px-2.5 py-0.5 font-semibold">{LEVELS[entry.level].label}</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock size={14} className="text-wine" />
                              {entry.duration} min
                            </span>
                          </p>
                        </div>
                        <p className="col-start-2 text-sm md:col-start-auto md:text-base">
                          <span className="sr-only">Prowadzi: </span>
                          {instructor?.name}
                        </p>
                        <button
                          type="button"
                          className="btn btn-sm btn-secondary col-start-2 justify-self-start md:col-start-auto"
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
