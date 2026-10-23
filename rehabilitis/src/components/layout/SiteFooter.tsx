import Link from "next/link";
import { cacheLife } from "next/cache";
import { formatAddress, legalNav, mainNav, phoneHref, siteConfig } from "@/config/site";
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
  const hours = siteConfig.openingHours.filter((row) => row.hours);

  return (
    <footer className="border-t border-line bg-white pb-24 sm:pb-0">
      <div className="content grid gap-10 py-14 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_minmax(0,1fr)] lg:py-16">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-small text-muted">
            Fizjoterapia i rehabilitacja{siteConfig.city ? ` w ${siteConfig.city}` : ""}. Wizyty indywidualne po wcześniejszym umówieniu.
          </p>
        </div>

        <nav aria-labelledby="stopka-strony">
          <h2 id="stopka-strony" className="text-small font-semibold type-plain">
            Strony
          </h2>
          <ul className="mt-2 grid grid-cols-2 gap-x-6">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-small text-muted hover:text-brand hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-small font-semibold type-plain">Kontakt</h2>
          <ul className="mt-4 space-y-2 text-small text-muted">
            {phone && (
              <li>
                <a href={phoneHref(phone)} className="font-semibold text-brand-deep hover:underline">
                  {phone}
                </a>
              </li>
            )}
            {email && (
              <li>
                <a href={`mailto:${email}`} className="break-all text-brand-deep hover:underline">
                  {email}
                </a>
              </li>
            )}
            {address && <li>{address}</li>}
            {hours.map((row) => (
              <li key={row.days}>
                {row.days}: <span className="text-ink">{row.hours}</span>
              </li>
            ))}
            {!phone && !email && !address && (
              <li>
                <Link href="/kontakt" className="link">
                  Formularz kontaktowy
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="content flex flex-col gap-2 border-t border-line py-5 text-caption text-muted md:flex-row md:items-center md:justify-between">
        <p>
          © {year} {legalName ?? siteConfig.name}
          {nip ? `, NIP ${nip}` : ""}
        </p>
        <ul className="flex flex-wrap gap-x-6">
          {legalNav.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-brand">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
