import type { Metadata } from "next";
import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "Kontakt",
  description: "Adres, godziny otwarcia, telefon i e-mail VÉRA Aesthetic Studio oraz formularz kontaktowy.",
  alternates: { canonical: "/kontakt" },
  openGraph: { title: "Kontakt | VÉRA Aesthetic Studio", url: "/kontakt" },
};

export default function ContactPage() {
  const { contact, address, hours } = siteConfig;
  return (
    <>
      <section className="shell pb-20 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Strona główna" },
            { href: "/kontakt", label: "Kontakt" },
          ]}
        />
        <h1 className="display mt-10 text-[clamp(3.5rem,13vw,12rem)] text-burgundy">Kontakt</h1>

        <div className="mt-12 grid gap-px border-y border-black bg-line sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-ivory py-8 sm:pr-8">
            <h2 className="text-xs font-semibold text-stone">Telefon</h2>
            <a href={contact.phoneHref} className="mt-3 block font-serif text-3xl hover:text-burgundy">
              {contact.phone}
            </a>
          </div>
          <div className="bg-ivory py-8 sm:pl-8 lg:px-8">
            <h2 className="text-xs font-semibold text-stone">E-mail</h2>
            <a href={`mailto:${contact.email}`} className="mt-3 block break-all font-serif text-2xl hover:text-burgundy">
              {contact.email}
            </a>
          </div>
          <div className="bg-ivory py-8 sm:pr-8 lg:px-8">
            <h2 className="text-xs font-semibold text-stone">Adres</h2>
            <address className="mt-3 font-serif text-2xl not-italic leading-snug">
              {address.street}
              <br />
              {address.postalCode} {address.city}
            </address>
            <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-3 inline-block text-sm font-semibold text-burgundy">
              Wyznacz trasę<span className="sr-only"> (otwiera Mapy Google w nowej karcie)</span>
            </a>
          </div>
          <div className="bg-ivory py-8 sm:pl-8">
            <h2 className="text-xs font-semibold text-stone">Instagram</h2>
            <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block font-serif text-2xl hover:text-burgundy">
              {contact.instagramHandle}
              <span className="sr-only"> (otwiera się w nowej karcie)</span>
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="message-title" className="shell grid gap-16 pb-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="message-title" className="font-serif text-4xl sm:text-5xl">
            Napisz do nas
          </h2>
          <p className="mt-5 text-stone">
            W sprawie zabiegów, umówionej wizyty lub czegokolwiek innego. Aby umówić pierwszą wizytę, skorzystaj z{" "}
            <Link href={bookingHref} className="text-burgundy underline underline-offset-[3px]">
              zapytania o konsultację
            </Link>
            .
          </p>
          <dl className="mt-10 space-y-2 border-t border-black pt-6 text-sm">
            {hours.map((h) => (
              <div key={h.days} className="flex justify-between gap-6">
                <dt className="text-stone">{h.days}</dt>
                <dd>{h.time}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-stone">{address.note}.</p>
          <Photo image="reception" sizes="(min-width: 1024px) 30vw, 100vw" className="mt-10 hidden aspect-[4/3] lg:block" focus="25% 60%" />
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
