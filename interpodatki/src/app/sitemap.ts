import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { articles } from "@/data/articles";

const staticRoutes = [
  "/",
  "/ksiegowosc-jdg",
  "/ksiegowosc-spolki",
  "/doradztwo-podatkowe",
  "/kadry-place",
  "/cennik",
  "/kalkulator",
  "/wycena",
  "/o-nas",
  "/baza-wiedzy",
  "/kontakt",
  "/polityka-prywatnosci",
  "/regulamin",
  "/cookies",
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...staticRoutes.map((path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "/" ? 1 : path === "/kalkulator" || path === "/cennik" ? 0.9 : 0.6,
    })),
    ...articles.map((a) => ({
      url: `${siteConfig.url}/baza-wiedzy/${a.slug}`,
      lastModified: a.publishedAt,
      changeFrequency: "yearly" as const,
      priority: 0.5,
    })),
  ];
}
