import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

/** Indeksowanie jest wyłączone, dopóki NEXT_PUBLIC_ALLOW_INDEXING nie zostanie ustawione na "true". */
export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.allowIndexing) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/", "/zamowienie"] },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
