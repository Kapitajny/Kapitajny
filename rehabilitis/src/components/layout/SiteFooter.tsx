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
    <footer className="on-dark bg-brand-strong pb-24 text-white sm:pb-0">
      <div className="page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:py-16">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-small text-white/80">
            Fizjoterapia i rehabilitacja{siteConfig.city ? ` w ${siteConfig.city}` : ""}. Wizyty indywidualne po wcześniejszym umówieniu.
          </p>
        </div>

        <nav aria-labelledby="stopka-strony">
          <h2 id="stopka-strony" className="text-small font-bold tracking-normal text-white">
            Strony
          </h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 sm:grid-cols-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-small text-white/85 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-small font-bold tracking-normal text-white">Kontakt</h2>
          {phone || email || address ? (
            <ul className="mt-4 space-y-2 text-small text-white/85">
              {phone && (
                <li>
                  <a href={phoneHref(phone)} className="font-bold text-white hover:underline">
                    {phone}
                  </a>
                </li>
              )}
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="break-all text-white hover:underline">
                    {email}
                  </a>
                </li>
              )}
              {address && <li>{address}</li>}
            </ul>
          ) : (
            <p className="mt-4 text-small text-white/80">
              <Link href="/kontakt" className="underline underline-offset-4 hover:text-white">
                Formularz kontaktowy
              </Link>
            </p>
          )}
        </div>

        <div>
          <h2 className="text-small font-bold tracking-normal text-white">Godziny otwarcia</h2>
          {hours.length > 0 ? (
            <dl className="mt-4 space-y-2 text-small">
              {hours.map((row) => (
                <div key={row.days}>
                  <dt className="text-white/80">{row.days}</dt>
                  <dd>{row.hours}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-4 text-small text-white/80">Wizyty po wcześniejszym umówieniu.</p>
          )}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="page flex flex-col gap-2 py-5 text-caption text-white/80 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {legalName ?? siteConfig.name}
            {nip ? `, NIP ${nip}` : ""}
          </p>
          <ul className="flex flex-wrap gap-x-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center underline underline-offset-4 hover:text-white">
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
