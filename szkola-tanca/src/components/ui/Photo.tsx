import Image from "next/image";
import { PHOTOS, type PhotoKey } from "@/config/photos";

interface PhotoProps {
  photo: PhotoKey;
  /** Atrybut `sizes` dla responsywnego ładowania (uwzględnij powiększenie `zoom`). */
  sizes: string;
  /** `object-position`, np. „60% 40%” – punkt, który ma pozostać w kadrze. */
  position?: string;
  /** Powiększenie kadru (np. 1.4) – pozwala wyciąć fragment zdjęcia bez osobnego pliku. */
  zoom?: number;
  preload?: boolean;
  className?: string;
  /** Nadpisanie tekstu alternatywnego (np. pusty dla zdjęć czysto dekoracyjnych). */
  alt?: string;
}

/**
 * Zdjęcie z mapy `config/photos.ts`. Rodzic musi mieć wymiary i `position: relative`
 * (np. `relative aspect-[4/5] overflow-hidden`) – obraz wypełnia go z `object-fit: cover`.
 */
export function Photo({ photo, sizes, position = "50% 50%", zoom = 1, preload, className = "", alt }: PhotoProps) {
  const { src, alt: defaultAlt } = PHOTOS[photo];
  return (
    <Image
      src={src}
      alt={alt ?? defaultAlt}
      fill
      sizes={sizes}
      preload={preload}
      placeholder="blur"
      className={`object-cover ${className}`}
      style={{ objectPosition: position, transform: zoom === 1 ? undefined : `scale(${zoom})`, transformOrigin: position }}
    />
  );
}

/** Miejsce na zdjęcie, którego jeszcze nie ma (np. styl bez pasujących materiałów). */
export function PhotoPlaceholder({ label, note }: { label: string; note: string }) {
  return (
    <div role="img" aria-label={`${label} – ${note}`} className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-blush p-8 text-center">
      <svg viewBox="0 0 120 120" className="w-24 text-rose" aria-hidden="true">
        <path d="M24 92c18-6 22-30 36-44s34-12 36-28" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="66" cy="24" r="7" fill="none" stroke="currentColor" strokeWidth="1.6" />
        <path d="M30 100h60" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
      <span className="font-serif text-4xl text-wine">{label}</span>
      <span className="max-w-[24ch] text-sm">{note}</span>
    </div>
  );
}
