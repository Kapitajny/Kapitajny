"use client";

import Image from "next/image";
import { useId } from "react";
import type { ImageKey } from "@/config/images";
import { CupLineArt } from "./Icons";
import { useImage } from "./ImagesProvider";

interface PhotoProps {
  image: ImageKey;
  /** Atrybut `sizes` dla responsywnego ładowania. */
  sizes: string;
  className?: string;
  /** Zdjęcie widoczne od razu po wejściu (hero) – ładowane priorytetowo. */
  preload?: boolean;
  /** Podpis w placeholderze, np. nazwa napoju. */
  placeholderLabel?: string;
  tone?: "light" | "dark";
}

/**
 * Zdjęcie z centralnej mapy `config/images.ts`.
 * Kontener rodzica musi mieć wymiary (np. `aspect-[4/5]`) – obraz wypełnia go z `object-fit: cover`.
 * Jeśli pliku nie ma, renderowany jest placeholder w stylistyce marki.
 */
export function Photo({ image, sizes, className = "", preload, placeholderLabel, tone = "light" }: PhotoProps) {
  const resolved = useImage(image);
  const patternId = `grain${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  if (resolved.src) {
    return <Image src={resolved.src} alt={resolved.alt} fill sizes={sizes} preload={preload} className={`object-cover ${className}`} />;
  }

  // DEV: brak pliku – wgraj zdjęcie pod ścieżkę `resolved.expectedPath` (patrz config/images.ts).
  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={resolved.alt}
      data-missing-image={resolved.expectedPath}
      className={`absolute inset-0 flex flex-col items-center justify-center gap-3 overflow-hidden ${
        dark ? "bg-[#2e2119] text-oat/60" : "bg-sand text-latte/70"
      } ${className}`}
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.35]" aria-hidden="true">
        <defs>
          <pattern id={patternId} width="6" height="6" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${patternId})`} />
      </svg>
      <CupLineArt size={56} className="relative" />
      {placeholderLabel && <span className={`relative font-serif text-lg italic ${dark ? "text-oat/80" : "text-espresso/60"}`}>{placeholderLabel}</span>}
      {process.env.NODE_ENV === "development" && (
        <span className="absolute right-2 top-2 max-w-[75%] truncate rounded bg-paper/80 px-2 py-1 font-mono text-[10px] text-espresso/70">
          brak pliku: {resolved.expectedPath}
        </span>
      )}
    </div>
  );
}
