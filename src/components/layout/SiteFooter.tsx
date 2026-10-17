import Link from "next/link";
import { cacheLife } from "next/cache";
import { legalNav, siteConfig } from "@/config/site";
import { LOCATIONS, formatHours } from "@/data/locations";
import { InstagramIcon } from "@/components/ui/Icons";
import { Pending } from "@/components/legal/Pending";
import { Logo } from "./Logo";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await currentYear();

  return (
    <footer id="kontakt" className="bg-roast text-oat">
      <div className="container-x pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm leading-relaxed text-oat/80">
              Kawiarnia z Gdańska. Starannie dobrane ziarna, uważnie przygotowane espresso i zamówienia online z odbiorem w wybranym lokalu.
            </p>
            <p className="mt-8 font-serif text-3xl italic leading-tight text-paper">Do zobaczenia przy barze.</p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-4">
            <FooterColumn title="Menu">
              <FooterLink href="/#klasyki">Klasyki</FooterLink>
              <FooterLink href="/#menu">Pełne menu kaw</FooterLink>
              <FooterLink href="/#galeria">Galeria</FooterLink>
              <FooterLink href="/zamowienie">Twoje zamówienie</FooterLink>
            </FooterColumn>

            <FooterColumn title="Lokale">
              {LOCATIONS.map((l) => (
                <li key={l.id} className="text-sm leading-relaxed">
                  <Link href="/#lokale" className="text-paper hover:underline">
                    {l.district}
                  </Link>
                  <span className="block text-oat/70">{l.street}</span>
                  <span className="block text-oat/70">pon.–pt. {formatHours(l.hours.weekdays)}</span>
                </li>
              ))}
              <li className="text-xs text-oat/60">Adresy demonstracyjne – wymagają weryfikacji.</li>
            </FooterColumn>

            <FooterColumn title="Kontakt">
              <li className="text-sm">
                <span className="block text-oat/60">E-mail</span>
                {siteConfig.contact.email ? (
                  <a href={`mailto:${siteConfig.contact.email}`} className="text-paper hover:underline">
                    {siteConfig.contact.email}
                  </a>
                ) : (
                  <Pending tone="dark">adres e-mail</Pending>
                )}
              </li>
              <li className="text-sm">
                <span className="block text-oat/60">Telefon</span>
                {siteConfig.contact.phone ? (
                  <a href={`tel:${siteConfig.contact.phone.replace(/\s/g, "")}`} className="text-paper hover:underline">
                    {siteConfig.contact.phone}
                  </a>
                ) : (
                  <Pending tone="dark">numer telefonu</Pending>
                )}
              </li>
              <li className="text-sm">
                {siteConfig.instagramUrl ? (
                  <a
                    href={siteConfig.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-paper hover:underline"
                  >
                    <InstagramIcon size={18} /> Instagram
                  </a>
                ) : (
                  <>
                    <span className="flex items-center gap-2 text-oat/60">
                      <InstagramIcon size={16} /> Instagram
                    </span>
                    <Pending tone="dark">link do profilu</Pending>
                  </>
                )}
              </li>
              <FooterLink href="/kontakt">Kontakt i dane sprzedawcy</FooterLink>
            </FooterColumn>

            <FooterColumn title="Płatności">
              <li className="text-sm leading-relaxed text-oat/80">
                Płatności online obsługuje Stripe. Dostępne metody (np. karta, BLIK, Przelewy24) zależą od konfiguracji konta sprzedawcy.
              </li>
              <FooterLink href="/platnosci-i-zwroty">Płatności i zwroty</FooterLink>
            </FooterColumn>
          </div>
        </div>

        <nav aria-label="Dokumenty prawne" className="mt-20 border-t border-paper/10 pt-8">
          <h2 className="eyebrow mb-4 text-oat/60">Dokumenty</h2>
          <ul className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-8">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="link-quiet text-paper/90 hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-10 flex flex-col gap-3 text-xs text-oat/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {siteConfig.name}. Wszelkie prawa zastrzeżone.
          </p>
          <p className="max-w-xl md:text-right">
            Dane firmy, kontakt i dokumenty prawne są wersją roboczą i wymagają uzupełnienia oraz weryfikacji przed uruchomieniem sprzedaży.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="eyebrow mb-5 text-oat/60">{title}</h2>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-paper/90 transition-colors hover:text-paper hover:underline">
        {children}
      </Link>
    </li>
  );
}
