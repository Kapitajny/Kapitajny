import Link from "next/link";
import { IconFacebook, IconInstagram, IconPhone, IconTiktok } from "@/components/Icons";
import { Logo } from "@/components/Logo";
import { LOCATIONS } from "@/data/locations";
import { LEGAL_LINKS, NAV, SITE, SOCIAL, VERSIONS } from "@/data/site";

const SOCIAL_ICON = { instagram: IconInstagram, tiktok: IconTiktok, facebook: IconFacebook } as const;

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap">
        <div className="foot__top">
          <Logo className="foot__logo" />
          <p className="foot__claim">{SITE.slogan}</p>
          <a className="btn btn--lg btn--mustard" href={SITE.phone.href}>
            <IconPhone className="btn__ico" />
            Zamów: {SITE.phone.display}
          </a>
        </div>

        <div className="foot__cols">
          <nav aria-label="Stopka: strona" className="foot__col">
            <h2 className="foot__h">Strona</h2>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  {}
                  <a href={n.href}>{n.label}</a>
                </li>
              ))}
              {LEGAL_LINKS.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="foot__col">
            <h2 className="foot__h">Lokale</h2>
            <ul>
              {LOCATIONS.map((l) => (
                <li key={l.slug}>
                  <Link href={`/lokale/${l.slug}`}>
                    {l.city}, {l.street}
                  </Link>
                  <span className="foot__small">{l.hours.map((h) => `${h.label} ${h.opens}–${h.closes}`).join(", ")}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="foot__col">
            <h2 className="foot__h">Obserwuj</h2>
            <ul className="foot__social">
              {SOCIAL.map((s) => {
                const Ico = SOCIAL_ICON[s.id];
                return (
                  <li key={s.id}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer">
                      <Ico className="foot__ico" />
                      <span>
                        {s.label} <span className="foot__small">{s.handle}</span>
                      </span>
                      <span className="sr-only"> (nowa karta)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="foot__col">
            <h2 className="foot__h">Dobrze wiedzieć</h2>
            <ul className="foot__facts">
              <li>Płacisz kartą, BLIK-iem lub gotówką.</li>
              <li>O alergeny w każdej pozycji zapytaj obsługę – mamy pełną listę w lokalu.</li>
              <li>Burgery bezglutenowe podajemy w bułce bez glutenu (+3 zł).</li>
            </ul>
          </div>
        </div>

        <div className="foot__base">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Marka fikcyjna, projekt demonstracyjny – dane firmy, numery i profile są przykładowe.
          </p>
          <p className="foot__versions">
            Inne koncepcje:{" "}
            {VERSIONS.map((v, i) => (
              <span key={v.href}>
                {i ? ", " : ""}
                <a href={v.href}>{v.label}</a>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
