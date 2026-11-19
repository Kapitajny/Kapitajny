"use client";

import { useEffect, useRef, useState } from "react";
import { processSteps } from "@/data/content";
import { scrollToElement } from "@/lib/contact-intent";

const WEEKS = 9;

/**
 * Proces jako przypięty harmonogram: na dużych ekranach przewijanie przesuwa playhead przez sześć
 * etapów, a panel pod osią pokazuje aktywny etap. Na telefonach i przy ograniczonym ruchu ten sam
 * harmonogram jest statyczny, a etapy są wypisane jeden pod drugim.
 */
export function Process() {
  const wrap = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
    const update = () => setPinned(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Zabezpieczenie: jeśli po przypięciu adres wskazuje sekcję poniżej, przewiń do niej jeszcze raz.
  const rescrolled = useRef(false);
  useEffect(() => {
    if (!pinned || rescrolled.current) return;
    rescrolled.current = true;
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    const section = wrap.current;
    if (target && section && section.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING) {
      scrollToElement(target, "auto");
    }
  }, [pinned]);

  useEffect(() => {
    if (!pinned) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : 0);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pinned]);

  // Playhead w tygodniach: od początku pierwszego etapu do środka ostatniego.
  const playWeek = 1 + progress * (WEEKS - 1.5);
  let activeIndex = 0;
  processSteps.forEach((s, i) => {
    if (playWeek >= s.start) activeIndex = i;
  });
  if (!pinned) activeIndex = -1;
  const active = activeIndex >= 0 ? processSteps[activeIndex] : null;

  const pct = (w: number) => `${((w - 1) / WEEKS) * 100}%`;

  const gantt = (
    <ol className="relative" aria-label="Etapy współpracy">
      {processSteps.map((s, i) => {
        const isActive = i === activeIndex;
        const done = pinned && i < activeIndex;
        return (
          <li key={s.id} className="grid grid-cols-1 items-center gap-x-6 border-t border-rule py-2 md:grid-cols-[17rem_1fr] md:py-0">
            <span className={`flex min-h-12 items-center gap-3 text-[0.9875rem] font-[620] transition-colors duration-300 ${pinned && !isActive ? "text-ink-3" : "text-ink"}`}>
              <span className="tnum w-5 text-ink-3">{i + 1}</span>
              {s.title}
            </span>
            <span className="sr-only">
              {s.description} Efekt: {s.deliverable}.
            </span>
            <span className="week-grid relative block h-8 md:h-12" style={{ "--weeks": WEEKS } as React.CSSProperties} aria-hidden="true">
              <span className="absolute inset-y-2 md:inset-y-3" style={{ left: pct(s.start), width: `${(s.span / WEEKS) * 100}%` }}>
                <span
                  className="flight block transition-[background-color,border-color] duration-300"
                  data-state={!pinned || isActive || done ? "booked" : "tentative"}
                  style={{ "--flight-color": isActive || !pinned ? "var(--color-ink)" : "var(--color-ink-3)", "--flight-line": "var(--color-field)" } as React.CSSProperties}
                />
              </span>
              {s.ongoing && (
                <span className="absolute inset-y-0 right-0 hidden items-center pr-1 text-xs font-[600] whitespace-nowrap text-ink-3 md:flex" style={{ left: `calc(${pct(s.start + s.span)} + 0.5rem)` }}>
                  i dalej, co miesiąc
                </span>
              )}
            </span>
          </li>
        );
      })}
      {pinned && (
        <li aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 left-[calc(17rem+1.5rem)]">
          <span className="absolute -top-2 bottom-0 w-0.5 rounded-full bg-ink" style={{ left: pct(playWeek) }}>
            <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-ink" />
          </span>
        </li>
      )}
    </ol>
  );

  return (
    <section id="proces" aria-labelledby="proces-tytul" className="border-t border-rule bg-paper-2">
      {/* Wysokość i przypięcie są w CSS (.process-track/.process-stage), żeby układ nie zmieniał się po hydratacji. */}
      <div ref={wrap} className="process-track">
        <div className="process-stage section">
          <div className="container-plan">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="proces-tytul" className="t-h2 max-w-[16ch]">
                Sześć kroków od rozmowy do raportu.
              </h2>
              <p className="max-w-[38ch] text-[0.9875rem] text-ink-2">
                Orientacyjny harmonogram. Dokładne tempo zależy od zakresu, dostępu do kont i materiałów.
              </p>
            </div>

            <div className="mt-10 rounded-[10px] border border-rule bg-sheet p-4 shadow-(--shadow-sheet) sm:p-6">
              <div className="hidden grid-cols-[17rem_1fr] gap-x-6 md:grid" aria-hidden="true">
                <span className="t-col pb-2">Etap</span>
                <span className="grid pb-2" style={{ gridTemplateColumns: `repeat(${WEEKS}, minmax(0, 1fr))` }}>
                  {Array.from({ length: WEEKS }, (_, i) => (
                    <span key={i} className="t-col tnum">
                      T{i + 1}
                    </span>
                  ))}
                </span>
              </div>
              {gantt}
            </div>

            {pinned ? (
              <div className="mt-6 grid min-h-[8.5rem] gap-6 md:grid-cols-[17rem_1fr]" aria-hidden="true">
                <span className="t-col pt-1">Aktywny etap</span>
                {active && (
                  <div key={active.id} className="process-detail">
                    <p className="t-h3">{active.title}</p>
                    <p className="mt-2 max-w-[60ch] text-[1.0625rem] text-ink-2">{active.description}</p>
                    <p className="mt-3 text-[0.9375rem]">
                      <span className="font-[660]">Efekt: </span>
                      <span className="text-ink-2">{active.deliverable}</span>
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <ol className="process-static-list mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3" aria-label="Opis etapów">
                {processSteps.map((s, i) => (
                  <li key={s.id} className="border-t border-ink pt-4">
                    <h3 className="t-h3">
                      <span className="tnum mr-2 text-ink-3">{i + 1}.</span>
                      {s.title}
                    </h3>
                    <p className="mt-2 text-[0.9875rem] leading-relaxed text-ink-2">{s.description}</p>
                    <p className="mt-3 text-[0.9375rem]">
                      <span className="font-[660]">Efekt: </span>
                      <span className="text-ink-2">{s.deliverable}</span>
                    </p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
