/* eslint-disable @next/next/no-html-link-for-pages -- linki do sekcji (/#menu) celowo jako <a>: <Link> nie przewija, gdy router uważa adres za niezmieniony po kliknięciu kotwicy w spisie kategorii */
import Link from "next/link";
import { LOCATIONS } from "@/data/locations";
import { LEGAL_LINKS, NAV, SITE, VERSIONS } from "@/data/site";

export function Footer() {
  return (
    <footer className="footer ink">
      <div className="frame">
        <div className="grid footer__grid">
          <div className="footer__col">
            <h2>Zamówienia</h2>
            <a className="footer__phone" href={SITE.phone.href}>
              {SITE.phone.display}
            </a>
            <p className="grey">Codziennie od 11:00, w niedziele od 12:00.</p>
          </div>
          <nav className="footer__col" aria-labelledby="f-site">
            <h2 id="f-site">Strona</h2>
            {NAV.map((n) => (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ))}
            <a href="/#kontakt">Kontakt</a>
          </nav>
          {LOCATIONS.map((l) => (
            <div key={l.slug} className="footer__col">
              <h2>{l.city}</h2>
              <Link href={`/lokale/${l.slug}`}>{l.street}</Link>
              <span className="grey">{l.postalCode}</span>
              <a className="num" href={l.phone.href}>
                {l.phone.display}
              </a>
            </div>
          ))}
        </div>
      </div>
      <p className="mega footer__word frame" aria-hidden="true">
        Buła
      </p>
      <div className="frame">
        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Marka fikcyjna, dane przykładowe.
          </p>
          <ul>
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
            {VERSIONS.map((v) => (
              <li key={v.href}>
                <a href={v.href}>{v.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
