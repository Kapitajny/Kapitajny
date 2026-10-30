import Link from "next/link";
import { bookingHref, legalNav, mainNav, siteConfig } from "@/config/site";
import { Wordmark } from "./Logo";

export function SiteFooter() {
  const { contact, address, hours } = siteConfig;
  return (
    <footer className="rounded-t-[2.5rem] bg-burgundy text-ivory sm:rounded-t-[4rem]">
      <div className="shell flex flex-col items-center pb-10 pt-20 text-center sm:pt-24">
        <Wordmark className="text-[4.5rem] sm:text-[6rem]" />
        <p className="script mt-2 text-xl text-rose-light sm:text-2xl">Twoje piękno. Twoja tożsamość.</p>
        <Link href={bookingHref} className="pill pill-ivory mt-10">
          Umów konsultację
        </Link>

        <nav aria-label="Stopka" className="mt-14">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-rose-light">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-14 grid w-full max-w-3xl gap-8 border-t border-line-light pt-10 text-sm sm:grid-cols-3">
          <div>
            <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-rose-light">Adres</h2>
            <address className="mt-2 not-italic">
              {address.street}
              <br />
              {address.postalCode} {address.city}
            </address>
          </div>
          <div>
            <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-rose-light">Kontakt</h2>
            <p className="mt-2">
              <a href={contact.phoneHref}>{contact.phone}</a>
              <br />
              <a href={`mailto:${contact.email}`} className="break-all">
                {contact.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="font-sans text-xs font-medium tracking-[0.12em] text-rose-light">Godziny</h2>
            <p className="mt-2">
              {hours.map((h) => (
                <span key={h.days} className="block">
                  {h.days}: {h.time}
                </span>
              ))}
            </p>
          </div>
        </div>

        <div className="mt-14 flex w-full flex-col items-center gap-3 text-xs text-ivory/70 sm:flex-row sm:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.fullName}. Koncept demonstracyjny {siteConfig.agency} (koncepcja 2); studio, osoby i dane kontaktowe są fikcyjne.
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
                Instagram<span className="sr-only"> (otwiera się w nowej karcie)</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
