"use client";

import { useRef, useState, type KeyboardEvent } from "react";
import { faq } from "@/data/content";
import { ContactLink, Arrow } from "@/components/ui/ContactLink";

export function Faq() {
  const [cat, setCat] = useState(0);
  const [open, setOpen] = useState<string | null>(`${faq[0].id}-0`);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const category = faq[cat];

  const select = (i: number, focus = false) => {
    setCat(i);
    setOpen(`${faq[i].id}-0`);
    if (focus) tabs.current[i]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const n = faq.length;
    const map: Record<string, number> = { ArrowRight: cat + 1, ArrowDown: cat + 1, ArrowLeft: cat - 1, ArrowUp: cat - 1, Home: 0, End: n - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    select((map[e.key] + n) % n, true);
  };

  return (
    <section id="faq" aria-labelledby="faq-tytul" className="section border-t border-rule bg-paper-2">
      <div className="container-plan grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="faq-tytul" className="t-h2">
            Pytania, które warto zadać przed współpracą
          </h2>
          <div
            role="tablist"
            aria-label="Kategorie pytań"
            className="relative -mx-[var(--gutter)] mt-8 flex gap-2 overflow-x-auto px-[var(--gutter)] pb-2 lg:mx-0 lg:flex-col lg:gap-0 lg:overflow-visible lg:border-t lg:border-rule lg:px-0"
          >
            {faq.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                role="tab"
                id={`faq-tab-${c.id}`}
                aria-selected={cat === i}
                aria-controls="faq-panel"
                tabIndex={cat === i ? 0 : -1}
                onClick={() => select(i)}
                onKeyDown={onKey}
                className={`flex min-h-11 shrink-0 items-center justify-between gap-4 rounded-full border px-4 text-[0.9375rem] font-[600] whitespace-nowrap transition-colors lg:min-h-13 lg:rounded-none lg:border-0 lg:border-b lg:border-rule lg:px-0 lg:text-[1.0625rem] ${
                  cat === i
                    ? "border-ink bg-ink text-paper lg:bg-transparent lg:text-ink"
                    : "border-field text-ink-2 hover:text-ink"
                }`}
              >
                {c.label}
                <span className={`hidden h-5 w-0.5 rounded-full bg-ink transition-opacity lg:block ${cat === i ? "opacity-100" : "opacity-0"}`} aria-hidden="true" />
              </button>
            ))}
          </div>
          <div className="mt-8 hidden lg:block">
            <p className="text-[0.9875rem] text-ink-2">Nie ma tu Twojego pytania?</p>
            <ContactLink className="btn btn-secondary btn-sm mt-3">
              Zapytaj nas <Arrow />
            </ContactLink>
          </div>
        </div>

        <div id="faq-panel" role="tabpanel" aria-labelledby={`faq-tab-${category.id}`} className="lg:col-span-7 lg:col-start-6">
          <ul key={category.id} className="faq-list border-t border-ink">
            {category.items.map((item, i) => {
              const id = `${category.id}-${i}`;
              const isOpen = open === id;
              return (
                <li key={id} className="border-b border-rule">
                  <h3>
                    <button
                      type="button"
                      id={`faq-q-${id}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-a-${id}`}
                      onClick={() => setOpen(isOpen ? null : id)}
                      className="flex min-h-16 w-full items-center justify-between gap-6 py-4 text-left text-[1.125rem] leading-snug font-[640] transition-colors hover:text-ink-2"
                    >
                      {item.q}
                      <span className="relative h-5 w-5 shrink-0" aria-hidden="true">
                        <span className="absolute top-1/2 left-0 h-0.5 w-5 -translate-y-1/2 rounded-full bg-ink" />
                        <span
                          className={`absolute top-1/2 left-0 h-0.5 w-5 -translate-y-1/2 rounded-full bg-ink transition-transform duration-300 ease-(--ease-out-expo) ${isOpen ? "rotate-0" : "rotate-90"}`}
                        />
                      </span>
                    </button>
                  </h3>
                  <div
                    id={`faq-a-${id}`}
                    role="region"
                    aria-labelledby={`faq-q-${id}`}
                    className={`grid transition-[grid-template-rows] duration-400 ease-(--ease-out-expo) motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                    inert={!isOpen}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-[62ch] pb-6 text-[1.0625rem] leading-relaxed text-ink-2">{item.a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 lg:hidden">
            <p className="text-[0.9875rem] text-ink-2">Nie ma tu Twojego pytania?</p>
            <ContactLink className="btn btn-secondary btn-sm mt-3">
              Zapytaj nas <Arrow />
            </ContactLink>
          </div>
        </div>
      </div>
    </section>
  );
}
