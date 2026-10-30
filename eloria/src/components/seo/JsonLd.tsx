import { siteConfig } from "@/config/site";

/** Dane strukturalne schema.org. Znak `<` jest zamieniany, by treść nie mogła zamknąć znacznika <script>. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function clinicJsonLd() {
  const { contact } = siteConfig;
  return {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    name: siteConfig.fullName,
    slogan: siteConfig.tagline,
    description: siteConfig.description,
    url: siteConfig.url,
    logo: `${siteConfig.url}/brand/eloria-logo.png`,
    image: `${siteConfig.url}/images/eloria/highlight-treatment-room.jpg`,
    telephone: contact.phoneHref.replace("tel:", ""),
    email: contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: contact.street,
      postalCode: contact.postalCode,
      addressLocality: contact.city,
      addressCountry: "PL",
    },
    openingHoursSpecification: siteConfig.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.dayCodes,
      opens: h.opens,
      closes: h.closes,
    })),
    medicalSpecialty: ["Dermatologic"],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${siteConfig.url}${item.path}` })),
  };
}
