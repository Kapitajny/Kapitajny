import type { Metadata } from "next";
import { siteConfig } from "@/content/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Dla stron głównych sekcji tytuł bez dopisku marki ustawia szablon w layoucie. */
  absoluteTitle?: boolean;
  type?: "website" | "article";
};

export function pageMetadata({ title, description, path, absoluteTitle, type = "website" }: PageMetaInput): Metadata {
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: path,
      title,
      description,
      // Obraz z app/opengraph-image.tsx – podany jawnie, bo openGraph strony zastępuje ustawienia z layoutu.
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Rygiel – obsługa IT i cyberbezpieczeństwo dla firm" }],
    },
  };
}

export function absoluteUrl(path: string): string {
  return new URL(path, `${siteConfig.url}/`).toString();
}
