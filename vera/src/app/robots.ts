import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Indexing stays off until real studio details are in place (NEXT_PUBLIC_ALLOW_INDEXING=true).
  return {
    rules: siteConfig.allowIndexing ? { userAgent: "*", allow: "/" } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
