import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Indeksowanie jest wyłączone, dopóki nie ma prawdziwych danych studia (NEXT_PUBLIC_ALLOW_INDEXING=true).
  return {
    rules: siteConfig.allowIndexing ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
