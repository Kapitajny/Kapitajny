import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  // Kept out of search engines until real studio details are in place (NEXT_PUBLIC_ALLOW_INDEXING=true).
  if (!site.allowIndexing) return { rules: { userAgent: "*", disallow: "/" } };
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml`, host: site.url };
}
