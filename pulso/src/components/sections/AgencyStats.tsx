"use client";

import { useEffect, useRef, useState } from "react";
import { agencyStats } from "@/config/site";

/**
 * Statystyki agencji. Ukryte, dopóki w konfiguracji nie ma prawdziwych liczb (`agencyStats.enabled`).
 * Liczniki animują się raz, po wejściu w widok; przy ograniczonym ruchu pokazują od razu wartość końcową.
 */
export function AgencyStats() {
  const ref = useRef<HTMLDListElement>(null);
  const [progress, setProgress] = useState(1);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setProgress(0);
    let raf = 0;
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min(1, (now - t0) / 1400);
        setProgress(1 - Math.pow(1 - p, 4));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  if (!agencyStats.enabled || agencyStats.items.length === 0) return null;

  return (
    <section aria-labelledby="liczby-tytul" className="section border-t border-rule">
      <div className="container-plan">
        <h2 id="liczby-tytul" className="t-h2 max-w-[18ch]">
          PULSO w liczbach
        </h2>
        <dl ref={ref} className="mt-12 grid border-t border-ink sm:grid-cols-2 lg:grid-cols-4">
          {agencyStats.items.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-2 border-b border-rule py-6 sm:pr-6">
              <dt className="text-[0.9875rem] text-ink-2">{s.label}</dt>
              <dd className="tnum text-[clamp(2.5rem,2rem+2vw,4rem)] leading-none font-[760]" style={{ fontVariationSettings: '"wdth" 112' }}>
                {Math.round(s.value * progress)}
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
        {agencyStats.note && <p className="mt-4 text-sm text-ink-3">{agencyStats.note}</p>}
      </div>
    </section>
  );
}
