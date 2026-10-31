import type { MetadataRoute } from "next";
import { legalNav, siteConfig } from "@/config/site";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteConfig.url}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteConfig.url}/sklep`, changeFrequency: "weekly", priority: 0.9 },
    ...products.map((p) => ({ url: `${siteConfig.url}/sklep/${p.slug}`, changeFrequency: "weekly" as const, priority: p.featured ? 0.9 : 0.6 })),
    { url: `${siteConfig.url}/kontakt`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${siteConfig.url}/pobieranie`, changeFrequency: "yearly", priority: 0.3 },
    ...legalNav.map((item) => ({ url: `${siteConfig.url}${item.href}`, changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
