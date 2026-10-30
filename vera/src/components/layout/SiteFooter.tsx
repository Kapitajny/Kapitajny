import Link from "next/link";
import { bookHref, menu, site } from "@/config/site";

export function SiteFooter() {
  const { contact } = site;
  return (
    <footer id="site-footer" className="overflow-hidden bg-black text-ivory">
      <div className="wrap grid gap-12 pb-10 pt-20 md:grid-cols-12 lg:pt-28">
        <div className="md:col-span-5">
          <p className="display-md max-w-md">Your beauty. Your identity.</p>
          <Link href={bookHref} className="cta cta-ivory mt-10">
            Book a consultation
          </Link>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 md:col-span-7">
          <div>
            <h2 className="kicker text-rose">Studio</h2>
            <address className="mt-4 text-sm not-italic leading-relaxed text-ivory/80">
              {contact.street}
              <br />
              {contact.postalCode} {contact.city}
            </address>
            <ul className="mt-4 space-y-1 text-sm text-ivory/80">
              {site.hours.map((h) => (
                <li key={h.label}>
                  {h.label}: {h.time}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="kicker text-rose">Contact</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={contact.phoneHref} className="underline-hover">
                  {contact.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="underline-hover">
                  {contact.email}
                </a>
              </li>
              <li>
                <a href={contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="underline-hover">
                  Instagram {contact.instagramHandle}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </div>
          <nav aria-label="Footer">
            <h2 className="kicker text-rose">Explore</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {menu.slice(1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="underline-hover">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/privacy" className="underline-hover">
                  Privacy policy
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <p aria-hidden="true" className="wrap select-none font-display text-[26.5vw] leading-[0.78] tracking-[-0.04em] text-rose 2xl:text-[29rem]">
        VÉRA
      </p>

      <div className="wrap flex flex-col gap-2 border-t border-ivory/10 py-6 text-xs text-ivory/60 sm:flex-row sm:justify-between">
        <p>© {new Date().getFullYear()} {site.fullName}</p>
        <p>Demo concept by {site.agency}. Contact details, specialists and treatment information are placeholders.</p>
      </div>
    </footer>
  );
}
