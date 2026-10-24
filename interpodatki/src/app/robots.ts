import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Wersja demonstracyjna domyślnie blokuje indeksowanie (NEXT_PUBLIC_ALLOW_INDEXING=false). */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/zamowienie", "/platnosc-demo", "/potwierdzenie", "/panel-demo"],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
