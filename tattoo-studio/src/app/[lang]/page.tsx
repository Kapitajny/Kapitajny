import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { ROUTES } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { buildMetadata, resolveLocale } from "@/i18n/metadata";
import { About } from "@/components/home/About";
import { Faq } from "@/components/home/Faq";
import { Gallery } from "@/components/home/Gallery";
import { Hero } from "@/components/home/Hero";
import { Pricing } from "@/components/home/Pricing";
import { Reviews } from "@/components/home/Reviews";
import { Specialties } from "@/components/home/Specialties";
import { Footer } from "@/components/layout/Footer";
import { Dock } from "@/components/nav/Dock";

export async function generateMetadata({ params }: PageProps<"/[lang]">): Promise<Metadata> {
  return buildMetadata(await resolveLocale(params), "home");
}

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const lang = await resolveLocale(params);
  const t = getDictionary(lang);
  const { contact, social } = siteConfig;
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "TattooParlor",
    name: siteConfig.name,
    description: t.meta.description,
    url: `${siteConfig.url}${ROUTES.home.paths[lang]}`,
    inLanguage: lang,
    address: { "@type": "PostalAddress", addressLocality: siteConfig.city, addressCountry: "PL", ...(contact.address ? { streetAddress: contact.address } : {}) },
    ...(contact.email ? { email: contact.email } : {}),
    ...(contact.phone ? { telephone: contact.phone } : {}),
    sameAs: Object.values(social).filter(Boolean),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <main id="main" className="pb-[var(--dock-space)]">
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
