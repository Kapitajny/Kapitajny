"use client";

import Link from "next/link";
import { useState } from "react";
import type { ResolvedImage } from "@/config/images";
import { ShotView } from "./ShotView";

export interface JournalItem {
  slug: string;
  title: string;
  dek: string;
  category: string;
  dateLabel: string;
  date: string;
  minutes: number;
  image: ResolvedImage;
}

/** Article list with a category filter (toggle buttons). */
export function JournalList({ items }: { items: JournalItem[] }) {
  const cats = ["All", ...Array.from(new Set(items.map((i) => i.category)))];
  const [cat, setCat] = useState("All");
  const shown = cat === "All" ? items : items.filter((i) => i.category === cat);
  return (
    <>
      <div role="group" aria-label="Filter articles by topic" className="flex flex-wrap gap-2">
        {cats.map((c) => (
          <button
            key={c}
            type="button"
            aria-pressed={cat === c}
            onClick={() => setCat(c)}
            className="min-h-11 border border-black/25 px-5 text-sm transition-colors hover:border-black aria-pressed:border-burgundy aria-pressed:bg-burgundy aria-pressed:text-ivory"
          >
            {c}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {shown.length} articles shown
      </p>
      <ul className="mt-12 border-t border-black">
        {shown.map((a) => (
          <li key={a.slug} className="border-b border-black/15">
            <Link href={`/journal/${a.slug}`} className="group grid gap-6 py-8 sm:grid-cols-[9rem_1fr] lg:grid-cols-[12rem_1fr_14rem] lg:items-center lg:gap-10">
              <span className="relative block aspect-[4/3] w-full overflow-hidden sm:aspect-[4/5]">
                <ShotView image={a.image} sizes="(min-width: 1024px) 192px, (min-width: 640px) 144px, 100vw" bare />
              </span>
              <span>
                <span className="kicker block text-rose-deep">{a.category}</span>
                <span className="mt-3 block font-display text-[clamp(1.8rem,3vw,2.8rem)] leading-tight group-hover:italic">{a.title}</span>
                <span className="mt-3 block max-w-xl text-stone">{a.dek}</span>
              </span>
              <span className="text-sm text-stone sm:col-start-2 lg:col-start-3 lg:text-right">
                <time dateTime={a.date}>{a.dateLabel}</time>
                <span className="block">{a.minutes} min read</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
