import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Do czasu wpisania prawdziwych danych kliniki (NEXT_PUBLIC_ALLOW_INDEXING=true) strona nie jest indeksowana.
  if (!siteConfig.allowIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
