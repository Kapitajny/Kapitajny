import { site } from "@/config/site";
import { PRICING_IS_DEMO, plans } from "@/data/pricing";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BookServiceButton } from "@/components/services/ServiceActions";
import { CheckIcon, ClockIcon, InfoIcon, PlusIcon } from "@/components/ui/Icons";
import styles from "./Pricing.module.css";

/** SEKCJA 6 – FUTURISTIC PRICING */
export function Pricing({ lang, t }: { lang: Locale; t: Dictionary["pricing"] }) {
  return (
    <section id="cennik" className={`section ${styles.section}`} aria-labelledby="pricing-title">
      <div className="container">
        <header className="section-head section-head--split">
          <h2 id="pricing-title" className="section-title" tabIndex={-1} data-focus-target>
            {t.title}
          </h2>
          <p className="lead">{t.lead}</p>
        </header>

        {PRICING_IS_DEMO && (
          <p className={`demo-note ${styles.notice}`}>
            <InfoIcon size={16} />
            {t.demoNotice}
          </p>
        )}

        <ul role="list" className={styles.grid}>
          {plans.map((p) => (
            <li key={p.id} className={styles.plan} data-featured={p.featured || undefined}>
              {p.featured && <p className={styles.flag}>{t.featured}</p>}
              <h3 className={styles.name}>{p.name[lang]}</h3>
              <p className={styles.price}>
                {p.priceFrom && <span className={styles.from}>{t.from} </span>}
                <span className={`${styles.amount} tabular`}>{p.price}</span>
                <span className={styles.currency}> {t.currency}</span>
                <span className={styles.unit}> {p.unit[lang]}</span>
              </p>
              <p className={styles.duration}>
                <ClockIcon size={16} />
                <span className="sr-only">{t.duration}: </span>
                {p.duration[lang]}
              </p>

              <div className={styles.block}>
                <h4 className={styles.blockLabel}>{t.includes}</h4>
                <ul role="list" className={styles.list}>
                  {p.includes[lang].map((x) => (
                    <li key={x}>
                      <CheckIcon size={16} className={styles.check} />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.block}>
                <h4 className={styles.blockLabel}>{t.extras}</h4>
                <ul role="list" className={`${styles.list} ${styles.extras}`}>
                  {p.extras[lang].map((x) => (
                    <li key={x}>
                      <PlusIcon size={14} className={styles.plus} />
                      {x}
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.cta}>
                {p.bookable ? (
                  <BookServiceButton service={p.service} durationMin={p.bookDuration} label={t.book} className={`btn ${p.featured ? "btn-volt" : ""} ${styles.btn}`} />
                ) : (
                  <a className={`btn ${styles.btn}`} href={`mailto:${site.contact.email}?subject=${encodeURIComponent(p.name[lang])}`}>
                    {t.ask}
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>

        <p className={styles.footnote}>{t.footnote}</p>
      </div>
    </section>
  );
}
