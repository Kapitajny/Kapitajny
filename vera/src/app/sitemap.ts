import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { articles } from "@/data/journal";
import { treatments } from "@/data/treatments";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/treatments", "/specialists", "/journal", "/contact", "/book", "/privacy"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : p === "/privacy" ? 0.2 : 0.8 })),
    ...treatments.map((t) => ({ url: `${site.url}/treatments/${t.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
    ...articles.map((a) => ({ url: `${site.url}/journal/${a.slug}`, lastModified: a.date, changeFrequency: "yearly" as const, priority: 0.6 })),
  ];
}
