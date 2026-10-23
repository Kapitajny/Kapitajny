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
    <footer className="bg-forest pb-24 text-white sm:pb-0">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-[0.95rem] text-white/80">
            Fizjoterapia i rehabilitacja{siteConfig.city ? ` w ${siteConfig.city}` : ""}. Wizyty indywidualne po wcześniejszym umówieniu.
          </p>
        </div>

        {(phone || email || address) && (
          <div>
            <h2 className="font-sans text-base font-bold text-white">Kontakt</h2>
            <ul className="mt-4 space-y-2 text-white/85">
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
          </div>
        )}

        {hours.length > 0 && (
          <div>
            <h2 className="font-sans text-base font-bold text-white">Godziny otwarcia</h2>
            <dl className="mt-4 space-y-2">
              {hours.map((row) => (
                <div key={row.days}>
                  <dt className="text-white/80">{row.days}</dt>
                  <dd>{row.hours}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        <nav aria-label="Na stronie">
          <h2 className="font-sans text-base font-bold text-white">Na stronie</h2>
          <ul className="mt-3 grid grid-cols-2 gap-x-4 lg:grid-cols-1">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-flex min-h-11 items-center text-white/85 hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/15">
        <div className="container-x flex flex-col gap-3 py-6 text-sm text-white/75 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {legalName ?? siteConfig.name}
            {nip ? `, NIP ${nip}` : ""}
          </p>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
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
