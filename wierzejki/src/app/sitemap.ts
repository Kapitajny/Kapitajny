import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { jobOffers } from "@/content/careers";
import { allLocations } from "@/content/locations";
import { categories } from "@/content/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const staticPages: [string, number][] = [
    ["/", 1],
    ["/o-firmie", 0.7],
    ["/o-firmie/historia", 0.5],
    ["/produkty", 0.9],
    ["/dla-biznesu", 0.9],
    ["/jakosc-i-produkcja", 0.6],
    ["/siec-sprzedazy", 0.8],
    ["/kariera", 0.7],
    ["/kontakt", 0.8],
    ["/polityka-prywatnosci", 0.2],
  ];
  return [
    ...staticPages.map(([path, priority]) => ({ url: url(path), priority })),
    ...categories.map((c) => ({ url: url(`/produkty/${c.slug}`), priority: 0.8 })),
    ...allLocations.map((l) => ({ url: url(`/siec-sprzedazy/${l.slug}`), priority: 0.5 })),
    ...jobOffers.map((o) => ({ url: url(`/kariera/${o.slug}`), lastModified: o.publishedAt, priority: 0.6 })),
  ];
}
