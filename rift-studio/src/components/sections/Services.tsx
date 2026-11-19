import { site } from "@/config/site";
import { services } from "@/data/services";
import type { Locale } from "@/i18n/config";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { ServiceViz } from "@/components/services/ServiceViz";
import { BookServiceButton } from "@/components/services/ServiceActions";
import { CheckIcon } from "@/components/ui/Icons";
import styles from "./Services.module.css";

/** SEKCJA 4 – DIGITAL AUDIO INTERFACE: usługi jako moduły wtyczek w programie DAW. */
export function Services({ lang, t }: { lang: Locale; t: Dictionary["services"] }) {
  return (
    <section id="uslugi" className={`section ${styles.section}`} aria-labelledby="services-title">
      <div className={styles.ruler} aria-hidden="true">
        {Array.from({ length: 24 }, (_, i) => (
          <span key={i}>{i + 1}</span>
        ))}
      </div>
      <div className="container">
        <header className="section-head section-head--split">
          <h2 id="services-title" className="section-title" tabIndex={-1} data-focus-target>
            {t.title}
          </h2>
          <p className="lead">{t.lead}</p>
        </header>

        <div className={styles.rack}>
          {services.map((s) => (
            <article key={s.id} className={styles.module} data-module={s.id} aria-labelledby={`svc-${s.id}`}>
              <header className={styles.titlebar}>
                <span className={styles.power} aria-hidden="true" />
                <h3 id={`svc-${s.id}`} className={styles.name}>
                  {s.name[lang]}
                </h3>
                <span className={`${styles.rate} tabular`}>{fmt(t.from, { price: s.hourlyRate })}</span>
              </header>

              <div className={styles.viz}>
                <ServiceViz id={s.id} />
              </div>

              <div className={styles.content}>
                <p className={styles.desc}>{s.description[lang]}</p>

                <div className={styles.columns}>
                  <div>
                    <h4 className={styles.label}>{t.params}</h4>
                    <dl className={styles.params}>
                      {s.params.map((p) => (
                        <div key={p.label.pl}>
                          <dt>{p.label[lang]}</dt>
                          <dd className="tabular">{p.value[lang]}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                  <div>
                    <h4 className={styles.label}>{t.scope}</h4>
                    <ul role="list" className={styles.scope}>
                      {s.scope[lang].map((item) => (
                        <li key={item}>
                          <CheckIcon size={16} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <p className={styles.forWhom}>
                  <span className={styles.label}>{t.forWhom}</span> {s.forWhom[lang]}
                </p>

                <div className={styles.actions}>
                  <BookServiceButton service={s.id} durationMin={s.defaultDuration} label={t.book} />
                  <a className="btn btn-small" href={`mailto:${site.contact.email}?subject=${encodeURIComponent(fmt(t.askSubject, { service: s.name[lang] }))}`}>
                    {t.ask}
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
