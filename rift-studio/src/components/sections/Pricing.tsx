import { site } from "@/config/site";
import { PRICING_IS_DEMO, plans } from "@/data/pricing";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BookServiceButton } from "@/components/services/ServiceActions";
import styles from "./Pricing.module.css";

/** SEKCJA 6 – FUTURISTIC PRICING: cennik jak w studiu – wiersze z zakresem, czasem, ceną i dopłatami. */
export function Pricing({ lang, t }: { lang: Locale; t: Dictionary["pricing"] }) {
  return (
    <section id="cennik" className={`section ${styles.section}`} aria-labelledby="pricing-title">
      <div className="container">
        <header className="section-head">
          <h2 id="pricing-title" className="section-title" tabIndex={-1} data-focus-target>
            {t.title}
          </h2>
          <p className="lead">{t.lead}</p>
        </header>

        <ul role="list" className={styles.list}>
          {plans.map((p) => (
            <li key={p.id} className={styles.row} data-featured={p.featured || undefined}>
              <div className={styles.what}>
                <h3 className={styles.name}>
                  {p.name[lang]}
                  {p.featured && <span className={styles.flag}>{t.featured}</span>}
                </h3>
                <p className={styles.inc}>{p.includes[lang].join(". ")}.</p>
                <p className={styles.extras}>
                  <span>{t.extras}:</span> {p.extras[lang].join("; ")}
                </p>
              </div>
              <p className={styles.time}>
                <span className="sr-only">{t.duration}: </span>
                {p.duration[lang]}
              </p>
              <p className={styles.price}>
                {p.priceFrom && <span className={styles.small}>{t.from} </span>}
                <span className={`${styles.amount} tabular`}>{p.price}</span>
                <span className={styles.small}>
                  {" "}
                  {t.currency} {p.unit[lang]}
                </span>
              </p>
              <div className={styles.cta}>
                {p.bookable ? (
                  <BookServiceButton service={p.service} durationMin={p.bookDuration} label={t.book} className={`btn btn-small ${p.featured ? "btn-volt" : ""}`} />
                ) : (
                  <a className="btn btn-small" href={`mailto:${site.contact.email}?subject=${encodeURIComponent(p.name[lang])}`}>
                    {t.ask}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className={styles.footnote}>
          {t.footnote}
          {PRICING_IS_DEMO && <> {t.demoNotice}</>}
        </p>
      </div>
    </section>
  );
}
