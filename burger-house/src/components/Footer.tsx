import Link from "next/link";
import { LOCATIONS } from "@/data/locations";
import { LEGAL_LINKS, NAV, SITE } from "@/data/site";
import { Hours } from "./Hours";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer on-dark">
      <div className="container">
        <div className="footer__top">
          <div className="footer__brand">
            <Logo variant="light" />
            <p>
              Burgerownia z Warszawy i Grodziska Mazowieckiego. Wołowinę mielimy każdego ranka, bułki pieczemy sami, a każdy burger smażymy dopiero
              po zamówieniu.
            </p>
            <div>
              <p>Zamówienia telefoniczne</p>
              <a className="footer__phone" href={SITE.phone.href}>
                {SITE.phone.display}
              </a>
            </div>
          </div>

          <nav aria-labelledby="footer-nav">
            <h2 id="footer-nav">Na stronie</h2>
            <ul className="footer__links">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href}>{n.label}</Link>
                </li>
              ))}
            </ul>
          </nav>

          {LOCATIONS.map((loc) => (
            <div key={loc.slug} className="footer__loc">
              <div>
                <h2>{loc.city}</h2>
                <address>
                  <strong>{loc.street}</strong>
                  {loc.postalCode}
                  <br />
                  <a href={loc.phone.href}>{loc.phone.display}</a>
                </address>
                <Hours hours={loc.hours} />
                <p style={{ marginTop: "0.75rem" }}>
                  <Link className="text-link" href={`/lokale/${loc.slug}`}>
                    Zobacz lokal
                  </Link>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p>
            © {new Date().getFullYear()} {SITE.name}. Marka fikcyjna – projekt demonstracyjny, dane przykładowe.
          </p>
          <nav aria-label="Dokumenty">
            <ul>
              {LEGAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
