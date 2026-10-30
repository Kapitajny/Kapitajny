import { notFound } from "next/navigation";
import { siteConfig } from "@/config/site";
import { SERVICES } from "@/data/services";
import { homePath, isLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { resolveImage } from "@/lib/images.server";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import { Services } from "@/components/Services";
import { SiteFooter } from "@/components/SiteFooter";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const dict = getDictionary(lang);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: siteConfig.name,
    description: dict.meta.description,
    url: `${siteConfig.url}${homePath(lang)}`,
    inLanguage: lang,
    address: { "@type": "PostalAddress", addressLocality: "Warszawa", addressCountry: "PL" },
    areaServed: ["PL", "EU"],
    ...(siteConfig.email ? { email: siteConfig.email } : {}),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: dict.services.title,
      itemListElement: SERVICES.map((service) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: dict.services.items[service.id].name, description: dict.services.items[service.id].description },
      })),
    },
  };

  // Na stronie jest tylko jedno <main>; Hero należy do treści, aby link „Przejdź do treści” trafiał na początek.
  return (
    <>
      <main id="main" tabIndex={-1}>
        <Hero image={resolveImage("heroDusk", dict)} t={dict.hero} />
        <Portfolio dict={dict} locale={lang} />
        <About portrait={resolveImage("aboutPortrait", dict)} t={dict.about} />
        <Services dict={dict} />
        <Contact image={resolveImage("cameraSunset", dict)} inquiriesEnabled={Boolean(process.env.INQUIRY_WEBHOOK_URL?.trim())} dict={dict} locale={lang} />
      </main>
      <SiteFooter dict={dict} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
    </>
  );
}
