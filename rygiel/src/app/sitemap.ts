import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { allRoutes } from "@/lib/routes";
import { absoluteUrl } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const articleDates = new Map(articles.map((article) => [`/baza-wiedzy/${article.slug}`, article.updated]));
  return allRoutes().map((path) => ({
    url: absoluteUrl(path),
    ...(articleDates.has(path) ? { lastModified: articleDates.get(path) } : {}),
    changeFrequency: path.startsWith("/polityka") || path === "/regulamin" ? "yearly" : "monthly",
    priority: path === "/" ? 1 : path.split("/").length === 2 ? 0.8 : 0.6,
  }));
}
