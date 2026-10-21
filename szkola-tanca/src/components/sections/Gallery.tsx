"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Close, Expand } from "@/components/ui/Icons";
import { Photo } from "@/components/ui/Photo";
import { PHOTOS, type PhotoKey } from "@/config/photos";

interface GalleryItem {
  photo: PhotoKey;
  caption: string;
  /** Klasy kafelka: proporcje i położenie w siatce. */
  tile: string;
  position: string;
}

/** Każde zdjęcie pojawia się w galerii tylko raz. */
const ITEMS: GalleryItem[] = [
  { photo: "classJoy", caption: "Zajęcia grupowe – radość z ruchu od pierwszych minut", tile: "aspect-[4/5] md:row-span-2 md:aspect-auto", position: "55% 50%" },
  { photo: "teamMotion", caption: "Taniec w grupie: skoki, parter i szerokie linie", tile: "aspect-[4/3]", position: "50% 45%" },
  { photo: "studioHall", caption: "Sala z lustrami, drążkami i dziennym światłem", tile: "aspect-[4/3]", position: "50% 55%" },
];

export function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState(0);

  const open = (index: number) => {
    setCurrent(index);
    dialogRef.current?.showModal();
  };
  const step = (delta: number) => setCurrent((index) => (index + delta + ITEMS.length) % ITEMS.length);
  const item = ITEMS[current];

  return (
    <section id="galeria" aria-labelledby="galeria-title" className="on-dark section-y bg-cocoa text-ivory">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="eyebrow text-blush">Galeria</p>
            <h2 id="galeria-title" className="h2 mt-5">
              Chwile z sali
            </h2>
          </div>
          <p className="max-w-[40ch] text-ivory/85">Kliknij zdjęcie, aby je powiększyć. Galerię będziemy uzupełniać zdjęciami z kolejnych zajęć i wydarzeń.</p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-[1.1fr_1fr] md:gap-5">
          {ITEMS.map((galleryItem, index) => (
            <li key={galleryItem.photo} className={`relative overflow-hidden rounded-sm ${galleryItem.tile}`}>
              <button type="button" onClick={() => open(index)} className="group absolute inset-0 block h-full w-full cursor-zoom-in" aria-haspopup="dialog">
                <Photo
                  photo={galleryItem.photo}
                  position={galleryItem.position}
                  sizes="(min-width: 768px) 45vw, 100vw"
                  className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-cocoa/85 to-transparent p-5 pt-16 text-left">
                  <span className="text-sm font-medium text-ivory">{galleryItem.caption}</span>
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ivory text-wine">
                    <Expand size={16} />
                    <span className="sr-only">Powiększ zdjęcie</span>
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        aria-label="Podgląd zdjęcia"
        className="dialog-fade m-auto max-h-[100dvh] w-full max-w-none bg-transparent p-0 text-ivory md:w-[min(92vw,62rem)]"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") step(1);
          if (event.key === "ArrowLeft") step(-1);
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialogRef.current?.close();
        }}
      >
        <figure className="relative bg-cocoa">
          <div className="relative aspect-square max-h-[78dvh] w-full">
            <Image key={item.photo} src={PHOTOS[item.photo].src} alt={PHOTOS[item.photo].alt} fill sizes="(min-width: 768px) 62rem, 100vw" className="fade-in object-contain" />
          </div>
          <figcaption className="flex flex-wrap items-center justify-between gap-4 px-5 py-4">
            <span>{item.caption}</span>
            <span className="text-sm text-ivory/80" aria-live="polite">
              {current + 1} / {ITEMS.length}
            </span>
          </figcaption>
        </figure>
        <div className="mt-3 flex items-center justify-center gap-3 pb-4">
          <button type="button" onClick={() => step(-1)} className="btn btn-outline-light btn-sm">
            <ArrowLeft size={16} /> Poprzednie
          </button>
          <button type="button" onClick={() => step(1)} className="btn btn-outline-light btn-sm">
            Następne <ArrowRight size={16} />
          </button>
          <button type="button" onClick={() => dialogRef.current?.close()} className="btn btn-light btn-sm" autoFocus>
            <Close size={16} /> Zamknij
          </button>
        </div>
      </dialog>
    </section>
  );
}
