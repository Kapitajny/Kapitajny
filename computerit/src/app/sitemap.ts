import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { projects } from "@/data/projects";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteConfig.url, changeFrequency: "monthly", priority: 1 },
    ...projects.map((project) => ({ url: `${siteConfig.url}/portfolio/${project.slug}`, changeFrequency: "yearly" as const, priority: 0.6 })),
    { url: `${siteConfig.url}/polityka-prywatnosci`, changeFrequency: "yearly", priority: 0.2 },
  ];
}
