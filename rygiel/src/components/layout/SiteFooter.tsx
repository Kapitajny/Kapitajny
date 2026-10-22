import Link from "next/link";
import { legalNav, mainNav, siteConfig } from "@/content/site";
import { services } from "@/content/services";
import { Pending } from "@/components/ui/Pending";
import { LogoMark } from "./Logo";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer id="stopka" className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <p className={styles.wordmark}>
            <LogoMark /> rygiel
          </p>
          <p className={styles.tagline}>
            Administrujemy, zabezpieczamy i odtwarzamy infrastrukturę IT małych i średnich firm. Każdą zmianę opisujemy i
            przekazujemy w dokumentacji.
          </p>
          <p className={styles.demo}>{siteConfig.portfolio.note}</p>
        </div>

        <nav className={styles.column} aria-labelledby="stopka-uslugi">
          <h2 id="stopka-uslugi" className={styles.heading}>
            Usługi
          </h2>
          <ul role="list" className={styles.list}>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={service.href}>{service.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/uslugi#dodatkowe">Wdrożenia, konsultacje, szkolenia</Link>
            </li>
          </ul>
        </nav>

        <nav className={styles.column} aria-labelledby="stopka-serwis">
          <h2 id="stopka-serwis" className={styles.heading}>
            Serwis
          </h2>
          <ul role="list" className={styles.list}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <Link href="/kontakt">Kontakt</Link>
            </li>
          </ul>
        </nav>

        <nav className={styles.column} aria-labelledby="stopka-dokumenty">
          <h2 id="stopka-dokumenty" className={styles.heading}>
            Dokumenty
          </h2>
          <ul role="list" className={styles.list}>
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <section className={styles.column} aria-labelledby="stopka-kontakt">
          <h2 id="stopka-kontakt" className={styles.heading}>
            Kontakt
          </h2>
          <ul role="list" className={styles.list}>
            <li>
              <Link href="/kontakt">Formularz zapytania</Link>
            </li>
            <li>
              {siteConfig.contactEmail ? (
                <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
              ) : (
                <span className={styles.muted}>
                  E-mail: <Pending>adres kontaktowy</Pending>
                </span>
              )}
            </li>
            <li className={styles.muted}>
              Dane rejestrowe: <Pending>nazwa firmy, adres, NIP</Pending>
            </li>
          </ul>
        </section>
      </div>

      <div className="container">
        <div className={styles.bottom}>
        <p>
          © {year} {siteConfig.name}. Projekt demonstracyjny {siteConfig.portfolio.name}.
        </p>
          <p>Serwis nie używa cookies analitycznych ani marketingowych.</p>
        </div>
      </div>
    </footer>
  );
}
