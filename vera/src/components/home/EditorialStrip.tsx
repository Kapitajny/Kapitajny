"use client";

import { useRef } from "react";
import type { ResolvedImage } from "@/config/images";
import { ShotView } from "@/components/ui/ShotView";

const widths = { narrow: "w-[62vw] sm:w-[26vw] lg:w-[20vw]", regular: "w-[78vw] sm:w-[34vw] lg:w-[27vw]", wide: "w-[88vw] sm:w-[52vw] lg:w-[42vw]" };
const aspect = { narrow: "aspect-[2/3]", regular: "aspect-[3/4]", wide: "aspect-[4/3] sm:aspect-[3/2]" };

/** Horizontally scrolling editorial strip with snap points; buttons and keyboard scroll it by one frame. */
export function EditorialStrip({ frames }: { frames: { image: ResolvedImage; width: "narrow" | "regular" | "wide"; caption: string }[] }) {
  const scroller = useRef<HTMLUListElement>(null);
  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.6, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };

  return (
    <div>
      <div className="wrap flex justify-end gap-2">
        <button type="button" onClick={() => scrollBy(-1)} className="grid size-12 place-items-center border border-black/25 transition-colors hover:bg-black hover:text-ivory" aria-label="Previous images">
          <svg aria-hidden="true" width="20" height="10" viewBox="0 0 20 10" fill="none">
            <path d="M20 5H1m4.5-4L1 5l4.5 4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
        <button type="button" onClick={() => scrollBy(1)} className="grid size-12 place-items-center border border-black/25 transition-colors hover:bg-black hover:text-ivory" aria-label="Next images">
          <svg aria-hidden="true" width="20" height="10" viewBox="0 0 20 10" fill="none">
            <path d="M0 5h19m-4.5-4L19 5l-4.5 4" stroke="currentColor" strokeWidth="1.2" />
          </svg>
        </button>
      </div>
      <ul
        ref={scroller}
        tabIndex={0}
        aria-label="Editorial gallery – scroll horizontally"
        className="mt-8 flex snap-x snap-mandatory items-end gap-4 overflow-x-auto px-[var(--pad)] pb-6 [scrollbar-width:thin] sm:gap-6 lg:gap-8"
      >
        {frames.map((f) => (
          <li key={f.image.key} className={`shrink-0 snap-start ${widths[f.width]}`}>
            <figure>
              <div className={`relative overflow-hidden ${aspect[f.width]}`}>
                <ShotView image={f.image} sizes="(min-width: 1024px) 40vw, 85vw" />
              </div>
              <figcaption className="mt-3 flex justify-between gap-4 text-xs text-stone">
                <span>{f.caption}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
