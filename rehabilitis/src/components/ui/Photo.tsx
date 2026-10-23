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
  /** Zdjęcie tylko ilustruje sąsiedni tekst (np. miniatura w linku) – pusty alt, żeby czytnik nie powtarzał opisu. */
  decorative?: boolean;
}

/**
 * Zdjęcie z centralnej mapy `config/images.ts`, kadrowane według pola `position`.
 * Kontener rodzica (klasa `.photo`) nadaje proporcje – obraz wypełnia go z `object-fit: cover`.
 * Podpis, w tym informację „zdjęcie poglądowe”, daje `PhotoCaption`. Brak pliku = spokojny placeholder.
 */
export function Photo({ image, sizes, className = "", preload, placeholderLabel, decorative }: PhotoProps) {
  const resolved = useImage(image);

  if (resolved.src) {
    return (
      <Image
        src={resolved.src}
        alt={decorative ? "" : resolved.alt}
        fill
        sizes={sizes}
        preload={preload}
        quality={85}
        className={`object-cover ${className}`}
        style={{ objectPosition: resolved.position }}
      />
    );
  }

  // Brak pliku – wgraj zdjęcie pod ścieżkę `resolved.expectedPath` (patrz config/images.ts).
  return (
    <div
      role={decorative ? undefined : "img"}
      aria-label={decorative ? undefined : (placeholderLabel ?? resolved.alt)}
      aria-hidden={decorative || undefined}
      data-missing-image={resolved.expectedPath}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-mint px-6 text-center text-brand ${className}`}
    >
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <rect x="3" y="5" width="18" height="14" rx="1.5" />
        <circle cx="9" cy="10" r="2" />
        <path d="m21 16-5-5-8 8" />
      </svg>
      {placeholderLabel && <span className="text-small font-bold">{placeholderLabel}</span>}
    </div>
  );
}

/** Podpis pod zdjęciem. Dla zdjęć oznaczonych `illustrative` dopisuje „zdjęcie poglądowe”. */
export function PhotoCaption({
  image,
  children,
  className = "",
  asParagraph = false,
}: {
  image: ImageKey;
  children?: React.ReactNode;
  className?: string;
  /** Podpis poza elementem <figure> (np. pod mozaiką) – renderowany jako akapit. */
  asParagraph?: boolean;
}) {
  const { illustrative, src } = useImage(image);
  if (!src || (!children && !illustrative)) return null;
  const Tag = asParagraph ? "p" : "figcaption";
  return (
    <Tag className={`mt-2 text-caption text-muted ${className}`}>
      {children}
      {children && illustrative ? " " : ""}
      {illustrative && (children ? "(zdjęcie poglądowe)" : "Zdjęcie poglądowe")}
    </Tag>
  );
}
