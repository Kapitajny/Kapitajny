import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: site.allowIndexing ? { userAgent: "*", allow: "/", disallow: ["/panel", "/api/", "/rezerwacja/potwierdzenie"] } : { userAgent: "*", disallow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
