import { siteConfig } from "@/config/site";

/**
 * Dane strukturalne (schema.org) dla lokalnego SEO.
 * Generujemy je wyłącznie z potwierdzonych danych z config/site.ts – bez kwalifikacji, ocen ani opinii.
 * Dopóki adres i telefon nie są uzupełnione, zwracamy `null` (brak danych strukturalnych).
 */
export function getLocalBusinessJsonLd(): Record<string, unknown> | null {
  const { street, postalCode, city } = siteConfig.address;
  const { phone, email } = siteConfig.contact;
  if (!street || !postalCode || !city || !phone) return null;

  return {
    "@context": "https://schema.org",
    "@type": "Physiotherapy",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/images/brand/logo-znak.png`,
    telephone: phone,
    ...(email ? { email } : {}),
    address: {
      "@type": "PostalAddress",
      streetAddress: street,
      postalCode,
      addressLocality: city,
      addressCountry: "PL",
    },
  };
}

/** Bezpieczne osadzenie JSON-LD w <script> (zamiana „<” zapobiega wstrzyknięciu HTML). */
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
