import { notFound } from "next/navigation";
import { site } from "@/config/site";
import { hasLocale, localePath } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { OPENING_HOURS } from "@/lib/booking/rules";
import { Hero } from "@/components/sections/Hero";
import { Sounds } from "@/components/sections/Sounds";
import { About } from "@/components/sections/About";
import { Services } from "@/components/sections/Services";
import { Work } from "@/components/sections/Work";
import { Pricing } from "@/components/sections/Pricing";
import { Booking } from "@/components/sections/Booking";
import { Faq } from "@/components/sections/Faq";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const t = await getDictionary(lang);

  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": `${site.url}/#studio`,
      name: site.name,
      description: t.meta.description,
      url: `${site.url}${localePath(lang, "/")}`,
      image: `${site.url}/images/hero-booth.jpg`,
      foundingDate: String(site.foundingYear),
      telephone: site.contact.phone,
      email: site.contact.email,
      priceRange: "100–600 PLN",
      address: {
        "@type": "PostalAddress",
        streetAddress: site.address.street,
        postalCode: site.address.postalCode,
        addressLocality: site.address.city,
        addressRegion: site.address.region,
        addressCountry: site.address.country,
      },
      geo: { "@type": "GeoCoordinates", latitude: site.address.geo.lat, longitude: site.address.geo.lng },
      openingHoursSpecification: OPENING_HOURS.flatMap((h, i) => (h ? [{ "@type": "OpeningHoursSpecification", dayOfWeek: days[i], opens: h.open, closes: h.close }] : [])),
      knowsLanguage: ["pl", "en"],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: t.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <main id="main">
      <Hero lang={lang} t={t.hero} />
      <Sounds lang={lang} t={t.sounds} />
      <About t={t.about} />
      <Services lang={lang} t={t.services} />
      <Work lang={lang} t={t.work} />
      <Pricing lang={lang} t={t.pricing} />
      <Booking lang={lang} t={t} />
      <Faq t={t.faq} contact={t.contact} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </main>
  );
}
