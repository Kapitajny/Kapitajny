import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { LOCALES, OPEN_GRAPH_LOCALE, ROUTES, isLocale, type Locale, type RouteKey } from "./config";
import { getDictionary } from "./dictionaries";
import { pageTitle } from "./meta";

/** Metadane strony w danym języku: tytuł, opis, adres kanoniczny i alternatywne wersje językowe (hreflang). */
export function buildMetadata(lang: Locale, route: RouteKey): Metadata {
  const t = getDictionary(lang);
  const description = route === "home" ? t.meta.description : t.meta.pages[route].description;
  const title = pageTitle(t, route);
  const languages = Object.fromEntries(LOCALES.map((l) => [l === "pl" ? "pl-PL" : "en", ROUTES[route].paths[l]]));
  return {
    metadataBase: new URL(siteConfig.url),
    title: { absolute: title },
    description,
    keywords: t.meta.keywords,
    applicationName: siteConfig.name,
    alternates: {
      canonical: ROUTES[route].paths[lang],
      languages: { ...languages, "x-default": ROUTES[route].paths.pl },
    },
    openGraph: {
      type: "website",
      locale: OPEN_GRAPH_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OPEN_GRAPH_LOCALE[l]),
      siteName: siteConfig.name,
      title,
      description,
      url: ROUTES[route].paths[lang],
    },
    robots: siteConfig.allowIndexing ? { index: true, follow: true } : { index: false, follow: false },
  };
}

export async function resolveLocale(params: Promise<{ lang: string }>): Promise<Locale> {
  const { lang } = await params;
  return isLocale(lang) ? lang : "pl";
}
