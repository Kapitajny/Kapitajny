"use client";

import Link from "next/link";
import { useState } from "react";
import type { ResolvedImage } from "@/config/images";
import { ShotView } from "@/components/ui/ShotView";

export interface IndexItem {
  slug: string;
  name: string;
  line: string;
  count: number;
  image: ResolvedImage;
}

/** Category index: hovering or focusing a row swaps the image in the sticky frame (desktop). */
export function TreatmentIndex({ items }: { items: IndexItem[] }) {
  const [active, setActive] = useState(0);
  return (
    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
      <ol className="border-t border-black lg:col-span-7">
        {items.map((item, i) => (
          <li key={item.slug} className="border-b border-black/15">
            <Link
              href={`/treatments#${item.slug}`}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-[2.5rem_1fr] items-baseline gap-x-4 py-6 sm:grid-cols-[3.5rem_1fr_auto] lg:py-8"
            >
              <span className="kicker text-rose-deep">{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className={`block font-display text-[clamp(2rem,4.6vw,4rem)] leading-none transition-[transform,color] duration-500 ease-[var(--ease-out-quint)] group-hover:translate-x-3 group-hover:italic ${active === i ? "lg:text-burgundy" : ""}`}>
                  {item.name}
                </span>
                <span className="mt-3 block text-sm text-stone">{item.line}</span>
              </span>
              <span className="kicker col-start-2 mt-3 text-stone sm:col-start-3 sm:mt-0">{item.count} treatments</span>
              <span className="relative col-span-full mt-6 block aspect-[16/10] overflow-hidden lg:hidden">
                <ShotView image={item.image} sizes="100vw" />
              </span>
            </Link>
          </li>
        ))}
      </ol>
      <div className="hidden lg:col-span-4 lg:col-start-9 lg:block">
        <div className="sticky top-28 aspect-[4/5] overflow-hidden">
          {items.map((item, i) => (
            <div key={item.slug} aria-hidden={active !== i} className={`absolute inset-0 transition-opacity duration-500 ${active === i ? "opacity-100" : "opacity-0"}`}>
              <ShotView image={item.image} sizes="30vw" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
