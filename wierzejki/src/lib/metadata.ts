import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Metadane podstrony: unikalny tytuł, opis, adres kanoniczny i Open Graph. */
export function pageMetadata({ title, description, path, noindex }: { title: string; description: string; path: string; noindex?: boolean }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${siteConfig.name}`, description, url: path, type: "website", locale: "pl_PL", siteName: siteConfig.name },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}
