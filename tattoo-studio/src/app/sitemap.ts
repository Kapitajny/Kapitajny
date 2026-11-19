import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/rezerwacja", "/regulamin", "/polityka-prywatnosci"].map((path) => ({
    url: `${siteConfig.url}${path}`,
    changeFrequency: path === "" ? "monthly" : "yearly",
    priority: path === "" ? 1 : path === "/rezerwacja" ? 0.8 : 0.3,
  }));
}
