import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/** Bez ustawionego site.url (wersja robocza) blokujemy indeksowanie całej strony. */
export default function robots(): MetadataRoute.Robots {
  if (!site.url) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/sitemap.xml`,
  };
}
