import type { ResolvedImage } from "@/config/images";
import { siteConfig } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { InquiryForm } from "./InquiryForm";
import { Photo } from "./Photo";
import styles from "./Contact.module.css";

export function Contact({ image, inquiriesEnabled, dict, locale }: { image: ResolvedImage; inquiriesEnabled: boolean; dict: Dictionary; locale: Locale }) {
  const t = dict.contact;
  return (
    <section id="contact" tabIndex={-1} className={styles.section} aria-labelledby="contact-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside}>
          <h2 id="contact-title" className={styles.title}>
            {t.title}
          </h2>
          <p className={styles.lead}>{t.lead}</p>

          <dl className={styles.details}>
            <div>
              <dt>{t.studio}</dt>
              <dd>
                {dict.common.city}, {dict.common.country}
              </dd>
            </div>
            <div>
              <dt>{t.visits}</dt>
              <dd>{t.visitsValue}</dd>
            </div>
            {siteConfig.email && (
              <div>
                <dt>{t.email}</dt>
                <dd>
                  <a className="text-link" href={`mailto:${siteConfig.email}`}>
                    {siteConfig.email}
                  </a>
                </dd>
              </div>
            )}
          </dl>

          <div className={styles.photo}>
            <Photo image={image} sizes="(min-width: 900px) 30vw, 100vw" tone="dark" />
          </div>
        </div>

        <div className={styles.formColumn}>
          <InquiryForm enabled={inquiriesEnabled} email={siteConfig.email} locale={locale} t={dict.form} />
        </div>
      </div>
    </section>
  );
}
