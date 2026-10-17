import "server-only";

import { existsSync } from "node:fs";
import { join } from "node:path";
import { IMAGE_DIR, IMAGES, type ImageKey, type ImageManifest } from "@/config/images";

/**
 * Sprawdza, które zdjęcia z `config/images.ts` istnieją w `public/`.
 * Brakujące dostają `src: null` i są zastępowane placeholderem.
 */
export function getImageManifest(): ImageManifest {
  const manifest = {} as ImageManifest;
  for (const key of Object.keys(IMAGES) as ImageKey[]) {
    const { file, alt } = IMAGES[key];
    const publicPath = `${IMAGE_DIR}/${file}`;
    const exists = existsSync(join(process.cwd(), "public", publicPath));
    manifest[key] = { key, src: exists ? publicPath : null, expectedPath: `public${publicPath}`, alt };
  }
  return manifest;
}
