import { mainNav, primaryCta } from "@/content/site";
import { LinkButton } from "@/components/ui/LinkButton";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";
import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.css";

export function SiteHeader() {
  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Logo />
        <nav className={styles.desktopNav} aria-label="Główna nawigacja">
          <NavLinks items={mainNav} listClassName={styles.list} linkClassName={styles.link} />
        </nav>
        <LinkButton href={primaryCta.href} className={styles.cta}>
          {primaryCta.label}
        </LinkButton>
        <MobileNav />
      </div>
    </header>
  );
}
