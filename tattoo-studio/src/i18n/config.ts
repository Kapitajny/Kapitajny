/**
 * KONFIGURACJA JĘZYKÓW
 *
 * Polski jest językiem domyślnym i nie ma prefiksu w adresie. Kolejne języki mają prefiks (`/en`).
 * Aby dodać język: dopisz go do `LOCALES`, dodaj ścieżki w `ROUTES`, słownik w `dictionaries/`
 * i reguły w `next.config.ts` (generowane z tych samych danych).
 */

export const LOCALES = ["pl", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "pl";

/** Nazwa ciasteczka z wybranym językiem (preferencja funkcjonalna, ustawiana tylko po wyborze użytkownika). */
export const LOCALE_COOKIE = "lang";
export const LOCALE_STORAGE_KEY = "preferred-language";

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (LOCALES as readonly string[]).includes(value);
}

/** Strony serwisu: klucz trasy → wewnętrzny segment (folder w `app/[lang]`) i publiczne adresy w każdym języku. */
export const ROUTES = {
  home: { segment: "", paths: { pl: "/", en: "/en" } },
  booking: { segment: "booking", paths: { pl: "/rezerwacja", en: "/en/booking" } },
  terms: { segment: "terms", paths: { pl: "/regulamin", en: "/en/terms" } },
  privacy: { segment: "privacy", paths: { pl: "/polityka-prywatnosci", en: "/en/privacy" } },
} as const satisfies Record<string, { segment: string; paths: Record<Locale, string> }>;

export type RouteKey = keyof typeof ROUTES;

export const OPEN_GRAPH_LOCALE: Record<Locale, string> = { pl: "pl_PL", en: "en_GB" };
export const INTL_LOCALE: Record<Locale, string> = { pl: "pl-PL", en: "en-GB" };

/** Publiczny adres strony w danym języku, opcjonalnie z kotwicą (`#gallery`) i parametrami. */
export function localizedPath(route: RouteKey, locale: Locale, hash?: string, query?: string): string {
  const base = ROUTES[route].paths[locale];
  return `${base}${query ? `?${query}` : ""}${hash ? `#${hash}` : ""}`;
}

/** Rozpoznaje stronę po publicznym adresie (w dowolnym języku). */
export function routeFromPath(pathname: string): { route: RouteKey; locale: Locale } | null {
  const clean = pathname.replace(/\/+$/, "") || "/";
  for (const [route, def] of Object.entries(ROUTES) as [RouteKey, (typeof ROUTES)[RouteKey]][]) {
    for (const locale of LOCALES) {
      if (def.paths[locale] === clean) return { route, locale };
    }
  }
  return null;
}
