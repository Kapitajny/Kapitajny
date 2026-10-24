import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

export function pageMetadata({
  title,
  description,
  path,
  noindex = false,
}: {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: siteConfig.name,
      title: `${title} | ${siteConfig.name}`,
      description,
      url: path,
    },
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
  };
}

export function absoluteUrl(path: string): string {
  return `${siteConfig.url}${path}`;
}

/** Bezpieczna serializacja JSON-LD (znak „<” zamieniony na sekwencję Unicode). */
export function jsonLdString(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
