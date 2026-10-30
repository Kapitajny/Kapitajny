"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { IMAGES, imageFocus, imageSrc, type ImageKey } from "@/config/images";

export interface GalleryItem {
  image: ImageKey;
  caption: string;
  /** Położenie na siatce na dużych ekranach. */
  span: string;
  aspect: string;
}

/**
 * Galeria: asymetryczna siatka zdjęć otwieranych w powiększeniu.
 * Podgląd to natywne okno <dialog>, więc fokus zostaje w środku, a Escape je zamyka;
 * strzałki przełączają zdjęcia.
 */
export function Gallery({ items }: { items: GalleryItem[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggers = useRef<(HTMLButtonElement | null)[]>([]);
  const [index, setIndex] = useState<number | null>(null);

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };

  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback((delta: number) => setIndex((i) => (i === null ? i : (i + delta + items.length) % items.length)), [items.length]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onClose = () =>
      setIndex((i) => {
        if (i !== null) triggers.current[i]?.focus();
        return null;
      });
    dialog.addEventListener("close", onClose);
    return () => dialog.removeEventListener("close", onClose);
  }, []);

  const current = index === null ? null : items[index];

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-12 lg:gap-6">
        {items.map((item, i) => (
          <li key={item.image} className={item.span}>
            <button
              ref={(el) => {
                triggers.current[i] = el;
              }}
              type="button"
              onClick={() => open(i)}
              className="group relative block w-full cursor-zoom-in overflow-hidden bg-powder text-left"
              aria-label={`Powiększ zdjęcie: ${item.caption}`}
              aria-haspopup="dialog"
            >
              <span className={`relative block ${item.aspect}`}>
                <Image
                  src={imageSrc(item.image)}
                  alt={IMAGES[item.image].alt}
                  fill
                  sizes="(min-width: 1024px) 34vw, 50vw"
                  className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-out-quart)] group-hover:scale-[1.04]"
                  style={{ objectPosition: imageFocus(item.image) }}
                />
              </span>
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Podgląd zdjęcia"
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-black p-0 text-ivory backdrop:bg-black/80"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") step(1);
          if (e.key === "ArrowLeft") step(-1);
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close();
        }}
      >
        {current && index !== null && (
          <div className="flex h-full flex-col">
            <div className="shell flex h-[var(--header-h)] shrink-0 items-center justify-between text-sm">
              <p aria-live="polite">
                <span className="tabular-nums">
                  {index + 1} / {items.length}
                </span>
                <span className="ml-4 text-ivory/70">{current.caption}</span>
              </p>
              <button type="button" onClick={close} className="-mr-3 inline-flex h-12 items-center gap-3 px-3 hover:text-rose-light" autoFocus>
                Zamknij
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16">
                  <path d="M2 2l12 12M14 2L2 14" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </button>
            </div>
            <div className="relative min-h-0 flex-1" onClick={close}>
              <Image key={current.image} src={imageSrc(current.image)} alt={IMAGES[current.image].alt} fill sizes="100vw" className="object-contain p-4 sm:p-10" />
            </div>
            <div className="shell flex shrink-0 items-center justify-between py-4">
              <button type="button" onClick={() => step(-1)} className="inline-flex h-12 items-center gap-3 text-sm hover:text-rose-light">
                <svg aria-hidden="true" width="28" height="10" viewBox="0 0 28 10">
                  <path d="M27 5H2M6 1L2 5l4 4" stroke="currentColor" fill="none" strokeWidth="1.2" />
                </svg>
                Poprzednie
              </button>
              <button type="button" onClick={() => step(1)} className="inline-flex h-12 items-center gap-3 text-sm hover:text-rose-light">
                Następne
                <svg aria-hidden="true" width="28" height="10" viewBox="0 0 28 10">
                  <path d="M1 5h25M22 1l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.2" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
