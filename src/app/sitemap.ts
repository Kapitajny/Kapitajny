import type { MetadataRoute } from "next";
import { legalNav, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/morelowa`, changeFrequency: "monthly", priority: 0.8 },
    ...legalNav.map((item) => ({ url: `${siteConfig.url}${item.href}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
