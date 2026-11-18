import type { MetadataRoute } from "next";
import { site } from "@/data/site";

// Generowane w czasie budowania (wymagane także przy eksporcie statycznym).
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/o-nas", "/uslugi", "/kontakt", "/polityka-prywatnosci"];
  return pages.map((path) => ({
    url: `${site.url}${path}`,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : path === "/polityka-prywatnosci" ? 0.2 : 0.8,
  }));
}
