import type { MetadataRoute } from "next";
import { legalNav, mainNav, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...mainNav.map((item) => ({
      url: `${siteConfig.url}${item.href}`,
      changeFrequency: "monthly" as const,
      priority: item.href === "/" ? 1 : 0.8,
    })),
    ...legalNav.map((item) => ({ url: `${siteConfig.url}${item.href}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
