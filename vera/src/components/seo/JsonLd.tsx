import { siteConfig } from "@/config/site";

/** Structured data. `<` is escaped so content can never close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function studioJsonLd() {
  const { contact, address, hours } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: siteConfig.fullName,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    image: `${siteConfig.url}/images/vera/hero-portrait.jpg`,
    telephone: contact.phone,
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: address.street,
      postalCode: address.postalCode,
      addressLocality: address.city,
      addressCountry: address.country,
    },
    openingHours: hours.map((h) => h.schema).filter(Boolean),
    sameAs: [contact.instagramUrl],
  };
}

export function breadcrumbJsonLd(items: { href: string; label: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}
