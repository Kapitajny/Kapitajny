import { About } from "@/components/home/About";
import { Bestsellers } from "@/components/home/Bestsellers";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Locations } from "@/components/home/Locations";
import { Menu } from "@/components/home/Menu";
import { Promo } from "@/components/home/Promo";
import { LOCATIONS } from "@/data/locations";
import { CATEGORIES, MENU } from "@/data/menu";
import { SITE } from "@/data/site";

function structuredData() {
  const menu = {
    "@type": "Menu",
    name: `Menu ${SITE.name}`,
    hasMenuSection: CATEGORIES.map((c) => ({
      "@type": "MenuSection",
      name: c.label,
      hasMenuItem: MENU.filter((m) => m.category === c.id).map((m) => ({
        "@type": "MenuItem",
        name: m.name,
        description: m.description,
        offers: { "@type": "Offer", price: (m.price / 100).toFixed(2), priceCurrency: "PLN" },
      })),
    })),
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE.url}/#marka`,
        name: SITE.name,
        slogan: SITE.slogan,
        url: SITE.url,
        telephone: SITE.phone.display,
        foundingDate: String(SITE.founded),
      },
      ...LOCATIONS.map((loc) => ({
        "@type": "Restaurant",
        "@id": `${SITE.url}/lokale/${loc.slug}#lokal`,
        name: `${SITE.name} – ${loc.city}`,
        url: `${SITE.url}/lokale/${loc.slug}`,
        image: `${SITE.url}${loc.image.src}`,
        telephone: loc.phone.display,
        servesCuisine: ["Burgery", "Amerykańska"],
        priceRange: "25–85 zł",
        acceptsReservations: false,
        parentOrganization: { "@id": `${SITE.url}/#marka` },
        address: {
          "@type": "PostalAddress",
          streetAddress: loc.street,
          postalCode: loc.postalCode.split(" ")[0],
          addressLocality: loc.city,
          addressCountry: "PL",
        },
        openingHoursSpecification: loc.hours.map((h) => ({
          "@type": "OpeningHoursSpecification",
          dayOfWeek: h.days,
          opens: h.opens,
          closes: h.closes === "24:00" ? "23:59" : h.closes,
        })),
        hasMenu: menu,
      })),
    ],
  };
}

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c") }} />
      <Hero />
      <Bestsellers />
      <Promo />
      <Menu />
      <About />
      <Locations />
      <Contact />
    </>
  );
}
