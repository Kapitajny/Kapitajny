import type { MetadataRoute } from "next";
import { categories, collections, products } from "@/data/catalog";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  return [
    { url: url("/"), changeFrequency: "weekly", priority: 1 },
    { url: url("/sklep"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/nowosci"), changeFrequency: "weekly", priority: 0.8 },
    { url: url("/kolekcje"), changeFrequency: "monthly", priority: 0.6 },
    ...categories.flatMap((c) => [
      { url: url(`/kategoria/${c.slug}`), changeFrequency: "weekly" as const, priority: 0.9 },
      ...c.subcategories.map((s) => ({ url: url(`/kategoria/${c.slug}/${s.slug}`), changeFrequency: "weekly" as const, priority: 0.7 })),
    ]),
    ...collections.map((c) => ({ url: url(`/kolekcje/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.6 })),
    ...products.map((p) => ({ url: url(`/produkt/${p.slug}`), changeFrequency: "weekly" as const, priority: 0.8 })),
    ...["/kontakt", "/dostawa-i-zwroty", "/regulamin", "/polityka-prywatnosci"].map((path) => ({ url: url(path), changeFrequency: "yearly" as const, priority: 0.3 })),
  ];
}
