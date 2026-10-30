import Image from "next/image";
import type { ResolvedImage } from "@/config/images";
import styles from "./Photo.module.css";

interface PhotoProps {
  image: ResolvedImage;
  /** Atrybut `sizes` dla responsywnego ładowania. */
  sizes: string;
  /** Zdjęcie widoczne od razu po wejściu (hero) – ładowane priorytetowo. */
  preload?: boolean;
  /** Dopasowanie kadru: `cover` (domyślnie) wypełnia ramkę, `contain` pokazuje całe zdjęcie. */
  fit?: "cover" | "contain";
  /** Podpis placeholdera, gdy pliku jeszcze nie ma (np. kategoria). */
  label?: string;
  tone?: "light" | "dark";
  className?: string;
}

/**
 * Zdjęcie z centralnej mapy `config/images.ts`. Rodzic musi mieć wymiary i `position: relative`.
 * Gdy pliku brakuje, pokazujemy passe-partout w barwach marki z opisem planowanego kadru.
 */
export function Photo({ image, sizes, preload, fit = "cover", label, tone = "light", className = "" }: PhotoProps) {
  if (image.src) {
    return (
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes={sizes}
        preload={preload}
        quality={85}
        className={`${styles.image} ${className}`}
        style={{ objectFit: fit, objectPosition: fit === "cover" ? image.focus : undefined }}
      />
    );
  }

  return (
    <div role="img" aria-label={image.alt} data-missing-image={image.expectedPath} className={`${styles.placeholder} ${styles[tone]} ${className}`}>
      <svg className={styles.aperture} viewBox="0 0 48 48" aria-hidden="true">
        <circle cx="24" cy="24" r="21" />
        <path d="M24 3 L33 21 M45 24 L27 33 M24 45 L15 27 M3 24 L21 15 M39 9 L30 27 M9 39 L18 21" />
      </svg>
      {label && <span className={styles.label}>{label}</span>}
      <span className={styles.note}>{image.placeholder}</span>
      {process.env.NODE_ENV === "development" && <span className={styles.path}>{image.expectedPath}</span>}
    </div>
  );
}
