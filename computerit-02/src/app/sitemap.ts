import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

const pages: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "/uslugi", priority: 0.9 },
  { path: "/strony-internetowe", priority: 0.9 },
  { path: "/sklepy-internetowe", priority: 0.9 },
  { path: "/realizacje", priority: 0.8 },
  { path: "/o-nas", priority: 0.6 },
  { path: "/kontakt", priority: 0.8 },
  { path: "/regulamin-uslug", priority: 0.2 },
  { path: "/regulamin-platnosci", priority: 0.2 },
  { path: "/polityka-prywatnosci", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({ url: `${siteConfig.url}${page.path}`, changeFrequency: "monthly", priority: page.priority }));
}
