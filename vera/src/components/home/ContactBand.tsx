import Link from "next/link";
import { bookHref, site } from "@/config/site";
import { DisplayPhone } from "@/components/ui/DisplayPhone";

export function ContactBand() {
  const { contact } = site;
  return (
    <section aria-labelledby="contact-title" className="bg-burgundy text-ivory">
      <div className="wrap grid gap-14 py-24 lg:grid-cols-12 lg:gap-8 lg:py-32">
        <div className="lg:col-span-4">
          <h2 id="contact-title" className="kicker text-rose-light">
            Contact
          </h2>
          <address className="mt-8 not-italic text-ivory/85">
            {site.fullName}
            <br />
            {contact.street}, {contact.postalCode} {contact.city}
          </address>
          <ul className="mt-6 space-y-1 text-sm text-ivory/75">
            {site.hours.map((h) => (
              <li key={h.label}>
                {h.label}: {h.time}
              </li>
            ))}
          </ul>
          <a href={contact.mapsUrl} target="_blank" rel="noopener noreferrer" className="underline-draw mt-6 inline-block text-sm font-medium">
            Get directions<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
        <div className="lg:col-span-8">
          <a href={contact.phoneHref} className="group block border-b border-ivory/20 pb-6">
            <span className="kicker block text-rose-light">Call</span>
            <span className="display-lg mt-3 block transition-colors group-hover:text-rose-light">
              <DisplayPhone number={contact.phone} />
            </span>
          </a>
          <a href={`mailto:${contact.email}`} className="group mt-8 block border-b border-ivory/20 pb-6">
            <span className="kicker block text-rose-light">Write</span>
            <span className="display-md mt-3 block break-all transition-colors group-hover:text-rose-light sm:break-normal">{contact.email}</span>
          </a>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href={bookHref} className="cta cta-ivory">
              Book a consultation
            </Link>
            <Link href="/contact" className="cta cta-line-light">
              Send a message
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
