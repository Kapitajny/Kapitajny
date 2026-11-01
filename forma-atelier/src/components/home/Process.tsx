"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import { useRef } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { processSteps } from "@/data/content";

/** Oś procesu: linia wypełnia się w rytmie przewijania, etapy pojawiają się kolejno. */
export function ProcessTimeline({ detailed = false }: { detailed?: boolean }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 55%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });

  return (
    <ol ref={ref} className="relative grid gap-y-14 pl-10 lg:grid-cols-5 lg:gap-x-8 lg:pt-16 lg:pl-0">
      {/* linia bazowa i wypełnienie: pionowo na telefonie, poziomo na desktopie */}
      <span aria-hidden="true" className="absolute top-2 bottom-2 left-[5px] w-px bg-line lg:top-[5px] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
      <motion.span
        aria-hidden="true"
        className="absolute top-2 bottom-2 left-[5px] w-px origin-top bg-graphite lg:hidden"
        style={{ scaleY: reduce ? 1 : progress }}
      />
      <motion.span
        aria-hidden="true"
        className="absolute top-[5px] right-0 left-0 hidden h-px origin-left bg-graphite lg:block"
        style={{ scaleX: reduce ? 1 : progress }}
      />
      {processSteps.map((s, i) => (
        <Reveal as="li" key={s.no} delay={i * 0.08} className="relative">
          <span
            aria-hidden="true"
            className="absolute top-1.5 -left-10 h-[11px] w-[11px] rounded-full border border-graphite bg-paper lg:-top-16 lg:left-0"
          />
          <p className="font-serif text-[2.75rem] leading-none text-olive">{s.no}</p>
          <h3 className="mt-5 font-serif text-[1.5rem] leading-tight">{s.title}</h3>
          <p className="t-body mt-4 text-[0.9375rem]">{s.text}</p>
          {detailed && <p className="t-meta mt-4 text-graphite">Czas: {s.time}</p>}
        </Reveal>
      ))}
    </ol>
  );
}

export function Process() {
  return (
    <section id="proces" aria-labelledby="proces-tytul" className="py-[var(--section)]">
      <div className="shell">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <Reveal className="col-span-12 md:col-span-6">
            <h2 id="proces-tytul" className="t-h2">
              Proces projektowy
            </h2>
          </Reveal>
          <Reveal delay={0.1} className="col-span-12 md:col-span-5 md:col-start-8">
            <p className="t-body">
              Pięć etapów, które prowadzą od pierwszej rozmowy do gotowego wnętrza. Na każdym z nich wiesz, co już zrobiliśmy i co
              wydarzy się dalej.
            </p>
          </Reveal>
        </div>
        <div className="mt-16 md:mt-24">
          <ProcessTimeline />
        </div>
      </div>
    </section>
  );
}
