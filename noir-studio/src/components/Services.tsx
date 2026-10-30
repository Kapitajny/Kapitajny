import { SERVICES } from "@/data/services";
import { resolveImage } from "@/lib/images.server";
import { Photo } from "./Photo";
import { ServiceLink } from "./ServiceLink";
import { Unveil } from "./Unveil";
import styles from "./Services.module.css";

/** Oferta jako spis rozdziałów: każda usługa to osobny rozkład z własnym kadrem. */
export function Services() {
  return (
    <section id="services" tabIndex={-1} className={styles.section} aria-labelledby="services-title">
      <div className="container">
        <header className={styles.intro}>
          <h2 id="services-title" className={styles.title}>
            Services
          </h2>
          <p className={styles.lead}>
            Every commission starts with a conversation about what the photographs are for. The scope below is where we usually begin; we shape the
            details, the schedule and the quote around your day or your brief.
          </p>
        </header>

        <ul role="list" className={styles.list}>
          {SERVICES.map((service) => {
            const photo = resolveImage(service.image);
            return (
              <li key={service.id} className={styles.service} id={`service-${service.id}`}>
                <article className={styles.article} aria-labelledby={`service-${service.id}-title`}>
                  <Unveil className={styles.media} style={{ aspectRatio: photo.aspect }}>
                    <Photo image={photo} label={service.name} sizes="(min-width: 900px) 34vw, 100vw" />
                  </Unveil>

                  <div className={styles.body}>
                    <h3 id={`service-${service.id}-title`} className={styles.name}>
                      {service.name}
                    </h3>
                    <p className={styles.description}>{service.description}</p>
                    <ServiceLink session={service.session}>{service.cta}</ServiceLink>
                  </div>

                  <div className={styles.scope}>
                    <h4 className={styles.scopeTitle}>What&apos;s included</h4>
                    <ul className={styles.scopeList}>
                      {service.scope.map((line) => (
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
