import { Icon, type IconName } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/LinkButton";
import { Illustration } from "@/components/ui/Illustration";
import { typeset, typesetHeading } from "@/lib/typography";
import styles from "./Hero.module.css";

const highlights = [
  "Stała administracja komputerów, serwerów i kont",
  "Audyty i testy bezpieczeństwa za pisemną zgodą",
  "Kopie zapasowe sprawdzane testem odtworzenia",
];

// Przykładowe statusy z przeglądu środowiska – ilustracja tego, co klient widzi w raporcie.
const statuses: { icon: IconName; title: string; detail: string }[] = [
  { icon: "shield", title: "Drugi składnik logowania", detail: "Włączony na kontach firmowych" },
  { icon: "database", title: "Test odtworzenia kopii", detail: "Zaliczony, protokół w dokumentacji" },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <h1 id="hero-title" className={`display ${styles.title}`}>
            {typesetHeading("Obsługa IT i cyberbezpieczeństwo dla małych i średnich firm")}
          </h1>
          <p className={`lede ${styles.lede}`}>
            {typeset(
              "Administrujemy infrastrukturą, zabezpieczamy dane i pomagamy pracownikom na co dzień. Pracujemy z biurami, firmami usługowymi i sklepami internetowymi, które przetwarzają dane klientów.",
            )}
          </p>
          <div className={styles.actions}>
            <LinkButton href="/kontakt" size="large">
              Umów konsultację
            </LinkButton>
            <LinkButton href="/uslugi" variant="secondary" size="large">
              Zakres usług
            </LinkButton>
          </div>
          <ul role="list" className={styles.highlights}>
            {highlights.map((item) => (
              <li key={item}>
                <span className={styles.check}>
                  <Icon name="check" size={16} />
                </span>
                {typeset(item)}
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.media}>
          <Illustration priority sizes="(max-width: 60rem) 100vw, 620px" />
          <ul role="list" className={styles.statuses} aria-label="Przykładowe statusy z przeglądu środowiska">
            {statuses.map((status) => (
              <li key={status.title} className={styles.status}>
                <span className={styles.statusIcon}>
                  <Icon name={status.icon} size={20} />
                </span>
                <span className={styles.statusText}>
                  <strong>{typeset(status.title)}</strong>
                  <span>{typeset(status.detail)}</span>
                </span>
                <span className={styles.statusDot} aria-hidden="true" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
