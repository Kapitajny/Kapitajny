"use client";

import Image from "next/image";
import type { ImageKey } from "@/config/images";
import { useImage } from "./ImagesProvider";

interface PhotoProps {
  image: ImageKey;
  /** Atrybut `sizes` dla responsywnego ładowania. */
  sizes: string;
  className?: string;
  /** Zdjęcie widoczne od razu po wejściu (hero) – ładowane priorytetowo. */
  preload?: boolean;
  /** Tekst w miejscu brakującego zdjęcia, np. „Zdjęcie fizjoterapeuty”. */
  placeholderLabel?: string;
}

/**
 * Zdjęcie z centralnej mapy `config/images.ts`.
 * Kontener rodzica musi mieć wymiary i `position: relative` – obraz wypełnia go z `object-fit: cover`.
 * Zdjęcia oznaczone `illustrative` dostają podpis „Zdjęcie poglądowe”. Brak pliku = spokojny placeholder.
 */
export function Photo({ image, sizes, className = "", preload, placeholderLabel }: PhotoProps) {
  const resolved = useImage(image);

  if (resolved.src) {
    return (
      <>
        <Image src={resolved.src} alt={resolved.alt} fill sizes={sizes} preload={preload} quality={85} className={`object-cover ${className}`} />
        {resolved.illustrative && (
          <span className="pointer-events-none absolute bottom-2 left-2 rounded bg-white/85 px-1.5 py-0.5 text-xs text-graphite">Zdjęcie poglądowe</span>
        )}
      </>
    );
  }

  // Brak pliku – wgraj zdjęcie pod ścieżkę `resolved.expectedPath` (patrz config/images.ts).
  return (
    <div
      role="img"
      aria-label={placeholderLabel ?? resolved.alt}
      data-missing-image={resolved.expectedPath}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-sage px-6 text-center ${className}`}
    >
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-moss" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 16-5-5-8 8" />
      </svg>
      {placeholderLabel && <span className="text-[0.95rem] font-medium text-moss">{placeholderLabel}</span>}
      {process.env.NODE_ENV === "development" && <span className="font-mono text-[10px] text-graphite/60">{resolved.expectedPath}</span>}
    </div>
  );
}
