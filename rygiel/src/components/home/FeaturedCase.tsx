import { getCaseStudy } from "@/content/cases";
import { caseTitleBlockRows } from "@/components/cases/case-meta";
import { LinkButton } from "@/components/ui/LinkButton";
import { TitleBlock } from "@/components/ui/TitleBlock";
import styles from "./FeaturedCase.module.css";

const FEATURED_SLUG = "kopie-zapasowe-pracowni-projektowej";

export function FeaturedCase() {
  const study = getCaseStudy(FEATURED_SLUG);
  if (!study) return null;

  return (
    <section className={styles.section} aria-labelledby="realizacja-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.copy}>
          <p className={styles.kicker}>Przykładowy projekt. Firma i&nbsp;dane są fikcyjne.</p>
          <h2 id="realizacja-title" className={styles.title}>
            {study.title}
          </h2>
          <p className={styles.summary}>{study.summary}</p>
          <div className={styles.criteria}>
            <h3 className={styles.criteriaTitle}>Projekt uznajemy za zakończony, gdy:</h3>
            <ul role="list">
              {study.criteria.slice(0, 3).map((item) => (
                <li key={item.criterion}>{item.criterion}</li>
              ))}
            </ul>
          </div>
          <div className={styles.actions}>
            <LinkButton href={`/realizacje/${study.slug}`}>Przeczytaj studium przypadku</LinkButton>
            <LinkButton href="/realizacje" variant="secondary">
              Wszystkie realizacje
            </LinkButton>
          </div>
        </div>
        <div className={styles.meta}>
          <TitleBlock rows={caseTitleBlockRows(study)} label="Metryczka realizacji" />
        </div>
      </div>
    </section>
  );
}
