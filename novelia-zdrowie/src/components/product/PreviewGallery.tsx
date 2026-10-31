"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { PreviewPage } from "@/data/products";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon } from "@/components/ui/Icons";

/** Podgląd przykładowych stron z powiększeniem (natywny <dialog>). */
export function PreviewGallery({ pages, title }: { pages: PreviewPage[]; title: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (index !== null && !d.open) d.showModal();
    if (index === null && d.open) d.close();
  }, [index]);

  const go = (delta: number) => setIndex((i) => (i === null ? i : (i + delta + pages.length) % pages.length));

  return (
    <>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
        {pages.map((page, i) => (
          <li key={page.src}>
            <button type="button" onClick={() => setIndex(i)} className="group block w-full text-left" aria-label={`Powiększ: ${page.caption}`}>
              <span className="relative block aspect-[210/297] overflow-hidden bg-cream shadow-soft ring-1 ring-line transition-transform duration-300 group-hover:-translate-y-1">
                <Image src={page.src} alt={page.alt} fill sizes="(min-width: 1024px) 22rem, (min-width: 640px) 30vw, 45vw" className="object-cover" />
              </span>
              <span className="mt-2.5 block text-sm text-muted group-hover:text-forest">{page.caption}</span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={ref}
        onClose={() => setIndex(null)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") go(1);
          if (e.key === "ArrowLeft") go(-1);
        }}
        onClick={(e) => {
          if (e.target === ref.current) setIndex(null);
        }}
        aria-label={`Podgląd stron – ${title}`}
        className="m-auto max-h-[96dvh] w-[min(96vw,44rem)] bg-transparent p-0 backdrop:bg-forest-deep/80"
      >
        {index !== null && (
          <figure className="relative">
            <div className="relative aspect-[210/297] max-h-[86dvh] w-full bg-paper">
              <Image src={pages[index].src} alt={pages[index].alt} fill sizes="44rem" className="object-contain" />
            </div>
            <figcaption className="mt-3 flex items-center justify-between gap-2 text-cream">
              <button type="button" onClick={() => go(-1)} className="inline-flex h-11 w-11 items-center justify-center hover:bg-white/10" aria-label="Poprzednia strona">
                <ArrowLeftIcon />
              </button>
              <span className="text-sm">
                {pages[index].caption} · {index + 1}/{pages.length}
              </span>
              <span className="flex">
                <button type="button" onClick={() => go(1)} className="inline-flex h-11 w-11 items-center justify-center hover:bg-white/10" aria-label="Następna strona">
                  <ArrowRightIcon />
                </button>
                <button type="button" onClick={() => setIndex(null)} className="inline-flex h-11 w-11 items-center justify-center hover:bg-white/10" aria-label="Zamknij podgląd">
                  <CloseIcon />
                </button>
              </span>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  );
}
