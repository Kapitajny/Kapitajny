import type { ResolvedImage } from "@/config/images";
import type { Dictionary } from "@/i18n/dictionaries";
import { Photo } from "./Photo";
import { Unveil } from "./Unveil";
import styles from "./About.module.css";

export function About({ portrait, t }: { portrait: ResolvedImage; t: Dictionary["about"] }) {
  return (
    <section id="about" tabIndex={-1} className={styles.section} aria-labelledby="about-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.portraitColumn}>
          <Unveil className={styles.portrait}>
            <Photo image={portrait} sizes="(min-width: 900px) 42vw, 100vw" tone="dark" />
          </Unveil>
          <p className={styles.portraitCaption}>
            <span className={styles.name}>{t.name}</span>
            <span>{t.role}</span>
          </p>
        </div>

        <div className={styles.text}>
          <h2 id="about-title" className={styles.title}>
            {t.title}
          </h2>

          <div className={styles.story}>
            {t.story.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <blockquote className={styles.quote}>
            <p>{t.quote}</p>
          </blockquote>

          <div className={styles.principles}>
            <h3 className={styles.subhead}>{t.principlesTitle}</h3>
            <dl className={styles.principleList}>
              {t.principles.map((principle) => (
                <div key={principle.title} className={styles.principle}>
                  <dt>{principle.title}</dt>
                  <dd>{principle.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <dl className={styles.facts}>
            {t.facts.map((fact) => (
              <div key={fact.term} className={styles.fact}>
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
