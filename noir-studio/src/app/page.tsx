import { siteConfig } from "@/config/site";
import { SERVICES } from "@/data/services";
import { resolveImage } from "@/lib/images.server";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: siteConfig.name,
  description: siteConfig.description,
  url: siteConfig.url,
  address: { "@type": "PostalAddress", addressLocality: "Warszawa", addressCountry: "PL" },
  areaServed: ["Poland", "Europe"],
  ...(siteConfig.email ? { email: siteConfig.email } : {}),
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Photography services",
    itemListElement: SERVICES.map((service) => ({
      "@type": "Offer",
      itemOffered: { "@type": "Service", name: service.name, description: service.description },
    })),
  },
};

export default function HomePage() {
  // Na stronie jest tylko jedno <main>; Hero należy do treści, aby link „Skip to content” trafiał na początek.
  return (
    <>
      <main id="main" tabIndex={-1}>
        <Hero image={resolveImage("heroDusk")} />
        <Portfolio />
        <About portrait={resolveImage("aboutPortrait")} />
        <Services />
        <Contact image={resolveImage("cameraSunset")} inquiriesEnabled={Boolean(process.env.INQUIRY_WEBHOOK_URL?.trim())} />
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
