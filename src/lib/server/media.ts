import "server-only";

import { dirname, resolve } from "node:path";
import { getDbPath } from "./env";

/** Zdjęcia wgrane w panelu leżą obok bazy (domyślnie data/media) – poza katalogiem public/. */
export function getMediaDir(): string {
  const configured = process.env.MEDIA_DIR?.trim();
  if (configured) return resolve(/*turbopackIgnore: true*/ configured);
  const db = getDbPath();
  return resolve(/*turbopackIgnore: true*/ db === ":memory:" ? "data" : dirname(db), "media");
}
