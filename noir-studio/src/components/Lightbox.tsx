"use client";

import { useEffect, useRef } from "react";
import type { ResolvedImage } from "@/config/images";
import { Photo } from "./Photo";
import styles from "./Lightbox.module.css";

export interface LightboxItem {
  photo: ResolvedImage;
  title: string;
  meta: string;
}

/**
 * Pełnoekranowy podgląd zdjęć na natywnym <dialog>.
 * Klawiatura: ← → przełączają kadry, Esc zamyka. Na ekranach dotykowych – przesunięcie palcem.
 */
export function Lightbox({ items, index, onIndexChange }: { items: LightboxItem[]; index: number | null; onIndexChange: (index: number | null) => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const open = index !== null && items.length > 0;
  const current = open ? items[index] : null;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    if (!dialog.open) dialog.showModal();
    return () => dialog.close();
  }, [open]);

  const go = (step: number) => {
    if (index === null) return;
    onIndexChange((index + step + items.length) % items.length);
  };

  // Sąsiednie zdjęcia ładujemy z wyprzedzeniem, aby przełączanie było natychmiastowe.
  const neighbours = open ? [items[(index + 1) % items.length], items[(index - 1 + items.length) % items.length]] : [];

  return (
    <dialog
      ref={ref}
      className={styles.lightbox}
      aria-label={current ? `Photograph: ${current.title}` : "Photograph viewer"}
      onCancel={(event) => {
        event.preventDefault();
        onIndexChange(null);
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowRight") {
          event.preventDefault();
          go(1);
        } else if (event.key === "ArrowLeft") {
          event.preventDefault();
          go(-1);
        }
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onIndexChange(null);
      }}
    >
      {current && index !== null && (
        <div className={styles.layout}>
          <div className={styles.top}>
            <p className={styles.counter} aria-live="polite">
              <span className="visually-hidden">Photograph </span>
              {String(index + 1).padStart(2, "0")}
              <span className={styles.of}> / </span>
              {String(items.length).padStart(2, "0")}
            </p>
            <button type="button" className={styles.close} onClick={() => onIndexChange(null)}>
              <span>Close</span>
              <span className={styles.cross} aria-hidden="true" />
            </button>
          </div>

          <div
            className={styles.stage}
            onTouchStart={(event) => {
              const touch = event.touches[0];
              touchStart.current = { x: touch.clientX, y: touch.clientY };
            }}
            onTouchEnd={(event) => {
              const start = touchStart.current;
              touchStart.current = null;
              if (!start) return;
              const touch = event.changedTouches[0];
              const dx = touch.clientX - start.x;
              if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(touch.clientY - start.y)) go(dx < 0 ? 1 : -1);
            }}
          >
            <div key={index} className={styles.picture} style={{ ["--ar" as string]: current.photo.aspect }}>
              <Photo image={current.photo} label={current.meta.split(",")[0]} sizes="90vw" tone="dark" />
            </div>
            <div className={styles.prefetch} aria-hidden="true">
              {neighbours.map((item, i) => (
                <div key={i} className={styles.picture} style={{ ["--ar" as string]: item.photo.aspect }}>
                  {item.photo.src && <Photo image={item.photo} sizes="90vw" tone="dark" />}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.bottom}>
            <button type="button" className={styles.nav} onClick={() => go(-1)} aria-label="Previous photograph">
              <svg viewBox="0 0 40 12" aria-hidden="true">
                <path d="M40 6H1M6 1L1 6l5 5" />
              </svg>
              <span>Prev</span>
            </button>
            <div className={styles.caption}>
              <p className={styles.title}>{current.title}</p>
              <p className={styles.meta}>{current.meta}</p>
            </div>
            <button type="button" className={`${styles.nav} ${styles.next}`} onClick={() => go(1)} aria-label="Next photograph">
              <span>Next</span>
              <svg viewBox="0 0 40 12" aria-hidden="true">
                <path d="M0 6h39M34 1l5 5-5 5" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </dialog>
  );
}
