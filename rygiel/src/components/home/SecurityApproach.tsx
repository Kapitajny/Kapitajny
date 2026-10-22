import { securityPrinciples } from "@/content/approach";
import styles from "./SecurityApproach.module.css";
import { typeset } from "@/lib/typography";

export function SecurityApproach() {
  return (
    <section className={styles.section} aria-labelledby="podejscie-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.aside}>
          <h2 id="podejscie-title" className={styles.title}>
            Jak podchodzimy do bezpieczeństwa
          </h2>
          <p className={styles.intro}>
            {typeset(
              "Żadna firma nie może obiecać, że do incydentu nigdy nie dojdzie. Możemy zmniejszyć ryzyko, ograniczyć skutki i przygotować szybki powrót do pracy. W każdym projekcie kierujemy się pięcioma zasadami.",
            )}
          </p>
        </div>
        <dl className={styles.list}>
          {securityPrinciples.map((principle) => (
            <div key={principle.title} className={styles.item}>
              <dt className={styles.itemTitle}>{principle.title}</dt>
              <dd className={styles.itemText}>
                <p>{principle.text}</p>
                <p className={styles.practice}>
                  <span className={styles.practiceLabel}>W praktyce</span>
                  {principle.practice}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
