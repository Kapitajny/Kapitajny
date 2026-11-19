export const locales = ["pl", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "pl";

export const hasLocale = (value: string): value is Locale => (locales as readonly string[]).includes(value);

/** Treść dwujęzyczna w danych (usługi, cennik, utwory…). */
export type Localized<T = string> = Record<Locale, T>;

/**
 * Publiczny adres strony w danym języku. Polski jest domyślny i nie ma prefiksu:
 * `/` i `/regulamin` (PL), `/en` i `/en/terms` (EN).
 */
export function localePath(lang: Locale, path = "/"): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (lang === defaultLocale) return clean;
  return clean === "/" ? `/${lang}` : `/${lang}${clean}`;
}

export const htmlLang: Record<Locale, string> = { pl: "pl-PL", en: "en-GB" };
