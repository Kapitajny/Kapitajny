import Link from "next/link";
import { mainNav, siteConfig } from "@/config/site";

export function SiteFooter() {
  const { email, phone } = siteConfig.contact;
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark bg-night text-white">
      <div className="container-x pt-[clamp(4.5rem,9vw,7rem)] pb-10">
        <p aria-hidden="true" className="wordmark text-white/95">
          {siteConfig.wordmark.split("").map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </p>

        <div className="mt-14 grid gap-12 border-t border-white/15 pt-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="sr-only">{siteConfig.name}</p>
            <p className="max-w-[26rem] text-mist">
              Niezależne studio projektowania i tworzenia stron internetowych oraz sklepów online dla firm, które chcą dobrze wyglądać w internecie.
            </p>
          </div>

          <nav aria-label="Stopka" className="md:col-span-3">
            <h2 className="text-[0.9375rem] font-semibold [font-stretch:100%] [font-variation-settings:'wdth'_100]">Nawigacja</h2>
            <ul className="mt-4 space-y-2.5">
              {mainNav.map((item) => (
                <li key={item.id}>
                  <Link href={`/#${item.id}`} className="link-underline text-mist hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:col-span-4">
            <h2 className="text-[0.9375rem] font-semibold [font-stretch:100%] [font-variation-settings:'wdth'_100]">Kontakt</h2>
            <dl className="mt-4 space-y-2.5 text-mist">
              <div className="flex gap-3">
                <dt className="w-20 shrink-0">E-mail</dt>
                <dd>
                  {email ? (
                    <a href={`mailto:${email}`} className="link-underline text-white">
                      {email}
                    </a>
                  ) : (
                    <span className="italic">do uzupełnienia</span>
                  )}
                </dd>
              </div>
              <div className="flex gap-3">
                <dt className="w-20 shrink-0">Telefon</dt>
                <dd>
                  {phone ? (
                    <a href={`tel:${phone.replace(/\s+/g, "")}`} className="link-underline text-white">
                      {phone}
                    </a>
                  ) : (
                    <span className="italic">do uzupełnienia</span>
                  )}
                </dd>
              </div>
            </dl>
            <Link href="/#kontakt" className="link-underline mt-6 inline-block font-medium text-white">
              Formularz kontaktowy
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/15 pt-8 text-[0.875rem] text-mist sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {siteConfig.name}. Wszelkie prawa zastrzeżone.
          </p>
          <ul className="flex flex-wrap gap-x-8 gap-y-2">
            <li>
              <Link href="/regulamin" className="link-underline hover:text-white">
                Regulamin
              </Link>
            </li>
            <li>
              <Link href="/polityka-prywatnosci" className="link-underline hover:text-white">
                Polityka prywatności
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
