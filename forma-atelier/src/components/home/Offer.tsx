"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Link from "next/link";
import { useId, useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { services } from "@/data/content";

const ease = [0.22, 1, 0.36, 1] as const;

export function OfferList({ initial = 0 }: { initial?: number | null }) {
  const [open, setOpen] = useState<number | null>(initial);
  const reduce = useReducedMotion();
  const base = useId();

  return (
    <ul className="border-t border-line">
      {services.map((s, i) => {
        const isOpen = open === i;
        const panelId = `${base}-panel-${i}`;
        const btnId = `${base}-btn-${i}`;
        return (
          <li key={s.slug} className="border-b border-line">
            <h3>
              <button
                id={btnId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group grid w-full grid-cols-[1fr_auto] items-start gap-x-6 gap-y-3 py-8 text-left md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:py-10"
              >
                <span className="t-h3 transition-colors duration-500 group-hover:text-olive md:col-start-1 md:row-start-1">{s.title}</span>
                <span className="t-body col-span-2 row-start-2 max-w-[30rem] font-sans md:col-span-1 md:col-start-2 md:row-start-1 md:pt-1.5">{s.summary}</span>
                <span
                  aria-hidden="true"
                  className="relative col-start-2 row-start-1 mt-3 block h-4 w-4 md:col-start-3"
                >
                  <span className="absolute top-1/2 left-0 h-px w-4 bg-current" />
                  <span
                    className={`absolute top-0 left-1/2 h-4 w-px bg-current transition-transform duration-500 ease-[var(--ease-out-soft)] ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.7, ease }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-x-6 gap-y-8 pb-12 md:grid-cols-2">
                    <div className="md:col-start-2">
                      <p className="text-[1.0625rem] leading-relaxed text-graphite">{s.description}</p>
                      <ul className="t-body mt-6 space-y-2">
                        {s.includes.map((x) => (
                          <li key={x} className="flex gap-3">
                            <span aria-hidden="true" className="mt-[0.8em] h-px w-3 shrink-0 bg-olive" />
                            {x}
                          </li>
                        ))}
                      </ul>
                      <p className="t-meta mt-6 text-stone">{s.forWhom}</p>
                      <Link href={`/kontakt?zakres=${s.slug}`} className="btn btn-dark mt-8">
                        Zapytaj o wycenę
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}

export function Offer() {
  return (
    <section id="oferta" aria-labelledby="oferta-tytul" className="bg-beige py-[var(--section)]">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-14">
        <div className="col-span-12 lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <Reveal>
              <h2 id="oferta-tytul" className="t-h2">
                Oferta
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="t-body mt-8 max-w-[24rem]">
                Cztery sposoby współpracy, od jednej konsultacji po wnętrze oddane pod klucz. Każdą wycenę przygotowujemy
                indywidualnie, po rozmowie i obejrzeniu przestrzeni.
              </p>
            </Reveal>
          </div>
        </div>
        <Reveal className="col-span-12 lg:col-span-8">
          <OfferList />
        </Reveal>
      </div>
    </section>
  );
}
