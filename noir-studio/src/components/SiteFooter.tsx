import { navigation, siteConfig } from "@/config/site";
import { format } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

export function SiteFooter({ dict }: { dict: Dictionary }) {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo} aria-label={dict.common.backToTop}>
          <Logo />
        </a>
        <nav aria-label={dict.nav.footerLabel}>
          <ul role="list" className={styles.nav}>
            {navigation.slice(1).map((item) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="text-link">
                  {dict.nav.items[item.id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.note}>
          © {new Date().getFullYear()} {siteConfig.name}. {format(dict.footer.note, { agency: siteConfig.agency.name })}
        </p>
      </div>
    </footer>
  );
}
