import { InfrastructureSection } from "@/components/diagrams/InfrastructureSection";
import { LinkButton } from "@/components/ui/LinkButton";
import { typeset } from "@/lib/typography";
import styles from "./Hero.module.css";

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Obsługa IT, cyberbezpieczeństwo, chmura i kopie zapasowe</p>
          <h1 id="hero-title" className={`display ${styles.title}`}>
            Administrujemy, zabezpieczamy i&nbsp;odtwarzamy IT małych i&nbsp;średnich firm.
          </h1>
          <p className={`lede ${styles.lede}`}>
            {typeset(
              "Jeden zespół od codziennego wsparcia pracowników, audytu bezpieczeństwa i kopii zapasowych sprawdzonych testem odtworzenia. Pracujemy z biurami, firmami usługowymi i sklepami internetowymi, które przetwarzają dane klientów.",
            )}
          </p>
          <div className={styles.actions}>
            <LinkButton href="/kontakt" size="large" withArrow>
              Umów konsultację
            </LinkButton>
            <LinkButton href="/uslugi" variant="secondary" size="large">
              Zobacz zakres usług
            </LinkButton>
          </div>
          <p className={styles.reassure}>
            Pierwsza rozmowa nie zobowiązuje do współpracy. Po niej wiesz, od czego warto zacząć.
          </p>
        </div>
        <div className={styles.drawing}>
          <InfrastructureSection />
        </div>
      </div>
    </section>
  );
}
