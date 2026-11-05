import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { footerNav, legalNav, siteConfig } from "@/config/site";

export function SiteFooter() {
  const { email, phone } = siteConfig.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark relative overflow-hidden bg-ink text-white">
      <div className="grid-bg-dark pointer-events-none absolute inset-0 opacity-60 [mask-image:linear-gradient(to_bottom,transparent,#000_40%)]" aria-hidden="true" />
      <div className="container-x relative py-16 sm:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" aria-label={`${siteConfig.name} – strona główna`} className="-m-2 inline-block rounded-lg p-2 text-[1.2rem]">
              <Logo accent />
            </Link>
            <p className="mt-5 max-w-sm text-[0.975rem] leading-relaxed text-ash">
              Projektujemy i tworzymy nowoczesne strony internetowe oraz sklepy online – od pierwszej rozmowy po publikację.
            </p>
          </div>

          <nav aria-labelledby="stopka-oferta" className="md:col-span-3">
            <h2 id="stopka-oferta" className="eyebrow eyebrow-gold">
              Nawigacja
            </h2>
            <ul className="mt-5 space-y-1">
              {footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-10 items-center text-white/85 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="eyebrow eyebrow-gold">Dokumenty i kontakt</h2>
            <ul className="mt-5 space-y-1">
              {legalNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="inline-flex min-h-10 items-center text-white/85 transition-colors hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-2 text-[0.95rem]">
              <div className="flex gap-2">
                <dt className="text-ash">E-mail:</dt>
                <dd>
                  {email ? (
                    <a href={`mailto:${email}`} className="link">
                      {email}
                    </a>
                  ) : (
                    <span className="text-ash italic">do uzupełnienia</span>
                  )}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-ash">Telefon:</dt>
                <dd>
                  {phone ? (
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="link">
                      {phone}
                    </a>
                  ) : (
                    <span className="text-ash italic">do uzupełnienia</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-white/10 pt-6 text-[0.875rem] text-ash sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Wszelkie prawa zastrzeżone.
          </p>
          <p>Projekty w realizacjach to koncepcje demonstracyjne dla fikcyjnych marek.</p>
        </div>
      </div>
    </footer>
  );
}
