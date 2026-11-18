import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url ?? "";
  return ["/", "/polityka-prywatnosci/", "/informacje-prawne/"].map((p) => ({ url: `${base}${p}` }));
}
