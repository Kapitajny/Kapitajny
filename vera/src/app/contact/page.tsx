import type { Metadata } from "next";
import Link from "next/link";
import { bookHref, site } from "@/config/site";
import { ContactForm } from "@/components/forms/ContactForm";
import { Crumbs } from "@/components/ui/Crumbs";
import { Shot } from "@/components/ui/Shot";
import { JsonLd, breadcrumbs, studioJsonLd } from "@/components/seo/JsonLd";
import { DisplayPhone } from "@/components/ui/DisplayPhone";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact VÉRA Aesthetic Studio in Kazimierz, Kraków – phone, e-mail, opening hours, directions and a contact form.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact – VÉRA Aesthetic Studio", url: "/contact" },
};

export default function ContactPage() {
  const { contact } = site;
  return (
    <>
      <JsonLd data={studioJsonLd()} />
      <JsonLd data={breadcrumbs([{ name: "Home", path: "/" }, { name: "Contact", path: "/contact" }])} />
      <section aria-labelledby="contact-title" className="bg-black pt-[var(--bar)] text-ivory">
        <div className="wrap pb-16 pt-10 lg:pb-24">
          <Crumbs light items={[{ href: "/", label: "Home" }, { href: "/contact", label: "Contact" }]} />
          <h1 id="contact-title" className="display-xl mt-12">
            Contact
          </h1>
          <div className="mt-14 grid gap-8 border-t border-ivory/15 pt-8 md:grid-cols-2">
            <a href={contact.phoneHref} className="group">
              <span className="kicker block text-rose">Call</span>
              <span className="display-md mt-3 block group-hover:text-rose-light">
                <DisplayPhone number={contact.phone} />
              </span>
            </a>
            <a href={`mailto:${contact.email}`} className="group">
              <span className="kicker block text-rose">Write</span>
              <span className="display-md mt-3 block break-all group-hover:text-rose-light sm:break-normal">{contact.email}</span>
            </a>
          </div>
        </div>
      </section>

      <div className="wrap grid gap-16 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <aside aria-label="Studio details" className="lg:col-span-4">
          <dl className="space-y-8">
            <div>
              <dt className="kicker text-rose-deep">Studio</dt>
              <dd className="mt-2">
                {contact.street}, {contact.postalCode} {contact.city}
                <br />
                <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-draw mt-2 inline-block text-sm font-medium">
                  Get directions<span className="sr-only"> (opens in a new tab)</span>
                </a>
              </dd>
            </div>
            <div>
              <dt className="kicker text-rose-deep">Hours</dt>
              <dd className="mt-2 space-y-1">
                {site.hours.map((h) => (
                  <p key={h.label}>
                    {h.label}: {h.time}
                  </p>
                ))}
                <p>Sunday: closed</p>
              </dd>
            </div>
            <div>
              <dt className="kicker text-rose-deep">Instagram</dt>
              <dd className="mt-2">
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline-draw">
                  {contact.instagramHandle}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </dd>
            </div>
          </dl>
          <div className="relative mt-12 aspect-[4/5] max-w-xs overflow-hidden">
            <Shot image="contactStudio" sizes="320px" />
          </div>
        </aside>

        <section aria-labelledby="form-title" className="lg:col-span-7 lg:col-start-6">
          <h2 id="form-title" className="display-md">
            Send a message
          </h2>
          <p className="mt-4 text-stone">
            Want to book? The{" "}
            <Link href={bookHref} className="underline-draw text-black">
              consultation request
            </Link>{" "}
            lets you choose a treatment and times that suit you.
          </p>
          <div className="mt-12">
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}
