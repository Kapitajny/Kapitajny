import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import { IMAGE_DIR, IMAGES, type ImageKey, type ResolvedImage } from "@/config/images";

const cache = new Map<ImageKey, ResolvedImage>();

/**
 * Sprawdza, czy zdjęcie z `config/images.ts` istnieje w `public/`.
 * Brakujące dostaje `src: null` i jest zastępowane planszą w kolorystyce marki.
 */
export function resolveImage(key: ImageKey): ResolvedImage {
  const cached = cache.get(key);
  if (cached && process.env.NODE_ENV === "production") return cached;

  const { file, alt, caption, tone } = IMAGES[key];
  const publicPath = `${IMAGE_DIR}/${file}`;
  const exists = existsSync(join(process.cwd(), "public", publicPath));
  const resolved: ResolvedImage = { key, src: exists ? publicPath : null, expectedPath: `public${publicPath}`, alt, caption, tone };
  cache.set(key, resolved);
  return resolved;
}
