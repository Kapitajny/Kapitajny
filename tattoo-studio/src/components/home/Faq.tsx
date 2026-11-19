"use client";

import { useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { CloseIcon, PlusIcon } from "@/components/ui/Icons";
import { SectionHeader } from "@/components/ui/SectionHeader";

/** Zamienia fragmenty [[…]] na wyraźnie oznaczone miejsca do uzupełnienia przez studio. */
export function renderWithTodos(text: string, todoPrefix: string): ReactNode[] {
  return text.split(/(\[\[[^\]]+\]\])/g).map((part, i) =>
    part.startsWith("[[") ? (
      <span key={i} className="todo">
        {todoPrefix} {part.slice(2, -2)}
      </span>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function normalize(value: string, locale: string): string {
  return value.toLocaleLowerCase(locale).normalize("NFD").replace(/\p{Diacritic}/gu, "");
}

function Question({ q, a, id, open, onToggle }: { q: string; a: string[]; id: string; open: boolean; onToggle: () => void }) {
  const { t } = useI18n();
  return (
    <li className="border-b border-sumi/12">
      <h3>
        <button
          type="button"
          id={`${id}-q`}
          aria-expanded={open}
          aria-controls={`${id}-a`}
          onClick={onToggle}
          className="group flex w-full items-start justify-between gap-6 py-6 text-left"
        >
          <span className="font-mincho text-lg leading-snug sm:text-xl">{q}</span>
          <span
            aria-hidden="true"
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
              open ? "border-sumi bg-sumi text-washi" : "border-sumi/20 group-hover:border-sumi"
            }`}
          >
            <PlusIcon className={`h-4 w-4 transition-transform duration-500 ease-[var(--ease-ink)] ${open ? "rotate-45" : ""}`} />
          </span>
        </button>
      </h3>
      <div
        id={`${id}-a`}
        role="region"
        aria-labelledby={`${id}-q`}
        className={`grid transition-[grid-template-rows] duration-500 ease-[var(--ease-ink)] motion-reduce:transition-none ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
      >
        <div className="overflow-hidden" inert={!open}>
          <div className="max-w-[40rem] space-y-3 pb-7 pr-12 font-gothic text-base leading-[1.8] text-nezumi">
            {a.map((paragraph, i) => (
              <p key={i}>{renderWithTodos(paragraph, t.common.todoBy)}</p>
            ))}
          </div>
        </div>
      </div>
    </li>
  );
}

export function Faq() {
  const { t, lang } = useI18n();
  const f = t.faq;
  const [category, setCategory] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const results = useMemo(() => {
    const q = normalize(query.trim(), lang);
    if (!q) return null;
    return f.categories.flatMap((cat) =>
      cat.items.map((item, index) => ({ item, key: `${cat.id}-${index}` })).filter(({ item }) => normalize(`${item.q} ${item.a.join(" ")}`, lang).includes(q)),
    );
  }, [query, f.categories, lang]);

  const current = f.categories[category];

  function selectCategory(index: number) {
    setCategory(index);
    setQuery("");
  }

  function onTabKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const count = f.categories.length;
    let next = index;
    if (event.key === "ArrowRight" || event.key === "ArrowDown") next = (index + 1) % count;
    else if (event.key === "ArrowLeft" || event.key === "ArrowUp") next = (index - 1 + count) % count;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = count - 1;
    else return;
    event.preventDefault();
    selectCategory(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <section id="faq" aria-labelledby="faq-title" className="page-x relative py-24 sm:py-32">
      <SectionHeader id="faq-title" kanji="質問" reading="shitsumon" title={f.title} lead={<p>{f.lead}</p>} />

      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <div className="min-w-0 lg:col-span-4">
          <label htmlFor="faq-search" className="font-gothic text-sm font-medium">
            {f.searchLabel}
          </label>
          <div className="relative mt-2">
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={f.searchPlaceholder}
              className="h-13 w-full rounded-full border border-sumi/20 bg-washi px-5 pr-12 font-gothic text-base placeholder:text-nezumi/70 focus:border-sumi focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={f.clearSearch}
                className="absolute right-1.5 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full hover:bg-sumi/5"
              >
                <CloseIcon className="h-4 w-4" />
              </button>
            )}
          </div>

          <div
            role="tablist"
            aria-label={f.categoriesLabel}
            aria-orientation="vertical"
            className={`mt-8 hidden flex-col transition-opacity lg:flex ${results ? "opacity-40" : ""}`}
          >
            {f.categories.map((cat, index) => {
              const selected = index === category;
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
                  onClick={() => selectCategory(index)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={`flex min-h-12 items-center justify-between border-l-2 pl-5 text-left font-gothic text-sm transition-colors duration-300 ${
                    selected ? "border-kin text-sumi" : "border-sumi/10 text-nezumi hover:border-sumi/40 hover:text-sumi"
                  }`}
                >
                  {cat.label}
                  <span className="tabular-nums text-xs text-nezumi">{cat.items.length}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 lg:col-span-7 lg:col-start-6">
          <div className="-mx-4 mb-6 overflow-x-auto px-4 lg:hidden">
            <div className="flex gap-2" role="group" aria-label={f.categoriesLabel}>
              {f.categories.map((cat, index) => (
                <button
                  key={cat.id}
                  type="button"
                  aria-pressed={!results && index === category}
                  onClick={() => selectCategory(index)}
                  className={`min-h-11 shrink-0 rounded-full border px-4 font-gothic text-xs ${
                    !results && index === category ? "border-sumi bg-sumi text-washi" : "border-sumi/20"
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
                {results.length === 0 ? f.noResults : f.results(results.length)}
              </p>
              <ul className="mt-4 border-t border-sumi/12">
                {results.map(({ item, key }) => (
                  <Question key={key} id={`faq-${key}`} q={item.q} a={item.a} open={open === key} onToggle={() => setOpen(open === key ? null : key)} />
                ))}
              </ul>
            </div>
          ) : (
            <div id="faq-panel" role="tabpanel" aria-labelledby={`faq-tab-${current.id}`}>
              <p className="font-mincho text-2xl">{current.label}</p>
              <ul className="mt-6 border-t border-sumi/12">
                {current.items.map((item, index) => {
                  const key = `${current.id}-${index}`;
                  return <Question key={key} id={`faq-${key}`} q={item.q} a={item.a} open={open === key} onToggle={() => setOpen(open === key ? null : key)} />;
                })}
              </ul>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
