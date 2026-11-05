import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    // Wersje demonstracyjne fikcyjnych marek nie powinny trafiać do wyników wyszukiwania.
    rules: siteConfig.allowIndexing ? { userAgent: "*", allow: "/", disallow: ["/api/", "/demo/"] } : { userAgent: "*", disallow: "/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
