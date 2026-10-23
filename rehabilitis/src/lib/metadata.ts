import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/**
 * Metadane podstrony: tytuł, opis, adres kanoniczny i Open Graph z tym samym tytułem.
 * (Obiekt `openGraph` z layoutu nie łączy się z obiektem podstrony, dlatego budujemy go tutaj w całości.)
 */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "pl_PL",
      siteName: siteConfig.name,
      url: path,
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}
