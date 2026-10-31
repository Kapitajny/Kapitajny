import Link from "next/link";

import { Logo } from "@/components/brand/Logo";
import { nav, site } from "@/data/site";

export function SiteFooter() {
  return (
    <footer className="bg-graphite text-paper">
      <div className="shell grid grid-cols-12 gap-x-6 gap-y-14 pt-24 pb-10 md:pt-32">
        <div className="col-span-12 lg:col-span-5">
          <Link href="/" aria-label="FORMA ATELIER — strona główna" className="inline-block">
            <Logo />
          </Link>
          <p className="t-lead mt-8 max-w-sm text-mist">{site.subclaim}</p>
        </div>

        <nav aria-label="Stopka" className="col-span-6 md:col-span-4 lg:col-span-2 lg:col-start-7">
          <h2 className="t-meta mb-5 font-sans text-sand">Menu</h2>
          <ul className="space-y-2.5 text-[0.9375rem]">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-line">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="col-span-6 md:col-span-4 lg:col-span-3">
          <h2 className="t-meta mb-5 font-sans text-sand">Pracownia</h2>
          <address className="space-y-2.5 text-[0.9375rem] not-italic">
            <p>
              {site.contact.street}
              <br />
              {site.contact.city}
            </p>
            <p>
              <a className="link-line" href={`mailto:${site.contact.email}`}>
                {site.contact.email}
              </a>
            </p>
            <p>
              <a className="link-line" href={`tel:${site.contact.phoneHref}`}>
                {site.contact.phone}
              </a>
            </p>
            <p>
              <a className="link-line" href={site.instagram} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            </p>
          </address>
        </div>

        <div className="t-meta col-span-12 flex flex-col gap-4 border-t border-line-light pt-8 text-mist md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} FORMA ATELIER. Wszelkie prawa zastrzeżone.</p>
          <p className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/polityka-prywatnosci" className="link-line">
              Polityka prywatności
            </Link>
            <span>
              {site.agency.note}: {site.agency.name}. Dane kontaktowe są przykładowe.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
