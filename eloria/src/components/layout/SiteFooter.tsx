import Image from "next/image";
import Link from "next/link";
import lockup from "../../../public/brand/eloria-lockup-light.png";
import { bookingHref, mainNav, siteConfig } from "@/config/site";
import { categories } from "@/data/services";

export function SiteFooter() {
  const { contact } = siteConfig;
  return (
    <footer data-surface="dark" className="bg-espresso-deep text-ivory/85">
      <div className="frame grid gap-x-10 gap-y-14 pb-12 pt-20 md:grid-cols-12 md:pt-24">
        <div className="md:col-span-5 lg:col-span-4">
          <Image src={lockup} alt="ÉLORIA Aesthetic Clinic" sizes="240px" className="h-auto w-48 sm:w-56" />
          <p className="mt-8 max-w-xs font-serif text-2xl font-light leading-snug text-ivory">{siteConfig.tagline}</p>
          <Link href={bookingHref} className="btn btn-light mt-8">
            Umów konsultację
          </Link>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 md:col-span-7 lg:col-span-7 lg:col-start-6">
          <div>
            <h2 className="font-sans text-xs font-medium text-champagne-light">Klinika</h2>
            <address className="mt-4 text-sm not-italic leading-relaxed">
              {contact.street}
              <br />
              {contact.postalCode} {contact.city}
              <br />
              <a href={contact.mapsUrl} className="link-quiet mt-2 inline-block" target="_blank" rel="noopener noreferrer">
                Wyznacz trasę<span className="sr-only"> (otwiera się w nowej karcie)</span>
              </a>
            </address>
            <dl className="mt-6 space-y-1 text-sm">
              {siteConfig.hours.map((h) => (
                <div key={h.days} className="flex gap-3">
                  <dt className="w-12 shrink-0 text-ivory/60">{h.short}</dt>
                  <dd>{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="font-sans text-xs font-medium text-champagne-light">Kontakt</h2>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <a href={contact.phoneHref} className="link-hover">
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={`mailto:${contact.email}`} className="link-hover break-all">
                  {contact.email}
                </a>
              </li>
              {siteConfig.instagramUrl && (
                <li>
                  <a href={siteConfig.instagramUrl} className="link-hover" target="_blank" rel="noopener noreferrer">
                    Instagram<span className="sr-only"> (otwiera się w nowej karcie)</span>
                  </a>
                </li>
              )}
            </ul>
            <h2 className="mt-8 font-sans text-xs font-medium text-champagne-light">Zabiegi</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link href={`/zabiegi#${c.slug}`} className="link-hover">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <nav aria-label="Stopka">
            <h2 className="font-sans text-xs font-medium text-champagne-light">Strony</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-hover">
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link href={bookingHref} className="link-hover">
                  Rezerwacja konsultacji
                </Link>
              </li>
              <li>
                <Link href="/polityka-prywatnosci" className="link-hover">
                  Polityka prywatności
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="frame flex flex-col gap-3 border-t border-ivory/10 py-8 text-xs text-ivory/60 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {siteConfig.fullName}</p>
        {siteConfig.demo && (
          <p className="max-w-xl md:text-right">
            Projekt demonstracyjny agencji {siteConfig.agency.name}. Dane kontaktowe, zespół i opisy zabiegów są przykładowe.
          </p>
        )}
      </div>
    </footer>
  );
}
