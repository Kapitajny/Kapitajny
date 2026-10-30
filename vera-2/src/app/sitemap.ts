import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { journal } from "@/data/journal";
import { treatments } from "@/data/treatments";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${siteConfig.url}${path}`;
  const pages: MetadataRoute.Sitemap = [
    { url: url("/"), changeFrequency: "monthly", priority: 1 },
    { url: url("/o-nas"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/zabiegi"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/specjalisci"), changeFrequency: "yearly", priority: 0.6 },
    { url: url("/magazyn"), changeFrequency: "weekly", priority: 0.6 },
    { url: url("/kontakt"), changeFrequency: "yearly", priority: 0.7 },
    { url: url("/konsultacja"), changeFrequency: "yearly", priority: 0.8 },
    { url: url("/polityka-prywatnosci"), changeFrequency: "yearly", priority: 0.2 },
  ];
  return [
    ...pages,
    ...treatments.map((t) => ({ url: url(`/zabiegi/${t.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...journal.map((e) => ({ url: url(`/magazyn/${e.slug}`), lastModified: e.date, changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
