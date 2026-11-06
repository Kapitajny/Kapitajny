import type { Metadata } from "next";
import { siteConfig } from "@/config/site";

/** Metadane podstrony: tytuł, opis, kanoniczny adres i Open Graph. */
export function pageMetadata({ title, description, path }: { title: string; description: string; path: string }): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title: `${title} | ${siteConfig.name}`, description, url: path },
  };
}

/** Dane strukturalne organizacji (schema.org) – bez fikcyjnych numerów rejestrowych. */
export function organizationJsonLd() {
  const { contact } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalOrganization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
    image: `${siteConfig.url}/images/flota/baner-ambulans.webp`,
    description: siteConfig.description,
    telephone: contact.phoneDisplay.replace(/\s/g, ""),
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.street,
      postalCode: contact.postalCode,
      addressLocality: contact.city,
      addressRegion: contact.region,
      addressCountry: "PL",
    },
    areaServed: { "@type": "Country", name: "Polska" },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
  };
}
