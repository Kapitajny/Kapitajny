import { site } from "@/config/site";
import { packages } from "@/config/pricing";
import { services } from "@/data/services";
import { SiteNav } from "@/components/layout/SiteNav";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { Hero } from "@/components/sections/Hero";
import { Mission } from "@/components/sections/Mission";
import { Services } from "@/components/sections/Services";
import { Portfolio } from "@/components/sections/Portfolio";
import { CaseStudies } from "@/components/sections/CaseStudies";
import { AgencyStats } from "@/components/sections/AgencyStats";
import { Process } from "@/components/sections/Process";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { Contact } from "@/components/sections/Contact";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.fullName,
  slogan: site.tagline,
  description: site.description,
  ...(site.url ? { url: site.url } : {}),
  areaServed: "PL",
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Obsługa kampanii reklamowych",
    itemListElement: packages.map((p) => ({
      "@type": "Offer",
      name: `Pakiet ${p.name}`,
      description: `${p.platformsLabel}. ${p.summary}`,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: p.priceNet,
        priceCurrency: "PLN",
        unitText: "miesiąc",
        valueAddedTaxIncluded: false,
      },
    })),
  },
  knowsAbout: services.map((s) => s.name),
};

export default function Home() {
  return (
    <>
      <SiteNav />
      <main id="tresc">
        <Hero />
        <Mission />
        <Services />
        <Portfolio />
        <CaseStudies />
        <AgencyStats />
        <Process />
        <Testimonials />
        <Pricing />
        <Faq />
        <Contact />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </>
  );
}
