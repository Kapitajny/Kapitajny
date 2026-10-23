import Link from "next/link";
import { categories } from "@/data/catalog";
import { helpNav, legalNav, siteConfig } from "@/config/site";
import { RETURN_DAYS } from "@/data/shipping";
import { Logo } from "./Logo";

function Pending() {
  return <span className="pending">do uzupełnienia</span>;
}

export function SiteFooter() {
  const { contact, social } = siteConfig;
  const socials = [
    { label: "Instagram", href: social.instagram },
    { label: "TikTok", href: social.tiktok },
  ].filter((s): s is { label: string; href: string } => Boolean(s.href));

  return (
    <footer className="mt-auto border-t border-line bg-graphite">
      <div className="wrap grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="md:col-span-4">
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted">Bluzy i spodnie w szerokich krojach. Wysyłka w Polsce, {RETURN_DAYS} dni na odstąpienie od umowy.</p>
        </div>

        <nav aria-label="Kategorie" className="md:col-span-2">
          <h2 className="text-sm font-bold">Sklep</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/kategoria/${c.slug}`} className="hover:text-paper">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/nowosci" className="hover:text-paper">
                Nowości
              </Link>
            </li>
            <li>
              <Link href="/kolekcje" className="hover:text-paper">
                Kolekcje
              </Link>
            </li>
            <li>
              <Link href="/sklep" className="hover:text-paper">
                Wszystkie produkty
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Pomoc" className="md:col-span-2">
          <h2 className="text-sm font-bold">Pomoc</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {helpNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <h2 className="text-sm font-bold">Kontakt</h2>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li>
              E-mail: {contact.email ? <a href={`mailto:${contact.email}`} className="link text-paper">{contact.email}</a> : <Pending />}
            </li>
            <li>
              Telefon: {contact.phone ? <a href={`tel:${contact.phone.replace(/\s/g, "")}`} className="link text-paper">{contact.phone}</a> : <Pending />}
            </li>
            <li>
              <Link href="/kontakt" className="link text-paper">
                Formularz kontaktowy
              </Link>
            </li>
          </ul>
          <h2 className="mt-8 text-sm font-bold">Social media</h2>
          {socials.length ? (
            <ul className="mt-4 flex gap-5 text-sm">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} className="link" target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-muted">
              Instagram, TikTok: <Pending />
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-line">
        <div className="wrap flex flex-col gap-4 py-6 text-xs text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {siteConfig.name}. Ceny brutto w PLN.
          </p>
          <ul className="flex flex-wrap gap-x-5 gap-y-2">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-paper">
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
