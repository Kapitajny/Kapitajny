import Image from "next/image";
import type { PlaceholderTone, ResolvedImage } from "@/config/images";

export interface PhotoViewProps {
  image: ResolvedImage;
  /** Atrybut `sizes` dla responsywnego ładowania. */
  sizes: string;
  className?: string;
  /** Zdjęcie widoczne od razu po wejściu (hero) – ładowane priorytetowo, bez lazy loadingu. */
  preload?: boolean;
  /** Ukrywa podpis kadru na planszy zastępczej (np. w małych miniaturach). */
  hideCaption?: boolean;
}

const toneClass: Record<PlaceholderTone, string> = {
  ivory: "bg-[#ece5da] text-taupe",
  blush: "bg-[#e3d2c8] text-taupe",
  sand: "bg-[#dccbbd] text-[#5a4d45]",
  dark: "bg-[#4b3f38] text-champagne-light",
};

/**
 * Prezentacja zdjęcia z mapy `config/images.ts`.
 * Kontener rodzica musi mieć wymiary i `position: relative` – obraz wypełnia go z `object-fit: cover`.
 * Gdy pliku nie ma, renderowana jest tonalna plansza imitująca miękkie światło dzienne, z opisem kadru.
 */
export function PhotoView({ image, sizes, className = "", preload, hideCaption }: PhotoViewProps) {
  if (image.src) {
    return <Image src={image.src} alt={image.alt} fill sizes={sizes} preload={preload} quality={85} className={`object-cover ${className}`} />;
  }

  return (
    <div
      role="img"
      aria-label={image.alt}
      data-missing-image={image.expectedPath}
      className={`photo-placeholder absolute inset-0 overflow-hidden ${toneClass[image.tone]} ${className}`}
    >
      {!hideCaption && (
        <span className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-2xs tracking-[0.02em] sm:bottom-5 sm:left-5" aria-hidden="true">
          <span className="h-px w-6 shrink-0 bg-current opacity-60" />
          <span className="truncate">{image.caption}</span>
        </span>
      )}
      {process.env.NODE_ENV === "development" && (
        <span className="absolute right-2 top-2 max-w-[70%] truncate bg-ivory/85 px-2 py-1 text-[10px] text-espresso/70" aria-hidden="true">
          brak pliku: {image.expectedPath}
        </span>
      )}
    </div>
  );
}
