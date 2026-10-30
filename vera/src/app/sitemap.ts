import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { journal } from "@/data/journal";
import { treatments } from "@/data/treatments";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/about"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/treatments"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/specialists"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/journal"), changeFrequency: "weekly", priority: 0.6 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/book"), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/privacy-policy"), changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...pages,
    ...treatments.map((t) => ({ url: url(`/treatments/${t.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...journal.map((e) => ({ url: url(`/journal/${e.slug}`), lastModified: e.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
