import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Portfolio } from "@/components/sections/Portfolio";
import { Promo } from "@/components/sections/Promo";
import { Services } from "@/components/sections/Services";
import { siteConfig } from "@/config/site";
import { services } from "@/data/offer";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  ...(siteConfig.contact.email ? { email: siteConfig.contact.email } : {}),
  ...(siteConfig.contact.phone ? { telephone: siteConfig.contact.phone } : {}),
  makesOffer: services.map((service) => ({
    "@type": "Offer",
    name: service.name,
    description: service.description,
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: service.price,
      priceCurrency: "PLN",
      valueAddedTaxIncluded: false,
    },
  })),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Hero />
      <About />
      <Services />
      <Portfolio />
      <Promo />
      <Contact />
    </>
  );
}
