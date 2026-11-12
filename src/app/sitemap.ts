import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/rezerwacja", "/regulamin", "/zasady-wynajmu", "/polityka-prywatnosci", "/cookies"].map((path) => ({ url: `${site.url}${path}` }));
}
