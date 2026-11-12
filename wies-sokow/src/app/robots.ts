import type { MetadataRoute } from "next";
import { site } from "@/data/site";

export default function robots(): MetadataRoute.Robots {
  if (!site.allowIndexing) {
    // Projekt demonstracyjny z fikcyjnymi danymi – domyślnie poza indeksem wyszukiwarek.
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/koszyk", "/zamowienie"] }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
