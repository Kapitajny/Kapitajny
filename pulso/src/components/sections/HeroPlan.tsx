"use client";

import { useState } from "react";
import { formatPrice, packageForPlatformCount, priceSuffix, currency } from "@/config/pricing";
import { serviceById, type ServiceId } from "@/data/services";
import { channelStyle } from "@/lib/channels";
import { ContactLink, Arrow } from "@/components/ui/ContactLink";
import { PlatformIcon } from "@/components/ui/PlatformIcon";

const WEEKS = 12;
/** Ilustracyjny plan: [tydzień startu, liczba tygodni]. */
const plan: Record<ServiceId, [number, number]> = {
  google: [1, 12],
  meta: [3, 10],
  youtube: [5, 5],
  tiktok: [8, 5],
};
const order: ServiceId[] = ["google", "meta", "youtube", "tiktok"];
const PLAYHEAD_WEEK = 4.5;

export function HeroPlan() {
  const [booked, setBooked] = useState<ServiceId[]>(["google", "meta"]);
  const toggle = (id: ServiceId) =>
    setBooked((b) => (b.includes(id) ? b.filter((x) => x !== id) : order.filter((x) => x === id || b.includes(x))));
  const pkg = booked.length ? packageForPlatformCount(booked.length) : null;
  const names = booked.map((id) => serviceById(id)!.channel);

  return (
    <figure className="rounded-[10px] border border-rule bg-sheet shadow-(--shadow-sheet)" aria-labelledby="plan-tytul">
      <figcaption className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-rule px-4 py-3 sm:px-5">
        <span id="plan-tytul" className="text-[0.9375rem] font-[640]">
          Przykładowy plan kampanii, 12 tygodni
        </span>
        <span className="text-sm text-ink-3">Kliknij kanał, żeby dodać go do planu lub usunąć</span>
      </figcaption>

      <div className="relative px-4 pt-2 pb-1 sm:px-5" style={{ "--weeks": WEEKS } as React.CSSProperties}>
        {/* Nagłówek tygodni */}
        <div className="grid grid-cols-[6.5rem_1fr] gap-3 sm:grid-cols-[11rem_1fr]" aria-hidden="true">
          <span className="t-col self-end pb-1.5">Kanał</span>
          <div className="grid" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
            {Array.from({ length: WEEKS }, (_, i) => (
              <span key={i} className={`t-col tnum min-w-0 overflow-hidden pb-1.5 pl-1 ${i % 2 ? "max-sm:invisible" : ""}`}>
                T{i + 1}
              </span>
            ))}
          </div>
        </div>

        <ul className="relative" aria-label="Kanały w planie">
          {order.map((id, i) => {
            const s = serviceById(id)!;
            const on = booked.includes(id);
            const [start, span] = plan[id];
            return (
              <li key={id} className="border-t border-rule">
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(id)}
                  className="group grid min-h-14 w-full grid-cols-[6.5rem_1fr] items-center gap-3 rounded-md text-left transition-colors hover:bg-paper/70 sm:grid-cols-[11rem_1fr]"
                  aria-label={`${s.name}: ${on ? "w planie, kliknij, aby usunąć" : "do rozważenia, kliknij, aby dodać"}`}
                >
                  <span className="flex items-center gap-2.5 pl-1">
                    <PlatformIcon id={id} className="h-[18px] w-[18px] shrink-0 text-ink" />
                    <span className="flex flex-col leading-tight">
                      <span className="text-[0.9375rem] font-[620]">{s.channel}</span>
                      <span className="text-xs text-ink-3 max-sm:hidden">{on ? "w planie" : "do rozważenia"}</span>
                    </span>
                  </span>
                  <span className="week-grid relative block h-14 py-3.5">
                    <span
                      className="absolute top-3.5 bottom-3.5 block"
                      style={{ left: `${((start - 1) / WEEKS) * 100}%`, width: `${(span / WEEKS) * 100}%` }}
                    >
                      <span
                        className="flight hero-flight block transition-[background-color,border-color] duration-200"
                        data-state={on ? "booked" : "tentative"}
                        style={{ ...channelStyle(id), animationDelay: `${200 + i * 140}ms` }}
                      />
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
          <li className="grid min-h-11 grid-cols-[6.5rem_1fr] items-center gap-3 border-t border-rule sm:grid-cols-[11rem_1fr]">
            <span className="pl-1 text-[0.9375rem] font-[620]">
              Raport<span className="sr-only"> co 4 tygodnie</span>
            </span>
            <span className="week-grid relative block h-11" aria-hidden="true">
              {[4, 8, 12].map((w) => (
                <span
                  key={w}
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 rounded-[2px] bg-ink"
                  style={{ left: `${(w / WEEKS) * 100 - 100 / WEEKS / 2}%` }}
                  aria-hidden="true"
                />
              ))}
            </span>
          </li>
          {/* Playhead: „dziś” w planie */}
          <li aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-[calc(6.5rem+0.75rem)] right-0 sm:left-[calc(11rem+0.75rem)]">
            <span className="hero-playhead absolute -top-1 bottom-0 w-0.5 rounded-full bg-ink" style={{ left: `${(PLAYHEAD_WEEK / WEEKS) * 100}%` }}>
              <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-ink" />
            </span>
          </li>
        </ul>
      </div>

      <div className="flex flex-col gap-3 border-t border-rule bg-paper/60 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:px-5" aria-live="polite">
        <p className="text-[0.9375rem] leading-snug">
          {pkg ? (
            <>
              <span className="font-[640]">W planie: {names.join(", ")}.</span>{" "}
              <span className="text-ink-2">
                Pakiet {pkg.name}: <span className="tnum">{formatPrice(pkg.priceNet)}</span> {currency} {priceSuffix}, budżet reklamowy osobno.
              </span>
            </>
          ) : (
            <span className="text-ink-2">Plan jest pusty. Zaznacz kanał albo zapytaj, od czego zacząć.</span>
          )}
        </p>
        <ContactLink className="btn btn-secondary btn-sm shrink-0" services={booked.length ? booked : undefined}>
          {booked.length ? "Omówmy ten plan" : "Doradźcie mi"} <Arrow />
        </ContactLink>
      </div>
    </figure>
  );
}
