import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import { IMAGE_DIR, IMAGES, type ImageKey, type ResolvedImage } from "@/config/images";
import type { Dictionary } from "@/i18n/dictionaries";

/** Sprawdza, czy plik z `config/images.ts` istnieje w `public/`. Brakujący dostaje `src: null`. */
export function resolveImage(key: ImageKey, dict: Dictionary): ResolvedImage {
  const definition: (typeof IMAGES)[ImageKey] & { focus?: string } = IMAGES[key];
  const publicPath = `${IMAGE_DIR}/${definition.file}`;
  const exists = existsSync(join(process.cwd(), "public", publicPath));
  return {
    src: exists ? publicPath : null,
    expectedPath: `public${publicPath}`,
    alt: dict.images[key],
    aspect: definition.aspect,
    placeholder: dict.common.placeholder,
    ...(definition.focus ? { focus: definition.focus } : {}),
  };
}
