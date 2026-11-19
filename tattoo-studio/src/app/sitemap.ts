import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { LOCALES, ROUTES, type RouteKey } from "@/i18n/config";

/** Mapa strony z obiema wersjami językowymi i powiązaniami hreflang. */
export default function sitemap(): MetadataRoute.Sitemap {
  const priority: Record<RouteKey, number> = { home: 1, booking: 0.8, terms: 0.3, privacy: 0.3 };
  return (Object.keys(ROUTES) as RouteKey[]).flatMap((route) =>
    LOCALES.map((lang) => ({
      url: `${siteConfig.url}${ROUTES[route].paths[lang]}`,
      changeFrequency: route === "home" ? ("monthly" as const) : ("yearly" as const),
      priority: lang === "pl" ? priority[route] : priority[route] * 0.9,
      alternates: {
        languages: Object.fromEntries(LOCALES.map((l) => [l === "pl" ? "pl-PL" : "en", `${siteConfig.url}${ROUTES[route].paths[l]}`])),
      },
    })),
  );
}
