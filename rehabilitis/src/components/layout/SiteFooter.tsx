import Link from "next/link";
import { cacheLife } from "next/cache";
import { formatAddress, legalNav, mainNav, phoneHref, siteConfig } from "@/config/site";
import { Logo } from "./Logo";

async function currentYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

const missing = <span className="text-white/60">do uzupełnienia</span>;

export async function SiteFooter() {
  const year = await currentYear();
  const address = formatAddress();
  const { phone, email } = siteConfig.contact;
  const { legalName, nip } = siteConfig.company;

  return (
    <footer className="bg-forest pb-24 text-white sm:pb-0">
      <div className="container-x grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:py-16">
        <div>
          <Logo tone="light" />
          <p className="mt-5 max-w-xs text-[0.95rem] text-white/80">
            Fizjoterapia i rehabilitacja{siteConfig.city ? ` w ${siteConfig.city}` : ""} – wizyty indywidualne po wcześniejszym umówieniu.
          </p>
        </div>

        <div>
          <h2 className="font-sans text-base font-semibold text-white">Kontakt</h2>
          <ul className="mt-4 space-y-2 text-[0.95rem] text-white/85">
            <li>
              Tel.:{" "}
              {phone ? (
                <a href={phoneHref(phone)} className="font-semibold text-white hover:underline">
                  {phone}
                </a>
              ) : (
                missing
              )}
            </li>
            <li>
              E-mail:{" "}
              {email ? (
                <a href={`mailto:${email}`} className="break-all text-white hover:underline">
                  {email}
                </a>
              ) : (
                missing
              )}
            </li>
            <li>Adres: {address ?? missing}</li>
          </ul>
        </div>

        <div>
          <h2 className="font-sans text-base font-semibold text-white">Godziny otwarcia</h2>
          <dl className="mt-4 space-y-2 text-[0.95rem]">
            {siteConfig.openingHours.map((row) => (
              <div key={row.days}>
                <dt className="text-white/80">{row.days}</dt>
                <dd>{row.hours ?? missing}</dd>
              </div>
            ))}
          </dl>
        </div>

        <nav aria-label="Na stronie">
          <h2 className="font-sans text-base font-semibold text-white">Na stronie</h2>
          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-[0.95rem] lg:grid-cols-1">
            {mainNav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-white/85 hover:text-white hover:underline">
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
                <Link href={item.href} className="underline underline-offset-4 hover:text-white">
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
