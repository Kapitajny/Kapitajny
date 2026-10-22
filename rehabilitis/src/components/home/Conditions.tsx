"use client";

import { useId, useRef, useState } from "react";
import { CONDITION_GROUPS } from "@/data/conditions";
import { getService } from "@/data/services";
import { selectService } from "@/lib/inquiry-store";

/**
 * „Z czym możesz przyjść” – wybór okolicy ciała (zakładki zgodne z wzorcem ARIA Tabs:
 * strzałki, Home/End). Na telefonach zakładki układają się w zawijane przyciski.
 */
export function Conditions() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = CONDITION_GROUPS[active];

  const focusTab = (index: number) => {
    const next = (index + CONDITION_GROUPS.length) % CONDITION_GROUPS.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: active + 1, ArrowRight: active + 1, ArrowUp: active - 1, ArrowLeft: active - 1, Home: 0, End: -1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    focusTab(event.key === "End" ? CONDITION_GROUPS.length - 1 : keys[event.key]);
  };

  return (
    <section id="dolegliwosci" aria-labelledby="dolegliwosci-title" className="section-y">
      <div className="container-x">
        <h2 id="dolegliwosci-title" className="h2">
          Z czym możesz przyjść?
        </h2>
        <p className="section-intro">Wybierz, co Ci dokucza. O tym, czy i jaka terapia jest wskazana, decydujemy wspólnie po ocenie na pierwszej wizycie.</p>

        <div className="mt-10 grid gap-6 lg:grid-cols-[17rem_1fr] lg:gap-10">
          <div role="tablist" aria-label="Okolica ciała" aria-orientation="vertical" className="flex flex-wrap gap-2 lg:flex-col lg:gap-1" onKeyDown={onKeyDown}>
            {CONDITION_GROUPS.map((g, i) => {
              const selected = i === active;
              return (
                <button
                  key={g.id}
                  ref={(node) => {
                    tabs.current[i] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`${uid}-tab-${g.id}`}
                  aria-selected={selected}
                  aria-controls={`${uid}-panel`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(i)}
                  className={`min-h-11 rounded-md border px-4 py-2 text-left font-medium transition-colors lg:border-0 lg:border-l-[3px] lg:rounded-none lg:px-4 lg:py-3 ${
                    selected
                      ? "border-forest bg-forest text-white lg:bg-sage lg:text-forest"
                      : "border-line bg-white text-graphite hover:border-forest/50 lg:border-transparent lg:bg-transparent lg:hover:bg-sage/50"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

          <div
            key={group.id}
            role="tabpanel"
            id={`${uid}-panel`}
            aria-labelledby={`${uid}-tab-${group.id}`}
            tabIndex={0}
            className="tab-panel-enter rounded-lg border border-line bg-white p-6 sm:p-8"
          >
            <h3 className="text-2xl">{group.label}</h3>
            <div className="mt-5 grid gap-8 md:grid-cols-2">
              <div>
                <p className="font-semibold text-ink">Pacjenci zgłaszają się m.in. z powodu:</p>
                <ul className="mt-3 space-y-2">
                  {group.problems.map((problem) => (
                    <li key={problem} className="flex gap-3">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest" />
                      <span>{problem}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-semibold text-ink">Jak pracujemy</p>
                <p className="mt-3 text-graphite">{group.approach}</p>
                <p className="mt-4 text-sm text-muted">
                  Zwykle pasuje:{" "}
                  {group.services
                    .map((slug) => getService(slug)?.title)
                    .filter(Boolean)
                    .join(", ")}
                </p>
              </div>
            </div>
            <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted">Nagły, silny ból po urazie, gorączka albo utrata czucia lub siły? Najpierw skontaktuj się z lekarzem.</p>
              <a href="#kontakt" onClick={() => group.services[0] && selectService(group.services[0])} className="btn btn-primary shrink-0">
                Zapytaj o wizytę
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
