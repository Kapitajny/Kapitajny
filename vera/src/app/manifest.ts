import type { MetadataRoute } from "next";
import { site } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.fullName,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: "#f4efe8",
    theme_color: "#481e2c",
    lang: "en",
    icons: [{ src: "/icon", sizes: "512x512", type: "image/png" }],
  };
}
