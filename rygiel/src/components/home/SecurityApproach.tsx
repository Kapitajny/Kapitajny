import { securityPrinciples } from "@/content/approach";
import { Icon, type IconName } from "@/components/ui/Icon";
import { LinkButton } from "@/components/ui/LinkButton";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { typeset } from "@/lib/typography";
import styles from "./SecurityApproach.module.css";

const principleIcons: IconName[] = ["search", "key", "document", "database", "clipboard"];

export function SecurityApproach() {
  return (
    <section className={styles.section} aria-labelledby="podejscie-title">
      <div className="container">
        <SectionHeading
          id="podejscie-title"
          title="Jak podchodzimy do bezpieczeństwa"
          intro={
            <p>
              {typeset(
                "Żadna firma nie może obiecać, że do incydentu nigdy nie dojdzie. Możemy zmniejszyć ryzyko, ograniczyć skutki i przygotować szybki powrót do pracy. W każdym projekcie kierujemy się pięcioma zasadami.",
              )}
            </p>
          }
        />
        <ul role="list" className={styles.grid}>
          {securityPrinciples.map((principle, index) => (
            <li key={principle.title} className={styles.card}>
              <span className={styles.icon}>
                <Icon name={principleIcons[index] ?? "shield"} size={22} />
              </span>
              <h3 className={styles.title}>{principle.title}</h3>
              <p className={styles.text}>{principle.text}</p>
              <p className={styles.practice}>
                <span className={styles.practiceLabel}>W praktyce:</span> {principle.practice}
              </p>
            </li>
          ))}
          <li className={`${styles.card} ${styles.cta}`}>
            <span className={styles.icon}>
              <Icon name="shield" size={22} />
            </span>
            <h3 className={styles.title}>Sprawdź, gdzie Twoja firma ma luki</h3>
            <p className={styles.text}>{typeset("Audyt pokazuje najważniejsze ryzyka i kolejność działań – zrozumiale dla zarządu i osoby od IT.")}</p>
            <LinkButton href="/uslugi/cyberbezpieczenstwo" variant="inverse" className={styles.ctaButton}>
              Zobacz, jak wygląda audyt
            </LinkButton>
          </li>
        </ul>
      </div>
    </section>
  );
}
