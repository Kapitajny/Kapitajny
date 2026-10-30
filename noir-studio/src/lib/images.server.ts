import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import { IMAGE_DIR, IMAGES, type ImageKey, type ResolvedImage } from "@/config/images";

/** Sprawdza, czy plik z `config/images.ts` istnieje w `public/`. Brakujący dostaje `src: null`. */
export function resolveImage(key: ImageKey): ResolvedImage {
  const definition: (typeof IMAGES)[ImageKey] & { focus?: string } = IMAGES[key];
  const publicPath = `${IMAGE_DIR}/${definition.file}`;
  const exists = existsSync(join(process.cwd(), "public", publicPath));
  return {
    src: exists ? publicPath : null,
    expectedPath: `public${publicPath}`,
    alt: definition.alt,
    aspect: definition.aspect,
    ...(definition.focus ? { focus: definition.focus } : {}),
  };
}
