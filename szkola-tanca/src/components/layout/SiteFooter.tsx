import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Logo } from "./Logo";

const OFFER_LINKS = [
  { href: "/#zajecia", label: "Style tańca" },
  { href: "/#grafik", label: "Grafik zajęć" },
  { href: "/#cennik", label: "Cennik i karnety" },
  { href: "/#wydarzenia", label: "Warsztaty i wydarzenia" },
  { href: "/#zapis", label: "Lekcja próbna" },
];

const STUDIO_LINKS = [
  { href: "/#o-nas", label: "O nas" },
  { href: "/#instruktorzy", label: "Instruktorzy" },
  { href: "/#studio", label: "Nasze studio" },
  { href: "/#galeria", label: "Galeria" },
  { href: "/#faq", label: "Najczęstsze pytania" },
];

function FooterLinks({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="label text-blush">{title}</h2>
      <ul className="mt-5 space-y-1">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="inline-flex min-h-11 items-center transition-colors hover:text-blush">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  const { contact, social } = siteConfig;
  return (
    <footer className="on-dark band mb-[clamp(0.5rem,1.6vw,1.5rem)] bg-cocoa text-ivory">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo tone="light" />
          <p className="mt-6 max-w-[34ch] text-ivory/85">
            Kameralne studio tańca dla dorosłych. Uczymy w małych grupach, we własnym tempie i bez oceniania.
          </p>
          {social.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-3">
              {social.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="btn btn-outline-light btn-sm" target="_blank" rel="noopener noreferrer">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FooterLinks title="Oferta" links={OFFER_LINKS} />
        <FooterLinks title="Studio" links={STUDIO_LINKS} />

        <div>
          <h2 className="label text-blush">Kontakt</h2>
          <address className="mt-5 space-y-2 not-italic">
            <p>
              {contact.street}, {contact.city}
              <span className="block text-sm text-ivory/75">adres demonstracyjny</span>
            </p>
            <p>
              <a href={contact.phoneHref} className="inline-flex min-h-11 items-center hover:text-blush">
                {contact.phoneDisplay}
              </a>
            </p>
            <p>
              <a href={`mailto:${contact.email}`} className="inline-flex min-h-11 items-center break-all hover:text-blush">
                {contact.email}
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="border-t rule">
        <div className="container-x flex flex-col gap-4 py-6 text-sm text-ivory/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {siteConfig.fullName}. Projekt demonstracyjny: dane, ceny i terminy są przykładowe.
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {siteConfig.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center underline decoration-ivory/40 underline-offset-4 hover:decoration-ivory">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
