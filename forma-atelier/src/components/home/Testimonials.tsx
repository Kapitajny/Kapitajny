"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";

import { Reveal } from "@/components/ui/Reveal";
import { testimonials } from "@/data/content";

const ease = [0.22, 1, 0.36, 1] as const;

export function Testimonials() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const reduce = useReducedMotion();
  const t = testimonials[i];
  const go = (d: number) => {
    setDir(d);
    setI((v) => (v + d + testimonials.length) % testimonials.length);
  };

  return (
    <section aria-labelledby="opinie" className="py-[var(--section)]">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-12">
        <Reveal className="col-span-12 lg:col-span-3">
          <h2 id="opinie" className="t-h3">
            Opinie klientów
          </h2>
          <p className="t-meta mt-4 max-w-[16rem] text-stone">
            Opinie przykładowe, przygotowane na potrzeby projektu demonstracyjnego. Nie są to wypowiedzi rzeczywistych klientów.
          </p>
        </Reveal>

        <div className="col-span-12 lg:col-span-8 lg:col-start-5">
          <figure className="relative min-h-[19rem] sm:min-h-[16rem]" aria-live="polite">
            <AnimatePresence mode="wait" initial={false} custom={dir}>
              <motion.div
                key={i}
                custom={dir}
                initial={{ opacity: 0, x: reduce ? 0 : 24 * dir }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: reduce ? 0 : -24 * dir }}
                transition={{ duration: 0.6, ease }}
              >
                <blockquote className="t-statement max-w-[30ch]">
                  <p>„{t.quote}”</p>
                </blockquote>
                <figcaption className="t-meta mt-8 text-stone">{t.context} (opinia przykładowa)</figcaption>
              </motion.div>
            </AnimatePresence>
          </figure>

          <div className="mt-12 flex items-center gap-6">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Poprzednia opinia"
              className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors duration-500 hover:border-graphite hover:bg-graphite hover:text-paper"
            >
              <ArrowLeft size={16} strokeWidth={1.25} aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Następna opinia"
              className="grid h-12 w-12 place-items-center rounded-full border border-line transition-colors duration-500 hover:border-graphite hover:bg-graphite hover:text-paper"
            >
              <ArrowRight size={16} strokeWidth={1.25} aria-hidden="true" />
            </button>
            <p className="t-meta text-stone" aria-hidden="true">
              {i + 1} / {testimonials.length}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
