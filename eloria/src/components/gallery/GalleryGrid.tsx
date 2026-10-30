"use client";

import { useEffect, useRef, useState } from "react";
import type { ResolvedImage } from "@/config/images";
import type { GalleryGroup } from "@/data/gallery";
import { PhotoView } from "@/components/ui/PhotoView";

export interface GalleryItem {
  image: ResolvedImage;
  group: GalleryGroup;
  span?: "wide" | "tall";
}

// Na tabletach i desktopie mozaika ma stałą wysokość rzędu; na telefonach każdy kafel ma własne proporcje.
const spanClass = {
  wide: "aspect-[3/2] md:col-span-2 md:aspect-auto",
  tall: "aspect-[3/4] md:row-span-2 md:aspect-auto",
  none: "aspect-[4/5] md:aspect-auto",
};

export function GalleryGrid({ items, groups }: { items: GalleryItem[]; groups: { value: GalleryGroup; label: string }[] }) {
  const [filter, setFilter] = useState<GalleryGroup | "all">("all");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const visible = filter === "all" ? items : items.filter((item) => item.group === filter);
  const current = openIndex !== null ? visible[openIndex] : null;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (openIndex !== null && !dialog.open) dialog.showModal();
    if (openIndex === null && dialog.open) dialog.close();
  }, [openIndex]);

  const step = (delta: number) => setOpenIndex((i) => (i === null ? i : (i + delta + visible.length) % visible.length));

  return (
    <>
      <div role="group" aria-label="Filtruj galerię" className="flex flex-wrap gap-2">
        {[{ value: "all" as const, label: "Wszystko" }, ...groups].map((g) => (
          <button
            key={g.value}
            type="button"
            aria-pressed={filter === g.value}
            onClick={() => setFilter(g.value)}
            className="min-h-11 rounded-full border border-espresso/25 px-5 text-sm transition-colors hover:border-espresso aria-pressed:border-espresso aria-pressed:bg-espresso aria-pressed:text-ivory"
          >
            {g.label}
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        Wyświetlono zdjęć: {visible.length}
      </p>

      <ul className="mt-10 grid grid-flow-dense grid-cols-1 gap-4 sm:grid-cols-2 md:auto-rows-[clamp(15rem,24vw,27rem)] md:grid-cols-3 md:gap-6 lg:gap-8">
        {visible.map((item, index) => (
          <li key={item.image.key} className={`relative overflow-hidden bg-blush ${spanClass[item.span ?? "none"]}`}>
            <button
              type="button"
              className="group absolute inset-0 block h-full w-full cursor-zoom-in"
              onClick={(event) => {
                triggerRef.current = event.currentTarget;
                setOpenIndex(index);
              }}
            >
              <span className="sr-only">Powiększ zdjęcie: {item.image.alt}</span>
              <PhotoView
                image={item.image}
                sizes={item.span === "wide" ? "(min-width: 768px) 62vw, 100vw" : "(min-width: 768px) 31vw, (min-width: 640px) 50vw, 100vw"}
                className="transition-transform duration-700 ease-[var(--ease-soft)] group-hover:scale-[1.025]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Podgląd zdjęcia"
        className="m-auto h-dvh max-h-none w-full max-w-none bg-espresso-deep p-0 text-ivory backdrop:bg-espresso-deep/80"
        onClose={() => {
          setOpenIndex(null);
          triggerRef.current?.focus();
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        {current && (
          <div className="flex h-full flex-col" data-surface="dark">
            <div className="frame flex h-[var(--header-h)] shrink-0 items-center justify-between text-sm">
              <span aria-live="polite">
                {(openIndex ?? 0) + 1} / {visible.length}
              </span>
              <button type="button" onClick={() => dialogRef.current?.close()} className="-mr-2 inline-flex min-h-11 items-center gap-3 px-2" autoFocus>
                Zamknij
                <svg aria-hidden="true" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M2 2l14 14M16 2 2 16" stroke="currentColor" strokeWidth="1" />
                </svg>
              </button>
            </div>
            <figure className="frame flex min-h-0 flex-1 flex-col pb-6">
              <div className="relative min-h-0 flex-1">
                <PhotoView image={current.image} sizes="100vw" className="!object-contain" />
              </div>
              <figcaption className="mt-4 flex items-center justify-between gap-6 text-sm text-ivory/80">
                <span>{current.image.alt}</span>
                <span className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => step(-1)} className="btn btn-outline-light min-h-11 px-5" aria-label="Poprzednie zdjęcie">
                    <svg aria-hidden="true" width="16" height="10" viewBox="0 0 16 10" fill="none">
                      <path d="M15 5H1m4-4L1 5l4 4" stroke="currentColor" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => step(1)} className="btn btn-outline-light min-h-11 px-5" aria-label="Następne zdjęcie">
                    <svg aria-hidden="true" width="16" height="10" viewBox="0 0 16 10" fill="none">
                      <path d="M1 5h14m-4-4 4 4-4 4" stroke="currentColor" />
                    </svg>
                  </button>
                </span>
              </figcaption>
            </figure>
          </div>
        )}
      </dialog>
    </>
  );
}
