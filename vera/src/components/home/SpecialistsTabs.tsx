"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { ResolvedImage } from "@/config/images";
import { ShotView } from "@/components/ui/ShotView";

export interface SpecialistTab {
  slug: string;
  name: string;
  role: string;
  discipline: string;
  quote: string;
  image: ResolvedImage;
}

/** Tabs (WAI-ARIA pattern): names on the right switch the large portrait and quote. Arrow keys move between names. */
export function SpecialistsTabs({ people }: { people: SpecialistTab[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys: Record<string, number> = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
    let next = active;
    if (event.key in keys) next = (active + keys[event.key] + people.length) % people.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = people.length - 1;
    else return;
    event.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  const person = people[active];
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <div className="relative aspect-[4/5] overflow-hidden lg:col-span-6 lg:row-span-2">
        {people.map((p, i) => (
          <div key={p.slug} aria-hidden={i !== active} className={`absolute inset-0 transition-[opacity,transform] duration-700 ease-[var(--ease-out-quint)] ${i === active ? "scale-100 opacity-100" : "scale-[1.03] opacity-0"}`}>
            <ShotView image={p.image} sizes="(min-width: 1024px) 46vw, 100vw" />
          </div>
        ))}
      </div>

      <div className="lg:col-span-5 lg:col-start-8">
        <div role="tablist" aria-label="Specialists" aria-orientation="vertical" onKeyDown={onKeyDown} className="border-t border-black">
          {people.map((p, i) => (
            <button
              key={p.slug}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              id={`tab-${p.slug}`}
              role="tab"
              type="button"
              aria-selected={i === active}
              aria-controls="specialist-panel"
              tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className="group flex w-full items-baseline justify-between gap-6 border-b border-black/15 py-5 text-left"
            >
              <span className={`font-display text-[clamp(1.6rem,2.6vw,2.4rem)] leading-tight transition-colors ${i === active ? "italic text-burgundy" : "text-black/70 group-hover:text-black"}`}>{p.name}</span>
              <span className="kicker shrink-0 text-black/75">{p.discipline}</span>
            </button>
          ))}
        </div>
      </div>

      <div id="specialist-panel" role="tabpanel" aria-labelledby={`tab-${person.slug}`} className="lg:col-span-5 lg:col-start-8 lg:self-end">
        <p className="kicker text-burgundy">{person.role}</p>
        <blockquote className="mt-4 font-display text-[clamp(1.5rem,2.2vw,2rem)] leading-snug">“{person.quote}”</blockquote>
        <Link href={`/specialists#${person.slug}`} className="underline-draw mt-6 inline-block text-sm font-medium">
          Full profile
        </Link>
      </div>
    </div>
  );
}
