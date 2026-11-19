import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { legalDocs, legalHref } from "@/i18n/routes";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;
  return [
    {
      url: url("/"),
      changeFrequency: "weekly",
      priority: 1,
      alternates: { languages: { "pl-PL": url("/"), "en-GB": url("/en") } },
    },
    {
      url: url("/en"),
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: { languages: { "pl-PL": url("/"), "en-GB": url("/en") } },
    },
    ...legalDocs.map((doc) => ({
      url: url(legalHref("pl", doc)),
      changeFrequency: "yearly" as const,
      priority: 0.2,
      alternates: { languages: { "pl-PL": url(legalHref("pl", doc)), "en-GB": url(legalHref("en", doc)) } },
    })),
  ];
}
