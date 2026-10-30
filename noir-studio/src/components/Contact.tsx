import type { ResolvedImage } from "@/config/images";
import { siteConfig } from "@/config/site";
import { InquiryForm } from "./InquiryForm";
import { Photo } from "./Photo";
import styles from "./Contact.module.css";

export function Contact({ image, inquiriesEnabled }: { image: ResolvedImage; inquiriesEnabled: boolean }) {
  return (
    <section id="contact" tabIndex={-1} className={styles.section} aria-labelledby="contact-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.aside}>
          <h2 id="contact-title" className={styles.title}>
            Let&apos;s plan your photographs.
          </h2>
          <p className={styles.lead}>
            Tell us what you have in mind, roughly when, and who will be in front of the camera. We reply with available dates, an outline of the session
            and a quote.
          </p>

          <dl className={styles.details}>
            <div>
              <dt>Studio</dt>
              <dd>
                {siteConfig.city}, {siteConfig.country}
              </dd>
            </div>
            <div>
              <dt>Visits</dt>
              <dd>By appointment</dd>
            </div>
            {siteConfig.email && (
              <div>
                <dt>Email</dt>
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
          <InquiryForm enabled={inquiriesEnabled} email={siteConfig.email} />
        </div>
      </div>
    </section>
  );
}
