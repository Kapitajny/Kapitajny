"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { CONDITION_GROUPS } from "@/data/conditions";
import { getService } from "@/data/services";
import { selectService } from "@/lib/inquiry-store";

/**
 * „Z czym możesz przyjść” – wybór okolicy ciała (zakładki zgodne z wzorcem ARIA Tabs:
 * strzałki, Home/End). Okolice to rząd pigułek, pod nim jeden jasnozielony panel z opisem.
 */
export function Conditions() {
  const uid = useId();
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const group = CONDITION_GROUPS[active];

  // Bezpośrednie linki /#dolegliwosci-<okolica> (np. wysłane pacjentowi) otwierają właściwą zakładkę.
  // Przewijamy w następnej klatce, po obsłudze przewijania przez router.
  useEffect(() => {
    const openFromHash = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id.startsWith("dolegliwosci-")) return;
      const index = CONDITION_GROUPS.findIndex((g) => `dolegliwosci-${g.id}` === id);
      if (index < 0) return;
      setActive(index);
      requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView());
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

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
    <section id="dolegliwosci" aria-labelledby="dolegliwosci-title" className="content py-section">
      {/* Puste kotwice dla linków #dolegliwosci-<okolica> – bez JavaScriptu przewijają do tej sekcji. */}
      {CONDITION_GROUPS.map((g) => (
        <span key={g.id} id={`dolegliwosci-${g.id}`} aria-hidden="true" className="block" />
      ))}
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:items-end">
        <h2 id="dolegliwosci-title" className="text-h2">
          Z czym możesz przyjść?
        </h2>
        <p className="max-w-prose text-muted">Wybierz, co Ci dokucza. Czy i jaka terapia jest wskazana, ustalimy razem po ocenie na pierwszej wizycie.</p>
      </div>

      <div role="tablist" aria-label="Okolica ciała" className="mt-10 flex flex-wrap gap-2" onKeyDown={onKeyDown}>
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
              className={`min-h-11 rounded-pill border px-5 py-2 text-small font-semibold transition-colors ${
                selected ? "border-brand bg-brand text-white" : "border-[#8e978f] bg-white text-ink hover:border-brand hover:text-brand-deep"
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
        className="tab-panel-enter mt-4 grid gap-8 rounded-photo bg-mint p-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 md:p-10"
      >
        <div>
          <h3 className="text-h3">{group.label}</h3>
          <p className="mt-5 font-semibold text-ink">Pacjenci zgłaszają się m.in. z powodu:</p>
          <ul className="mt-3 space-y-2">
            {group.problems.map((problem) => (
              <li key={problem} className="flex gap-3">
                <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                <span>{problem}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col">
          <p className="font-semibold text-ink">Jak pracujemy</p>
          <p className="mt-3 text-ink">{group.approach}</p>
          <p className="mt-4 text-small text-muted">
            Zwykle pasuje:{" "}
            {group.services
              .map((slug) => getService(slug)?.title)
              .filter(Boolean)
              .join(", ")}
          </p>
          <div className="mt-auto pt-8">
            <Link href="/kontakt#formularz" onClick={() => group.services[0] && selectService(group.services[0])} className="btn btn-primary">
              Zapytaj o wizytę
            </Link>
          </div>
        </div>
        <p className="border-t border-mint-strong pt-5 text-small text-muted md:col-span-2">
          Przy nagłym, silnym bólu po urazie, gorączce albo utracie czucia lub siły najpierw skontaktuj się z lekarzem.
        </p>
      </div>
    </section>
  );
}
