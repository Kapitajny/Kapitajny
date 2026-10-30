import type { Metadata } from "next";
import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { Photo } from "@/components/ui/Photo";

export const metadata: Metadata = {
  title: "Contact",
  description: "Address, opening hours, phone and e-mail of VÉRA Aesthetic Studio, and a form to send us a message.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact | VÉRA Aesthetic Studio", url: "/contact" },
};

export default function ContactPage() {
  const { contact, address, hours } = siteConfig;
  return (
    <>
      <section className="shell pb-20 pt-[calc(var(--header-h)+3rem)] lg:pt-[calc(var(--header-h)+5rem)]">
        <Breadcrumbs
          items={[
            { href: "/", label: "Home" },
            { href: "/contact", label: "Contact" },
          ]}
        />
        <h1 className="display mt-10 text-[clamp(3.5rem,13vw,12rem)] text-burgundy">Contact</h1>

        <div className="mt-12 grid gap-px border-y border-black bg-line sm:grid-cols-2 lg:grid-cols-4">
          <div className="bg-ivory py-8 sm:pr-8">
            <h2 className="text-xs font-semibold text-stone">Phone</h2>
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
            <h2 className="text-xs font-semibold text-stone">Address</h2>
            <address className="mt-3 font-serif text-2xl not-italic leading-snug">
              {address.street}
              <br />
              {address.postalCode} {address.city}
            </address>
            <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className="link-line mt-3 inline-block text-sm font-semibold text-burgundy">
              Get directions<span className="sr-only"> (opens Google Maps in a new tab)</span>
            </a>
          </div>
          <div className="bg-ivory py-8 sm:pl-8">
            <h2 className="text-xs font-semibold text-stone">Instagram</h2>
            <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block font-serif text-2xl hover:text-burgundy">
              {contact.instagramHandle}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </section>

      <section aria-labelledby="message-title" className="shell grid gap-16 pb-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2 id="message-title" className="font-serif text-4xl sm:text-5xl">
            Send a message
          </h2>
          <p className="mt-5 text-stone">
            For questions about treatments, an existing appointment or anything else. To arrange a first visit, use the{" "}
            <Link href={bookingHref} className="text-burgundy underline underline-offset-[3px]">
              consultation request
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
