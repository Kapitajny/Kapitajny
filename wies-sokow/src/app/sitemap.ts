import type { MetadataRoute } from "next";

export const dynamic = "force-static";
import { products } from "@/data/products";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/o-nas", "/produkcja", "/sklep", "/kontakt"].map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.7,
  }));
  const items = products.map((product) => ({
    url: `${site.url}/sklep/${product.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...pages, ...items];
}
