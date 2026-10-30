import { SERVICES } from "@/data/services";
import type { Dictionary } from "@/i18n/dictionaries";
import { resolveImage } from "@/lib/images.server";
import { Photo } from "./Photo";
import { ServiceLink } from "./ServiceLink";
import { Unveil } from "./Unveil";
import styles from "./Services.module.css";

/** Oferta jako spis rozdziałów: każda usługa to osobny rozkład z własnym kadrem. */
export function Services({ dict }: { dict: Dictionary }) {
  const t = dict.services;
  return (
    <section id="services" tabIndex={-1} className={styles.section} aria-labelledby="services-title">
      <div className="container">
        <header className={styles.intro}>
          <h2 id="services-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.lead}>{t.lead}</p>
        </header>

        <ul role="list" className={styles.list}>
          {SERVICES.map((service) => {
            const photo = resolveImage(service.image, dict);
            const text = t.items[service.id];
            return (
              <li key={service.id} className={styles.service} id={`service-${service.id}`}>
                <article className={styles.article} aria-labelledby={`service-${service.id}-title`}>
                  <Unveil className={styles.media} style={{ aspectRatio: photo.aspect }}>
                    <Photo image={photo} label={text.name} sizes="(min-width: 900px) 34vw, 100vw" />
                  </Unveil>

                  <div className={styles.body}>
                    <h3 id={`service-${service.id}-title`} className={styles.name}>
                      {text.name}
                    </h3>
                    <p className={styles.description}>{text.description}</p>
                    <ServiceLink session={service.session}>{text.cta}</ServiceLink>
                  </div>

                  <div className={styles.scope}>
                    <h4 className={styles.scopeTitle}>{t.scopeTitle}</h4>
                    <ul className={styles.scopeList}>
                      {text.scope.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
