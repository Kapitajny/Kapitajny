import { site } from "@/config/site";

/** schema.org structured data; `<` is escaped so content can't close the script tag. */
export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function studioJsonLd() {
  const { contact } = site;
  return {
    "@context": "https://schema.org",
    "@type": ["MedicalClinic", "BeautySalon"],
    name: site.fullName,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone: contact.phoneHref.replace("tel:", ""),
    email: contact.email,
    address: { "@type": "PostalAddress", streetAddress: contact.street, postalCode: contact.postalCode, addressLocality: contact.city, addressCountry: "PL" },
    openingHoursSpecification: site.hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes })),
    sameAs: [contact.instagramUrl],
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: `${site.url}${item.path}` })),
  };
}
