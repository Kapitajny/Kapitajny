import { About } from "@/components/home/About";
import { Faq } from "@/components/home/Faq";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Pricing } from "@/components/home/Pricing";
import { Reviews } from "@/components/home/Reviews";
import { Specialties } from "@/components/home/Specialties";
import { Footer } from "@/components/layout/Footer";
import { Dock } from "@/components/nav/Dock";
import { siteConfig } from "@/config/site";

function StructuredData() {
  const { contact, social } = siteConfig;
  const data = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressCountry: "PL", ...(contact.address ? { streetAddress: contact.address } : {}) },
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    sameAs: Object.values(social).filter(Boolean),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export default function HomePage() {
  return (
    <>
      <StructuredData />
      <main id="main" className="pb-[var(--dock-space)] [&>*:last-child]:mb-0">
        <Hero />
        <Gallery />
        <About />
        <Specialties />
        <Reviews />
        <Pricing />
        <Faq />
      </main>
      <Footer />
      <Dock />
    </>
  );
}
