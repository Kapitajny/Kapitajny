import Link from "next/link";
import { LOCATIONS } from "@/data/locations";
import { LEGAL_LINKS, NAV, SITE } from "@/data/site";
import { Hours } from "./Hours";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer dark">
      <div className="wrap">
        <div className="footer__grid">
          <div className="footer__about">
            <Logo />
            <p>Burgerownia z Warszawy i Grodziska Mazowieckiego. Wołowinę mielimy rano, bułki pieczemy sami, a każdy burger powstaje po zamówieniu.</p>
            <div>
              <p>Zamówienia telefoniczne</p>
              <a className="footer__phone" href={SITE.phone.href}>
                {SITE.phone.display}
              </a>
            </div>
          </div>
          <nav aria-labelledby="f-nav">
            <h2 id="f-nav">Strona</h2>
            <ul>
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
          {LOCATIONS.map((loc) => (
            <div key={loc.slug}>
              <h2>{loc.city}</h2>
              <address>
                <strong>{loc.street}</strong>
                {loc.postalCode}
                <br />
                <a href={loc.phone.href}>{loc.phone.display}</a>
              </address>
              <div style={{ marginTop: "0.9rem" }}>
                <Hours hours={loc.hours} />
              </div>
            </div>
          ))}
        </div>
        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} {SITE.name}. Marka fikcyjna, dane przykładowe. Koncepcja 02 projektu strony.</p>
          <ul>
            {LEGAL_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href}>{l.label}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
