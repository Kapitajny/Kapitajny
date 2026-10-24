import Link from "next/link";
import { company, fullAddress, getDepartment } from "@/content/company";
import { footerNav } from "@/content/navigation";
import { siteConfig } from "@/config/site";
import { mailHref, telHref } from "@/lib/format";
import { Wordmark } from "./Wordmark";

const secretariat = getDepartment("sekretariat");
const sales = getDepartment("zbyt");

function FooterList({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <div>
      <h2 className="label mb-4 text-on-dark/60">{title}</h2>
      <ul className="ui space-y-2.5 text-[0.9375rem]">
        {links.map((l) => (
          <li key={l.href + l.label}>
            <Link href={l.href} className="link inline-flex min-h-6 items-center text-on-dark/90 hover:text-on-dark">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="on-dark bg-ink text-on-dark">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr] lg:gap-16 lg:py-20">
        <div>
          <Wordmark tone="light" />
          <address className="mt-6 not-italic">
            <p className="ui text-[0.9375rem] font-semibold">{company.legalName}</p>
            <p className="mt-1 text-on-dark/80">{fullAddress}</p>
            <p className="ui mt-3 text-[0.875rem] text-on-dark/65">
              KRS {company.registry.krs}, NIP {company.registry.nip}
            </p>
          </address>
          <dl className="ui mt-8 grid gap-4 text-[0.9375rem] sm:grid-cols-2 lg:grid-cols-1">
            <div>
              <dt className="text-on-dark/60">Sekretariat</dt>
              <dd className="mt-1 space-y-1">
                <a href={telHref(secretariat.phones[0].display)} className="link block font-semibold">
                  {secretariat.phones[0].display}
                </a>
                <a href={mailHref(company.email)} className="link block">
                  {company.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-on-dark/60">Dział Zbytu – sprzedaż hurtowa</dt>
              <dd className="mt-1">
                <a href={telHref(sales.phones[0].display)} className="link font-semibold">
                  {sales.phones[0].display}
                </a>
              </dd>
            </div>
          </dl>
        </div>

        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          <FooterList title="Oferta" links={footerNav.oferta} />
          <FooterList title="Współpraca" links={footerNav.biznes} />
          <FooterList title="Firma i kariera" links={footerNav.firma} />
          <FooterList
            title="Dokumenty"
            links={[...footerNav.dokumenty, ...(siteConfig.demoMode ? [{ href: "/o-koncepcji", label: "O tej koncepcji" }] : [])]}
          />
        </div>
      </div>

      <div className="border-t border-on-dark/15">
        <div className="container-x ui flex flex-col gap-3 py-6 text-[0.8125rem] text-on-dark/60 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {company.legalName}</p>
          {siteConfig.demoMode && (
            <p className="max-w-2xl md:text-right">
              Niezależna koncepcja redesignu przygotowana przez {siteConfig.agency.name}, niezatwierdzona przez firmę. Znak słowny jest
              tymczasowy i nie jest oficjalnym logo.
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
