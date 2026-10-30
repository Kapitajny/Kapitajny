import type { Metadata } from "next";
import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { PageIntro } from "@/components/ui/PageIntro";
import { JsonLd, breadcrumbJsonLd, clinicJsonLd } from "@/components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Skontaktuj się z ÉLORIA Aesthetic Clinic w Warszawie: telefon, e-mail, adres, godziny otwarcia i formularz kontaktowy.",
  alternates: { canonical: "/kontakt" },
  openGraph: { title: "Kontakt | ÉLORIA Aesthetic Clinic", url: "/kontakt" },
};

export default function ContactPage() {
  const { contact, hours } = siteConfig;
  return (
    <>
      <JsonLd data={clinicJsonLd()} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Strona główna", path: "/" }, { name: "Kontakt", path: "/kontakt" }])} />
      <PageIntro
        breadcrumbs={[
          { href: "/", label: "Strona główna" },
          { href: "/kontakt", label: "Kontakt" },
        ]}
        title="Kontakt"
        lede="Recepcja odbiera telefony w godzinach otwarcia kliniki. Na wiadomości e-mail i z formularza odpowiadamy w kolejnym dniu roboczym."
      />

      <div className="frame grid gap-y-20 pb-24 lg:grid-cols-12 lg:gap-x-8 lg:pb-32">
        <section aria-labelledby="dane-kontaktowe" className="lg:col-span-4">
          <h2 id="dane-kontaktowe" className="sr-only">
            Dane kontaktowe
          </h2>
          <div className="space-y-12">
            <div>
              <h3 className="font-sans text-xs font-medium text-champagne-deep">Telefon</h3>
              <a href={contact.phoneHref} className="mt-3 inline-block font-serif text-[2.25rem] leading-none hover:text-champagne-deep">
                {contact.phoneDisplay}
              </a>
            </div>
            <div>
              <h3 className="font-sans text-xs font-medium text-champagne-deep">E-mail</h3>
              <a href={`mailto:${contact.email}`} className="link-quiet mt-3 inline-block break-all font-serif text-2xl">
                {contact.email}
              </a>
            </div>
            <div>
              <h3 className="font-sans text-xs font-medium text-champagne-deep">Adres</h3>
              <address className="mt-3 not-italic text-lg">
                {siteConfig.fullName}
                <br />
                {contact.street}
                <br />
                {contact.postalCode} {contact.city}
              </address>
              <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-6">
                Wyznacz trasę w Mapach Google<span className="sr-only"> (otwiera się w nowej karcie)</span>
              </a>
            </div>
            <div>
              <h3 className="font-sans text-xs font-medium text-champagne-deep">Godziny otwarcia</h3>
              <dl className="mt-3 divide-y divide-line border-y border-line">
                {hours.map((h) => (
                  <div key={h.days} className="flex justify-between gap-6 py-3">
                    <dt>{h.days}</dt>
                    <dd className="text-taupe">{h.time}</dd>
                  </div>
                ))}
                <div className="flex justify-between gap-6 py-3">
                  <dt>Niedziela</dt>
                  <dd className="text-taupe">nieczynne</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section aria-labelledby="formularz" className="lg:col-span-7 lg:col-start-6">
          <div className="bg-white/60 p-6 sm:p-10 lg:p-14">
            <h2 id="formularz" className="text-[clamp(2.25rem,4vw,3rem)]">
              Napisz do nas
            </h2>
            <p className="mt-4 max-w-lg text-taupe">
              Chcesz umówić wizytę? Skorzystaj z{" "}
              <Link href={bookingHref} className="link-quiet text-espresso">
                formularza zapytania o konsultację
              </Link>{" "}
              – wybierzesz w nim zabieg i dogodne terminy.
            </p>
            <div className="mt-10">
              <ContactForm />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
