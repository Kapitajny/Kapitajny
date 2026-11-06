import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function robots(): MetadataRoute.Robots {
  if (!siteConfig.allowIndexing) {
    // Projekt demonstracyjny: indeksowanie wyłączone do czasu uzupełnienia prawdziwych danych.
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/", disallow: "/api/" }, sitemap: `${siteConfig.url}/sitemap.xml` };
}
