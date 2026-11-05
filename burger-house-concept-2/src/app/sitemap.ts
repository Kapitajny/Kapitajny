import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/regulamin", "/polityka-prywatnosci"].map((p) => ({ url: `${SITE.url}${p}`, lastModified: new Date() }));
}
