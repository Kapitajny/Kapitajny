import type { MetadataRoute } from "next";
import { legalNav, siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, changeFrequency: "monthly", priority: 1 },
    ...legalNav.map((item) => ({ url: `${siteConfig.url}${item.href}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
