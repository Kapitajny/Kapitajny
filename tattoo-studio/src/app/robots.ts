import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  return siteConfig.allowIndexing
    ? { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${siteConfig.url}/sitemap.xml` }
    : { rules: { userAgent: "*", disallow: "/" } };
}
