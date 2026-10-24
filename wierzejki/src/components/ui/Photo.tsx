import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import Image from "next/image";
import { MEDIA, MEDIA_DIR, type MediaDefinition, type MediaKey } from "@/content/media";
import { siteConfig } from "@/config/site";

interface PhotoProps {
  media: MediaKey;
  /** Atrybut `sizes` dla responsywnego ładowania. */
  sizes: string;
  className?: string;
  /** Zdjęcie widoczne od razu po wejściu (hero) – ładowane priorytetowo. */
  preload?: boolean;
  tone?: "light" | "dark";
}

/** Ścieżka publiczna zdjęcia albo `null`, jeśli pliku jeszcze nie ma w `public/`. */
export function resolveMedia(media: MediaKey): string | null {
  const publicPath = `${MEDIA_DIR}/${MEDIA[media].file}`;
  return existsSync(join(process.cwd(), "public", publicPath)) ? publicPath : null;
}

/**
 * Zdjęcie z mapy `content/media.ts`. Rodzic musi mieć wymiary i `position: relative`
 * (np. `relative aspect-[4/5]`). Brakujący plik zastępuje plansza z opisem kadru.
 */
export function Photo({ media, sizes, className = "", preload, tone = "light" }: PhotoProps) {
  const definition: MediaDefinition = MEDIA[media];
  const src = resolveMedia(media);

  if (src && definition.fit === "contain") {
    // Zdjęcie produktu na białym tle: całe opakowanie, bez kadrowania, na białej planszy.
    return (
      <div className="absolute inset-0 bg-white">
        <Image src={src} alt={definition.alt} fill sizes={sizes} preload={preload} className={`object-contain p-[7%] ${className}`} />
      </div>
    );
  }

  if (src) {
    return (
      <Image
        src={src}
        alt={definition.alt}
        fill
        sizes={sizes}
        preload={preload}
        className={`object-cover ${className}`}
        style={definition.position ? { objectPosition: definition.position } : undefined}
      />
    );
  }

  const dark = tone === "dark";
  return (
    <div
      role="img"
      aria-label={definition.alt}
      data-missing-media={`public${MEDIA_DIR}/${definition.file}`}
      className={`absolute inset-0 flex items-end overflow-hidden ${dark ? "photo-slot-dark text-on-dark/70" : "photo-slot text-muted"} ${className}`}
    >
      {siteConfig.demoMode && (
        <span className="ui m-3 max-w-[22rem] bg-surface/90 px-3 py-2 text-[0.75rem] leading-snug text-ink sm:m-4">
          <span className="font-semibold">Miejsce na zdjęcie{definition.mustBeAuthentic ? " z zakładu" : ""}.</span> {definition.brief}.
        </span>
      )}
    </div>
  );
}
