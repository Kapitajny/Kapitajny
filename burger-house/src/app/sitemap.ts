import type { MetadataRoute } from "next";
import { LOCATIONS } from "@/data/locations";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${SITE.url}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    ...LOCATIONS.map((l) => ({ url: `${SITE.url}/lokale/${l.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 })),
    { url: `${SITE.url}/regulamin`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE.url}/polityka-prywatnosci`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];
}
