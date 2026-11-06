import type { MetadataRoute } from "next";
import { legalNav, mainNav, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const main = mainNav.map((item) => ({
    url: `${siteConfig.url}${item.href === "/" ? "" : item.href}`,
    changeFrequency: "monthly" as const,
    priority: item.href === "/" ? 1 : 0.8,
  }));
  const legal = legalNav.map((item) => ({ url: `${siteConfig.url}${item.href}`, changeFrequency: "yearly" as const, priority: 0.3 }));
  return [...main, ...legal];
}
