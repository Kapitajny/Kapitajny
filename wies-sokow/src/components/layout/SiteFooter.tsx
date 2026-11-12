import Link from "next/link";
import { site } from "@/data/site";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

const footerNav = site.nav.filter((item) => item.href !== "/produkcja");

export function SiteFooter() {
  return (
    <footer className={`${styles.footer} on-dark`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Link href="/" aria-label="Wieś Soków – strona główna">
            <Logo mono />
          </Link>
          <p>
            Tłoczymy soki z jabłek i gruszek i sprzedajemy je bezpośrednio, w opakowaniach z kranikiem o pojemności 3 i 5
            litrów.
          </p>
        </div>

        <nav aria-labelledby="footer-nav">
          <h2 id="footer-nav" className={styles.heading}>
            Nawigacja
          </h2>
          <ul className={styles.list}>
            {footerNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.contact}>
          <h2 className={styles.heading}>Kontakt</h2>
          <ul className={styles.list}>
            <li>{site.contact.phone}</li>
            <li>{site.contact.email}</li>
          </ul>
          <p className={styles.small}>Dane demonstracyjne. Numer i adres nie są prawdziwymi kanałami kontaktu.</p>
        </div>

        <nav aria-labelledby="footer-info">
          <h2 id="footer-info" className={styles.heading}>
            Informacje
          </h2>
          <ul className={styles.list}>
            {site.legal.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {new Date().getFullYear()} Wieś Soków. Wszelkie prawa zastrzeżone.</p>
        <p>
          Projekt demonstracyjny agencji ComputerIT. Firma, produkty, ceny, opinie i dane kontaktowe są przykładowe.
        </p>
      </div>
    </footer>
  );
}
