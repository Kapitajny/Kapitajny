import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { services } from "@/data/services";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "monthly" | "yearly" }[] = [
    { path: "", priority: 1, changeFrequency: "monthly" },
    { path: "/zabiegi", priority: 0.9, changeFrequency: "monthly" },
    { path: "/rezerwacja", priority: 0.9, changeFrequency: "yearly" },
    { path: "/o-klinice", priority: 0.7, changeFrequency: "yearly" },
    { path: "/zespol", priority: 0.7, changeFrequency: "monthly" },
    { path: "/galeria", priority: 0.5, changeFrequency: "monthly" },
    { path: "/kontakt", priority: 0.8, changeFrequency: "yearly" },
    { path: "/polityka-prywatnosci", priority: 0.2, changeFrequency: "yearly" },
  ];
  return [
    ...pages.map((p) => ({ url: `${siteConfig.url}${p.path}`, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...services.map((s) => ({ url: `${siteConfig.url}/zabiegi/${s.slug}`, changeFrequency: "monthly" as const, priority: 0.8 })),
  ];
}
