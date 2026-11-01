"use client";

import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";

import type { Photo } from "@/data/projects";

type Props = { photos: Photo[]; index: number | null; onChange: (i: number | null) => void; title: string };

export function Lightbox({ photos, index, onChange, title }: Props) {
  const reduce = useReducedMotion();
  const closeBtn = useRef<HTMLButtonElement>(null);
  const open = index !== null;
  const step = useCallback(
    (d: number) => onChange(index === null ? null : (index + d + photos.length) % photos.length),
    [index, onChange, photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const prev = html.style.overflow;
    html.style.overflow = "hidden";
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onChange(null);
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "Tab") {
        const els = Array.from(document.querySelectorAll<HTMLElement>("[data-lightbox] button"));
        const i = els.indexOf(document.activeElement as HTMLElement);
        if (e.shiftKey && i <= 0) {
          e.preventDefault();
          els[els.length - 1]?.focus();
        } else if (!e.shiftKey && i === els.length - 1) {
          e.preventDefault();
          els[0]?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
      opener?.focus({ preventScroll: true });
    };
  }, [open, onChange, step]);

  const photo = index !== null ? photos[index] : null;

  return (
    <AnimatePresence>
      {open && photo && (
        <motion.div
          data-lightbox
          role="dialog"
          aria-modal="true"
          aria-label={`${title} — galeria`}
          className="fixed inset-0 z-[80] flex flex-col bg-graphite text-paper"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.45 }}
        >
          <div className="shell flex h-20 shrink-0 items-center justify-between">
            <p className="t-meta text-mist">
              {title} <span className="ml-3">{(index ?? 0) + 1} / {photos.length}</span>
            </p>
            <button
              ref={closeBtn}
              type="button"
              onClick={() => onChange(null)}
              aria-label="Zamknij galerię"
              className="grid h-11 w-11 place-items-center rounded-full border border-line-light transition-colors hover:bg-paper hover:text-graphite"
            >
              <X size={18} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
          <div className="relative min-h-0 flex-1">
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={index}
                className="absolute inset-0 px-4 pb-4 md:px-24"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="relative h-full w-full">
                  <Image src={photo.src} alt={photo.alt} fill sizes="100vw" quality={82} placeholder="blur" className="object-contain" />
                </div>
                <figcaption className="sr-only">{photo.alt}</figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
          <div className="shell flex h-20 shrink-0 items-center justify-between">
            <p className="t-meta max-w-[60ch] truncate text-mist" aria-hidden="true">
              {photo.alt}
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => step(-1)}
                aria-label="Poprzednie zdjęcie"
                className="grid h-11 w-11 place-items-center rounded-full border border-line-light transition-colors hover:bg-paper hover:text-graphite"
              >
                <ArrowLeft size={16} strokeWidth={1.25} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => step(1)}
                aria-label="Następne zdjęcie"
                className="grid h-11 w-11 place-items-center rounded-full border border-line-light transition-colors hover:bg-paper hover:text-graphite"
              >
                <ArrowRight size={16} strokeWidth={1.25} aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
