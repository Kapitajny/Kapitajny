import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/lokale/warszawa", "/lokale/grodzisk-mazowiecki", "/regulamin", "/polityka-prywatnosci"].map((p) => ({
    url: `${SITE.url}${p}`,
    lastModified: new Date(),
  }));
}
