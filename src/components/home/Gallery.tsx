"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { GalleryItem } from "@/config/gallery";
import { ChevronIcon, CloseIcon } from "@/components/ui/Icons";

export function Gallery({ items }: { items: GalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);

  const open = (i: number) => {
    setCurrent(i);
    dialogRef.current?.showModal();
  };
  const step = useCallback((dir: 1 | -1) => setCurrent((c) => (c == null ? c : (c + dir + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (!dialog.open) return;
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    const onClose = () => setCurrent(null);
    window.addEventListener("keydown", onKey);
    dialog.addEventListener("close", onClose);
    return () => {
      window.removeEventListener("keydown", onKey);
      dialog.removeEventListener("close", onClose);
    };
  }, [step]);

  const item = current != null ? items[current] : null;

  return (
    <>
      <ul className="grid grid-cols-2 gap-2 md:auto-rows-[clamp(4.5rem,8.5vw,7.5rem)] md:grid-cols-12 md:gap-3">
        {items.map((it, i) => (
          <li key={it.src} className={`${i === 0 ? "col-span-2 aspect-[4/3] md:aspect-auto" : "aspect-square md:aspect-auto"} ${it.area}`}>
            <button type="button" onClick={() => open(i)} className="group relative block h-full w-full overflow-hidden bg-slate text-left" aria-label={`Powiększ: ${it.caption}`}>
              <Image
                src={it.poster ?? it.src}
                alt={it.alt}
                fill
                sizes={i === 0 ? "(min-width: 768px) 58vw, 100vw" : "(min-width: 768px) 40vw, 50vw"}
                className="object-cover transition-transform duration-700 ease-[var(--ease-wake)] group-hover:scale-[1.05]"
                style={it.position ? { objectPosition: it.position } : undefined}
              />
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-graphite/80 to-transparent px-3 pb-2.5 pt-8 text-sm font-semibold text-white">
                {it.type === "video" ? "Film: " : ""}
                {it.caption}
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="dialog h-dvh w-screen"
        aria-label="Galeria"
        onClick={(e) => e.target === e.currentTarget && dialogRef.current?.close()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current == null) return;
          const dx = e.changedTouches[0].clientX - touchX.current;
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
          touchX.current = null;
        }}
      >
        {item && (
          <figure className="pointer-events-none flex h-full flex-col items-center justify-center gap-4 p-4 pb-24 md:p-16">
            <div key={item.src} className="rise pointer-events-auto relative h-full max-h-[78dvh] w-full max-w-6xl">
              {item.type === "video" ? (
                <video src={item.src} poster={item.poster} controls autoPlay playsInline className="h-full w-full object-contain" />
              ) : (
                <Image src={item.src} alt={item.alt} fill sizes="100vw" className="object-contain" />
              )}
            </div>
            <figcaption className="text-center text-white/85">
              {item.caption} <span className="tabular text-white/50">({(current ?? 0) + 1}/{items.length})</span>
            </figcaption>
          </figure>
        )}
        <button type="button" onClick={() => dialogRef.current?.close()} aria-label="Zamknij galerię" className="fixed right-3 top-3 grid h-12 w-12 place-items-center bg-white text-graphite">
          <CloseIcon />
        </button>
        <div className="fixed inset-x-0 bottom-4 flex justify-center gap-2">
          <button type="button" onClick={() => step(-1)} aria-label="Poprzednie zdjęcie" className="grid h-12 w-12 place-items-center bg-white text-graphite">
            <ChevronIcon className="rotate-180" />
          </button>
          <button type="button" onClick={() => step(1)} aria-label="Następne zdjęcie" className="grid h-12 w-12 place-items-center bg-white text-graphite">
            <ChevronIcon />
          </button>
        </div>
      </dialog>
    </>
  );
}
