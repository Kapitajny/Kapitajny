import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/**
 * Koncepcja nie powinna trafić do wyszukiwarek: indeksowanie jest zablokowane,
 * dopóki NEXT_PUBLIC_ALLOW_INDEXING nie zostanie ustawione na "true" (wyłącznie w wersji opublikowanej przez firmę).
 */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.allowIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
