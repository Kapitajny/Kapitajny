"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { FAQ, type FaqItem } from "@/config/faq";
import { CloseIcon, PlusIcon } from "@/components/ui/Icons";
import { SectionMark } from "@/components/ui/SectionMark";

/** Zamienia fragmenty [[…]] na wyraźnie oznaczone miejsca do uzupełnienia przez studio. */
function renderAnswer(text: string): ReactNode[] {
  return text.split(/(\[\[[^\]]+\]\])/g).map((part, i) =>
    part.startsWith("[[") ? (
      <span key={i} className="todo">
        Do uzupełnienia przez studio: {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function normalize(value: string): string {
  return value.toLocaleLowerCase("pl").normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function Question({ item, id, open, onToggle }: { item: FaqItem; id: string; open: boolean; onToggle: () => void }) {
  return (
    <li className="border-b border-sumi/15">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="font-mincho text-lg leading-snug sm:text-xl">{item.q}</span>
          <PlusIcon
            className={`mt-1 h-5 w-5 shrink-0 transition-transform duration-500 ease-[var(--ease-ink)] ${open ? "rotate-45" : "group-hover:rotate-90"}`}
          />
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-ink)] motion-reduce:transition-none ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="max-w-[40rem] space-y-3 pb-7 font-gothic text-sm leading-[1.8] text-nezumi">
            {item.a.map((paragraph, i) => (
              <p key={i}>{renderAnswer(paragraph)}</p>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export function Faq() {
  const [category, setCategory] = useState(FAQ[0].id);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (!q) return null;
    return FAQ.flatMap((cat) =>
      cat.items
        .map((item, index) => ({ item, key: `${cat.id}-${index}`, category: cat.label }))
        .filter(({ item }) => normalize(`${item.q} ${item.a.join(" ")}`).includes(q)),
    );
  }, [query]);

  const current = FAQ.find((c) => c.id === category)!;

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % FAQ.length;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + FAQ.length) % FAQ.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = FAQ.length - 1;
    else return;
    event.preventDefault();
    setCategory(FAQ[next].id);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="page-x relative py-24 sm:py-32">
      <div className="grid gap-10 lg:grid-cols-12">
        <SectionMark kanji="質問" reading="shitsumon" className="hidden lg:col-span-1 lg:flex" />
        <div className="lg:col-span-3">
          <h2 id="faq-title" className="display display-lg">
            FAQ
          </h2>
          <p className="mt-5 max-w-[22rem] font-mincho text-lg leading-relaxed text-nezumi">
            Odpowiedzi na pytania, które padają najczęściej przed pierwszą wizytą.
          </p>

          <div className="relative mt-10">
            <label htmlFor="faq-search" className="font-gothic text-xs text-nezumi">
              Szukaj w pytaniach
            </label>
            <div className="relative mt-2">
              <input
                id="faq-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="np. zadatek, pielęgnacja"
                className="h-12 w-full rounded-[2px] border border-sumi/25 bg-transparent px-4 pr-11 font-gothic text-sm placeholder:text-nezumi/70 focus:border-sumi focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-search-cancel-button]:hidden"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Wyczyść wyszukiwanie"
                  className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Kategorie pytań"
            aria-orientation="vertical"
            className={`mt-8 hidden flex-col lg:flex ${results ? "lg:opacity-40" : ""}`}
          >
            {FAQ.map((cat, index) => {
              const selected = cat.id === category;
              return (
                <button
                  key={cat.id}
                  ref={(el) => {
                    tabRefs.current[index] = el;
                  }}
                  role="tab"
                  id={`faq-tab-${cat.id}`}
                  aria-selected={selected}
                  aria-controls="faq-panel"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => {
                    setCategory(cat.id);
                    setQuery("");
                  }}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`flex items-center justify-between border-l py-2.5 pl-4 text-left font-gothic text-sm transition-colors duration-300 ${
                    selected ? "border-sumi text-sumi" : "border-sumi/15 text-nezumi hover:border-sumi/50 hover:text-sumi"
                  }`}
                >
                  {cat.label}
                  <span className="tabular-nums text-xs text-nezumi">{cat.items.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          {/* Na telefonach kategorie jako przewijany pasek. */}
          <div className="-mx-4 mb-6 overflow-x-auto px-4 lg:hidden">
            <div className="flex gap-2" role="group" aria-label="Kategorie pytań">
              {FAQ.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={!results && cat.id === category}
                  onClick={() => {
                    setCategory(cat.id);
                    setQuery("");
                  }}
                  className={`min-h-11 shrink-0 rounded-[2px] border px-3.5 font-gothic text-xs ${
                    !results && cat.id === category ? "border-sumi bg-sumi text-washi" : "border-sumi/20"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {results ? (
            <div>
              <p className="font-gothic text-sm text-nezumi" aria-live="polite">
                {results.length === 0 ? "Brak pytań pasujących do wyszukiwania. Spróbuj innego słowa." : `Wyniki wyszukiwania: ${results.length}`}
              </p>
              <ul className="mt-4 border-t border-sumi/15">
                {results.map(({ item, key }) => (
                  <Question key={key} id={`faq-${key}`} item={item} open={open === key} onToggle={() => setOpen(open === key ? null : key)} />
                ))}
              </ul>
            </div>
          ) : (
            <div id="faq-panel" role="tabpanel" aria-labelledby={`faq-tab-${current.id}`}>
              <p className="font-mincho text-2xl">{current.label}</p>
              <ul className="mt-6 border-t border-sumi/15">
                {current.items.map((item, index) => {
                  const key = `${current.id}-${index}`;
                  return (
                    <Question key={key} id={`faq-${key}`} item={item} open={open === key} onToggle={() => setOpen(open === key ? null : key)} />
                  );
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
