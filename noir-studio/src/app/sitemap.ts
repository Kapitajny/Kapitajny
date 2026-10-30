import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { homePath, LOCALES } from "@/i18n/config";

export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(LOCALES.map((locale) => [locale, `${siteConfig.url}${homePath(locale)}`]));
  return LOCALES.map((locale) => ({
    url: `${siteConfig.url}${homePath(locale)}`,
    changeFrequency: "monthly",
    priority: locale === "pl" ? 1 : 0.8,
    alternates: { languages },
  }));
}
