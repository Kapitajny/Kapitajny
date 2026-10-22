"use client";

import Image from "next/image";
import type { ImageKey } from "@/config/images";
import { Motif } from "./Motifs";
import { useImage } from "./ImagesProvider";

interface PhotoProps {
  image: ImageKey;
  /** Atrybut `sizes` dla responsywnego ładowania. */
  sizes: string;
  className?: string;
  /** Zdjęcie widoczne od razu po wejściu (hero) – ładowane priorytetowo. */
  preload?: boolean;
  /** Podpis w placeholderze, np. „Miejsce na zdjęcie fizjoterapeuty”. */
  placeholderLabel?: string;
  /** Czy pokazać podpis „Zdjęcie poglądowe” dla zdjęć oznaczonych `illustrative` (domyślnie tak). */
  showIllustrativeNote?: boolean;
}

/**
 * Zdjęcie z centralnej mapy `config/images.ts`.
 * Kontener rodzica musi mieć wymiary i `position: relative` – obraz wypełnia go z `object-fit: cover`.
 * Jeśli pliku nie ma, renderowany jest spokojny placeholder w kolorach marki.
 */
export function Photo({ image, sizes, className = "", preload, placeholderLabel, showIllustrativeNote = true }: PhotoProps) {
  const resolved = useImage(image);

  if (resolved.src) {
    return (
      <>
        <Image src={resolved.src} alt={resolved.alt} fill sizes={sizes} preload={preload} quality={85} className={`object-cover ${className}`} />
        {resolved.illustrative && showIllustrativeNote && (
          <span className="pointer-events-none absolute bottom-2 right-2 rounded-sm bg-paper/85 px-1.5 py-0.5 text-[0.68rem] font-medium tracking-wide text-graphite/80">
            Zdjęcie poglądowe
          </span>
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
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 bg-sage px-6 text-center text-forest ${className}`}
    >
      <Motif motif="joint" className="w-28 opacity-70" />
      {placeholderLabel && <span className="font-serif text-lg italic text-forest/80">{placeholderLabel}</span>}
      {process.env.NODE_ENV === "development" && (
        <span className="absolute left-2 top-2 max-w-[90%] truncate rounded bg-paper/85 px-2 py-1 font-mono text-[10px] text-graphite/70">
          brak pliku: {resolved.expectedPath}
        </span>
      )}
    </div>
  );
}
