import { localePath, type Locale } from "./config";

/** Dokumenty prawne mają przetłumaczone adresy. */
export const legalDocs = ["privacy", "cookies", "terms", "booking"] as const;
export type LegalDoc = (typeof legalDocs)[number];

export const legalSlugs: Record<Locale, Record<LegalDoc, string>> = {
  pl: { privacy: "polityka-prywatnosci", cookies: "polityka-cookies", terms: "regulamin", booking: "regulamin-rezerwacji" },
  en: { privacy: "privacy-policy", cookies: "cookie-policy", terms: "terms", booking: "booking-terms" },
};

export const legalHref = (lang: Locale, doc: LegalDoc) => localePath(lang, `/${legalSlugs[lang][doc]}`);

export function docFromSlug(lang: Locale, slug: string): LegalDoc | null {
  return legalDocs.find((d) => legalSlugs[lang][d] === slug) ?? null;
}

/** Sekcje strony głównej – identyfikatory kotwic wspólne dla obu języków. */
export const sectionIds = ["start", "brzmienia", "o-nas", "uslugi", "realizacje", "cennik", "rezerwacja", "faq"] as const;
export type SectionId = (typeof sectionIds)[number];

/**
 * Ścieżka bez prefiksu języka. `usePathname()` może zwrócić adres wewnętrzny po przepisaniu
 * przez proxy (`/pl/regulamin`), dlatego usuwamy zarówno `/pl`, jak i `/en`.
 */
export const stripLocale = (pathname: string) => pathname.replace(/^\/(pl|en)(?=\/|$)/, "") || "/";

/** Odpowiednik bieżącego adresu w drugim języku. */
export function switchLocalePath(pathname: string, from: Locale, to: Locale): string {
  const rest = stripLocale(pathname);
  const slug = rest.split("/")[1] ?? "";
  const doc = docFromSlug(from, slug);
  if (doc) return legalHref(to, doc);
  return localePath(to, rest);
}
