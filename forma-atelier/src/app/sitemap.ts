import type { MetadataRoute } from "next";

import { projects } from "@/data/projects";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/o-pracowni", "/realizacje", "/oferta", "/proces", "/kontakt"];
  return [
    ...pages.map((p) => ({ url: `${site.url}${p}`, changeFrequency: "monthly" as const, priority: p === "" ? 1 : 0.8 })),
    ...projects.map((p) => ({ url: `${site.url}/realizacje/${p.slug}`, changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
