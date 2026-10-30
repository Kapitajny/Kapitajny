import "server-only";

import type { Locale } from "./config";
import { en } from "./en";
import { pl, type Dictionary } from "./pl";

const dictionaries: Record<Locale, Dictionary> = { pl, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export type { Dictionary };
