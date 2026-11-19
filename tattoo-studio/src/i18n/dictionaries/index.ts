import type { Locale } from "../config";
import { en } from "./en";
import { pl, type Dictionary } from "./pl";

export type { Dictionary };

export const DICTIONARIES: Record<Locale, Dictionary> = { pl, en };

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale];
}
