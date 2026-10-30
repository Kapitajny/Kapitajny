import { navigation, siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <a href="#top" className={styles.logo} aria-label="NOIR STUDIO, back to the top">
          <Logo />
        </a>
        <nav aria-label="Footer">
          <ul role="list" className={styles.nav}>
            {navigation.slice(1).map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-link">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <p className={styles.note}>
          © {new Date().getFullYear()} {siteConfig.name}. A fictional studio designed and built by {siteConfig.agency.name} as a demonstration project.
        </p>
      </div>
    </footer>
  );
}
