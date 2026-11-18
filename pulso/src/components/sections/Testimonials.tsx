"use client";

import { useState, type PointerEvent } from "react";
import { testimonials } from "@/data/content";

/**
 * Opinie klientów jako przestrzenne karty. Dopóki nie ma prawdziwych opinii, sekcja pokazuje
 * uczciwy pusty stan: przerywane (niezarezerwowane) karty, jak wstępne pozycje w planie.
 */
export function Testimonials() {
  const empty = testimonials.length === 0;

  return (
    <section id="opinie" aria-labelledby="opinie-tytul" className="section overflow-hidden">
      <div className="container-plan grid gap-12 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-5">
          <h2 id="opinie-tytul" className="t-h2 max-w-[14ch]">
            Opinie klientów
          </h2>
          {empty ? (
            <p className="t-lead mt-5 max-w-[44ch]">
              To miejsce czeka na pierwsze opinie klientów PULSO. Publikujemy wyłącznie prawdziwe wypowiedzi, za zgodą
              autorów, dlatego na razie zostawiamy je puste.
            </p>
          ) : (
            <p className="t-lead mt-5 max-w-[44ch]">Co mówią firmy, z którymi pracujemy.</p>
          )}
        </div>
        <div className="lg:col-span-7">{empty ? <EmptyStack /> : <Cards />}</div>
      </div>
    </section>
  );
}

function EmptyStack() {
  return (
    <div className="relative mx-auto h-[19rem] max-w-[34rem] [perspective:1400px] sm:h-[21rem]" aria-hidden="true">
      {[2, 1, 0].map((d) => (
        <div
          key={d}
          className="absolute inset-x-0 top-0 mx-auto h-[15rem] w-[86%] rounded-[10px] border-[1.5px] border-dashed border-field bg-sheet/70 p-6 sm:h-[17rem]"
          style={{ transform: `translateY(${d * 22}px) translateZ(${-d * 90}px) rotateX(8deg) rotateY(${-10 + d * 3}deg)`, zIndex: 3 - d }}
        >
          {d === 0 && (
            <div className="flex h-full flex-col justify-between">
              <span className="block space-y-2.5">
                <span className="block h-2.5 w-11/12 rounded-full bg-rule" />
                <span className="block h-2.5 w-10/12 rounded-full bg-rule" />
                <span className="block h-2.5 w-7/12 rounded-full bg-rule" />
              </span>
              <span className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full border-[1.5px] border-dashed border-field" />
                <span className="text-sm font-[600] text-ink-3">Miejsce na pierwszą opinię</span>
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function Cards() {
  const [tilt, setTilt] = useState<{ i: number; x: number; y: number } | null>(null);
  const onMove = (i: number) => (e: PointerEvent<HTMLElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce), (hover: none)").matches) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTilt({ i, x: -((e.clientY - r.top) / r.height - 0.5) * 6, y: ((e.clientX - r.left) / r.width - 0.5) * 8 });
  };
  return (
    <ul className="grid gap-6 [perspective:1400px] sm:grid-cols-2">
      {testimonials.map((t, i) => (
        <li
          key={`${t.author}-${i}`}
          onPointerMove={onMove(i)}
          onPointerLeave={() => setTilt(null)}
          className="rounded-[10px] border border-rule bg-sheet p-6 shadow-(--shadow-sheet) transition-transform duration-300 ease-(--ease-out-expo)"
          style={{ transform: tilt?.i === i ? `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` : undefined }}
        >
          <figure>
            <blockquote className="text-[1.0625rem] leading-relaxed">„{t.quote}”</blockquote>
            <figcaption className="mt-5 border-t border-rule pt-4 text-[0.9375rem]">
              <span className="block font-[660]">{t.author}</span>
              <span className="block text-ink-3">
                {t.company} · {t.industry}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
