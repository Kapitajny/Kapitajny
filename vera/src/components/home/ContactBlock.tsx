import Link from "next/link";
import { bookingHref, siteConfig } from "@/config/site";

export function ContactBlock() {
  const { contact, address, hours } = siteConfig;
  return (
    <section aria-labelledby="contact-title" className="bg-burgundy text-ivory">
      <div className="shell grid gap-14 py-24 sm:py-32 lg:grid-cols-12 lg:gap-8 lg:py-36">
        <div className="lg:col-span-6">
          <h2 id="contact-title" className="display text-[clamp(3rem,7vw,6.25rem)]">
            Odwiedź
            <br />
            <span className="pl-[0.9em]">studio</span>
          </h2>
          <address className="mt-10 font-serif text-3xl font-light not-italic leading-snug sm:text-4xl">
            {address.street}
            <br />
            {address.postalCode} {address.city}
          </address>
          <p className="mt-3 text-sm text-ivory/70">{address.note}</p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={bookingHref} className="btn btn-light">
              Umów konsultację
            </Link>
            <a href={address.mapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-light">
              Wyznacz trasę<span className="sr-only"> (otwiera Mapy Google w nowej karcie)</span>
            </a>
          </div>
        </div>

        <div className="grid gap-10 sm:grid-cols-2 lg:col-span-5 lg:col-start-8 lg:self-end">
          <div>
            <h3 className="font-sans text-xs font-semibold text-rose-light">Zadzwoń lub napisz</h3>
            <p className="mt-3 text-lg">
              <a href={contact.phoneHref} className="link-line">
                {contact.phone}
              </a>
            </p>
            <p className="mt-2 text-lg">
              <a href={`mailto:${contact.email}`} className="link-line break-all">
                {contact.email}
              </a>
            </p>
          </div>
          <div>
            <h3 className="font-sans text-xs font-semibold text-rose-light">Godziny otwarcia</h3>
            <dl className="mt-3 space-y-2">
              {hours.map((h) => (
                <div key={h.days} className="flex justify-between gap-6 border-b border-line-light pb-2 text-sm">
                  <dt className="text-ivory/75">{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
