import Link from "next/link";
import { services } from "@/data/services";
import { mainNav, site } from "@/data/site";
import { AreaIcon, MailIcon, PhoneIcon, PinIcon } from "./Icons";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className={`theme-dark ${styles.footer}`}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.brand}>
          <Link href="/" aria-label="CLIMARO – strona główna" className={styles.logoLink}>
            <Logo withTagline className={styles.logo} />
          </Link>
          <p className={styles.about}>
            Montaż i serwis klimatyzacji, pomp ciepła i rekuperacji. Działamy od {site.foundedYear} roku na terenie województwa mazowieckiego.
          </p>
        </div>

        <nav aria-labelledby="stopka-strony" className={styles.col}>
          <h2 id="stopka-strony" className={styles.heading}>
            Strony
          </h2>
          <ul className={styles.list}>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="stopka-uslugi" className={styles.col}>
          <h2 id="stopka-uslugi" className={styles.heading}>
            Usługi
          </h2>
          <ul className={styles.list}>
            {services.map((service) => (
              <li key={service.slug}>
                <Link href={`/uslugi#${service.slug}`}>{service.name}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.col}>
          <h2 className={styles.heading}>Kontakt</h2>
          <address className={styles.contact}>
            <a href={site.phoneHref}>
              <PhoneIcon />
              <span className="num">{site.phone}</span>
            </a>
            <a href={`mailto:${site.email}`}>
              <MailIcon />
              <span>{site.email}</span>
            </a>
            <span>
              <PinIcon />
              <span>{site.city}</span>
            </span>
            <span>
              <AreaIcon />
              <span>Obszar działania: {site.area}</span>
            </span>
          </address>
        </div>
      </div>

      <div className={`container ${styles.bottom}`}>
        <p>© {year} CLIMARO</p>
        <Link href="/polityka-prywatnosci">Polityka prywatności</Link>
        <p className={styles.demo}>Projekt demonstracyjny: dane kontaktowe i ceny są przykładowe.</p>
      </div>
    </footer>
  );
}
