import Link from "next/link";
import { site } from "@/data/site";
import { PhoneIcon } from "./Icons";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={`theme-dark ${styles.header}`}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand} aria-label="CLIMARO – strona główna">
          <Logo className={styles.logo} />
        </Link>

        <nav aria-label="Menu główne" className={styles.nav}>
          <NavLinks className={styles.navList} linkClassName={styles.navLink} />
        </nav>

        <div className={styles.actions}>
          <a href={site.phoneHref} className={styles.phone}>
            <PhoneIcon />
            <span className="num">{site.phone}</span>
          </a>
          {/* Na węższych ekranach telefon zostaje w nagłówku jako przycisk z ikoną. */}
          <a href={site.phoneHref} className={styles.phoneCompact} aria-label={`Zadzwoń: ${site.phone}`}>
            <PhoneIcon />
          </a>
          <Link href="/kontakt" className={`btn btn-primary btn-small ${styles.cta}`}>
            Bezpłatna wycena
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
