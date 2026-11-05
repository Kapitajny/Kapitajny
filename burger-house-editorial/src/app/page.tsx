import { About } from "@/components/home/About";
import { Contact } from "@/components/home/Contact";
import { Hero } from "@/components/home/Hero";
import { Menu } from "@/components/home/Menu";
import { Picks } from "@/components/home/Picks";
import { Places } from "@/components/home/Places";
import { Plate } from "@/components/home/Plate";
import { Promos } from "@/components/home/Promos";
import { LOCATIONS } from "@/data/locations";
import { CATEGORIES, MENU } from "@/data/menu";
import { SITE } from "@/data/site";

function jsonLd() {
  const menu = {
    "@type": "Menu",
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
    "@graph": LOCATIONS.map((l) => ({
      "@type": "Restaurant",
      name: `${SITE.name} – ${l.city}`,
      telephone: l.phone.display,
      servesCuisine: ["Burgery"],
      priceRange: "25–85 zł",
      address: { "@type": "PostalAddress", streetAddress: l.street, postalCode: l.postalCode.split(" ")[0], addressLocality: l.city, addressCountry: "PL" },
      openingHoursSpecification: l.hours.map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days, opens: h.opens, closes: h.closes === "24:00" ? "23:59" : h.closes })),
      hasMenu: menu,
    })),
  };
}

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd()).replace(/</g, "\\u003c") }} />
      <Hero />
      <Plate />
      <Picks />
      <About />
      <Menu />
      <Promos />
      <Places />
      <Contact />
    </>
  );
}
