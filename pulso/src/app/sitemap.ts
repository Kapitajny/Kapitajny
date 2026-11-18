import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

/** Mapa strony wymaga adresów bezwzględnych, więc powstaje dopiero po ustawieniu site.url. */
export default function sitemap(): MetadataRoute.Sitemap {
  if (!site.url) return [];
  const base = `${site.url}${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}`;
  return ["/", "/polityka-prywatnosci/", "/informacje-prawne/"].map((p) => ({ url: `${base}${p}` }));
}
