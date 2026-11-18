"use client";

import { useEffect, useRef, useState } from "react";
import { mission } from "@/data/content";

/**
 * Misja i wizja jako narracja przewijana: lewa kolumna trzyma tytuł i oś rozdziałów,
 * prawa rozwija kolejne akapity. Treść jest zawsze czytelna; aktywny rozdział tylko się wyostrza.
 */
export function Mission() {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section id="misja" aria-labelledby="misja-tytul" className="section border-t border-rule bg-paper-2">
      <div className="container-plan grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-[calc(var(--nav-h)+4rem)]">
            <h2 id="misja-tytul" className="t-h2 max-w-[14ch]">
              Reklama, którą da się rozliczyć.
            </h2>
            <p className="t-lead mt-5 max-w-[42ch]">
              Tak rozumiemy swoją pracę: najpierw cel i plan, potem budżet, na końcu liczby, które możesz sprawdzić.
            </p>
            <ol className="relative mt-10 hidden border-l border-rule lg:block" aria-label="Rozdziały">
              {mission.map((m, i) => (
                <li key={m.id}>
                  <a
                    href={`#misja-${m.id}`}
                    className={`relative -ml-px block border-l-2 py-2 pl-5 text-[0.9375rem] transition-colors duration-300 ${
                      active === i ? "border-ink font-[640] text-ink" : "border-transparent text-ink-3 hover:text-ink"
                    }`}
                  >
                    {m.title}
                  </a>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          {mission.map((m, i) => (
            <article
              key={m.id}
              id={`misja-${m.id}`}
              data-index={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              data-active={active === i}
              className="group scroll-mt-32 border-t border-rule py-10 first:border-t-0 first:pt-0 lg:flex lg:min-h-[48vh] lg:flex-col lg:justify-center lg:py-16 lg:first:pt-16"
            >
              <h3 className="t-h3 transition-colors duration-500 lg:text-ink-3 lg:group-data-[active=true]:text-ink">{m.title}</h3>
              <p className="mt-4 max-w-[52ch] text-[1.1875rem] leading-[1.6] text-ink-2 transition-colors duration-500 lg:text-ink-3 lg:group-data-[active=true]:text-ink-2">
                {m.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
