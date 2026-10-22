import Link from "next/link";
import { cacheLife } from "next/cache";
import { formatAddress, legalNav, mainNav, phoneHref, siteConfig } from "@/config/site";
import { Pending } from "@/components/ui/Pending";
import { Logo } from "./Logo";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const year = await currentYear();
  const address = formatAddress();
  const { phone, email } = siteConfig.contact;
  const { legalName, nip } = siteConfig.company;

  return (
    <footer className="bg-graphite pb-24 text-paper/85 sm:pb-0">
      <div className="container-x pb-10 pt-16 lg:pt-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm leading-relaxed text-paper/75">
              Gabinet rehabilitacji i fizjoterapii{siteConfig.city ? ` w ${siteConfig.city}` : ""}. Indywidualnie dopasowana terapia, spokojna atmosfera i
              jasne zasady współpracy.
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-3 lg:col-span-8">
            <FooterColumn title="Na stronie">
              {mainNav.slice(1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-paper/90 transition-colors hover:text-paper hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </FooterColumn>

            <FooterColumn title="Kontakt">
              <li>
                <span className="block text-sm text-paper/60">Telefon</span>
                {phone ? (
                  <a href={phoneHref(phone)} className="text-paper hover:underline">
                    {phone}
                  </a>
                ) : (
                  <Pending tone="dark">telefon</Pending>
                )}
              </li>
              <li>
                <span className="block text-sm text-paper/60">E-mail</span>
                {email ? (
                  <a href={`mailto:${email}`} className="break-all text-paper hover:underline">
                    {email}
                  </a>
                ) : (
                  <Pending tone="dark">e-mail</Pending>
                )}
              </li>
              <li>
                <span className="block text-sm text-paper/60">Adres</span>
                {address ? <span className="text-paper">{address}</span> : <Pending tone="dark">adres gabinetu</Pending>}
              </li>
            </FooterColumn>

            <FooterColumn title="Godziny otwarcia">
              {siteConfig.openingHours.map((row) => (
                <li key={row.days}>
                  <span className="block text-sm text-paper/60">{row.days}</span>
                  {row.hours ? <span className="text-paper">{row.hours}</span> : <Pending tone="dark">godziny</Pending>}
                </li>
              ))}
            </FooterColumn>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-6 border-t border-paper/15 pt-8 text-sm md:flex-row md:items-center md:justify-between">
          <nav aria-label="Dokumenty">
            <ul className="flex flex-wrap gap-x-8 gap-y-3">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-quiet text-paper/90 hover:text-paper">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <p className="text-paper/60">
            © {year} {legalName ?? siteConfig.name}
            {nip ? ` · NIP ${nip}` : ""}. Wszelkie prawa zastrzeżone.
          </p>
        </div>
        {!legalName && <p className="mt-3 text-xs text-paper/50">Pełne dane podmiotu prowadzącego gabinet: do uzupełnienia w config/site.ts.</p>}
      </div>
    </footer>
  );
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-5 font-sans text-xs font-semibold uppercase tracking-[0.16em] text-paper/60">{title}</h2>
      <ul className="space-y-3">{children}</ul>
    </div>
  );
}
