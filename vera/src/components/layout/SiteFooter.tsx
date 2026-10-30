import Link from "next/link";
import { bookingHref, legalNav, mainNav, siteConfig } from "@/config/site";

export function SiteFooter() {
  const { contact, address, hours } = siteConfig;
  return (
    <footer className="overflow-hidden bg-black text-ivory">
      <div className="shell pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="font-serif text-4xl font-light leading-[1.02] sm:text-5xl">
              Your beauty.
              <br />
              <span className="pl-[0.9em]">Your identity.</span>
            </p>
            <p className="mt-6 max-w-xs text-sm text-ivory/70">Aesthetic medicine and professional skin care, planned around you.</p>
          </div>

          <nav aria-label="Footer" className="text-sm lg:col-span-2 lg:col-start-7">
            <h2 className="mb-4 font-sans text-xs font-semibold text-rose">Studio</h2>
            <ul className="space-y-2.5">
              {mainNav.slice(1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-line bg-[length:0%_1px] hover:bg-[length:100%_1px]">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={bookingHref} className="link-line bg-[length:0%_1px] hover:bg-[length:100%_1px]">
                  Book a consultation
                </Link>
              </li>
            </ul>
          </nav>

          <div className="text-sm lg:col-span-2">
            <h2 className="mb-4 font-sans text-xs font-semibold text-rose">Visit</h2>
            <address className="not-italic leading-relaxed">
              {address.street}
              <br />
              {address.postalCode} {address.city}
              <br />
              <a href={contact.phoneHref} className="mt-3 inline-block">
                {contact.phone}
              </a>
              <br />
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </address>
          </div>

          <div className="text-sm lg:col-span-2">
            <h2 className="mb-4 font-sans text-xs font-semibold text-rose">Hours</h2>
            <dl className="space-y-1.5">
              {hours.map((h) => (
                <div key={h.days}>
                  <dt className="text-ivory/70">{h.days}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-line-light py-6 text-xs text-ivory/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.fullName}. A demonstration concept by {siteConfig.agency}; the studio, people and contact details are fictional.
          </p>
          <ul className="flex gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-ivory">
                Instagram<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* The wordmark, cropped by the page edge. */}
      {/* Drawn from a pseudo-element: purely decorative, so it is not read out or treated as text. */}
      <div
        aria-hidden="true"
        data-word="VÉRA"
        className="shell -mb-[0.2em] select-none font-serif text-[27vw] font-medium leading-[0.8] tracking-[0.06em] text-burgundy before:content-[attr(data-word)] 3xl:text-[30rem]"
      />
    </footer>
  );
}
