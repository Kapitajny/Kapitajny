import Link from "next/link";
import { legalNav, serviceNav, siteConfig } from "@/config/site";
import { Logo } from "./Logo";

const columns = [
  { title: "Usługi", links: serviceNav },
  {
    title: "Oferta",
    links: [
      { href: "/cennik", label: "Cennik pakietów" },
      { href: "/kalkulator", label: "Kalkulator abonamentu" },
      { href: "/wycena", label: "Indywidualna wycena" },
      { href: "/zamowienie", label: "Zamówienie usługi" },
    ],
  },
  {
    title: "InterPodatki",
    links: [
      { href: "/o-nas", label: "O firmie" },
      { href: "/baza-wiedzy", label: "Baza wiedzy" },
      { href: "/panel-demo", label: "Panel klienta (demo)" },
      { href: "/kontakt", label: "Kontakt" },
    ],
  },
  { title: "Dokumenty", links: legalNav },
];

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep text-on-navy">
      <div className="shell grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr] lg:gap-16">
        <div className="max-w-sm">
          <Logo inverted />
          <p className="mt-5 font-serif text-xl leading-snug text-white">{siteConfig.tagline}</p>
          <dl className="mt-8 space-y-3 text-sm">
            <div>
              <dt className="text-white">E-mail (demonstracyjny)</dt>
              <dd>{siteConfig.contact.email}</dd>
            </div>
            <div>
              <dt className="text-white">Telefon (demonstracyjny)</dt>
              <dd className="num">{siteConfig.contact.phoneDisplay}</dd>
            </div>
            <div>
              <dt className="text-white">Godziny pracy</dt>
              <dd>{siteConfig.contact.hours}</dd>
            </div>
          </dl>
        </div>

        <nav aria-label="Stopka" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h2 className="font-sans text-sm font-semibold tracking-normal text-white">{col.title}</h2>
              <ul className="mt-4 space-y-1 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-flex min-h-9 items-center hover:text-white hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-3 py-6 text-[0.8125rem] leading-relaxed lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <p className="max-w-3xl">
            <span className="font-semibold text-white">Projekt demonstracyjny.</span> InterPodatki to fikcyjna marka
            przygotowana przez {siteConfig.agency} jako przykład realizacji. Serwis nie świadczy usług księgowych ani
            doradztwa podatkowego, nie przyjmuje zleceń i nie realizuje płatności. Ceny, dane kontaktowe i dokumenty mają
            charakter przykładowy.
          </p>
          <p className="shrink-0">© {new Date().getFullYear()} InterPodatki (demo)</p>
        </div>
      </div>
    </footer>
  );
}
