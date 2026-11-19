import { site } from "@/config/site";
import { fmt, type Dictionary } from "@/i18n/dictionaries";
import { InfoIcon, MailIcon, PhoneIcon, PinIcon, socialIcons } from "@/components/ui/Icons";
import { MapEmbed } from "./MapEmbed";
import styles from "./Contact.module.css";

/** Dane kontaktowe, adres, godziny, mapa i media społecznościowe obok formularza rezerwacji. */
export function ContactPanel({ t }: { t: Dictionary["contact"] }) {
  const a = site.address;
  return (
    <div className={styles.panel}>
      <h3 id="contact-title" className={styles.title}>
        {t.title}
      </h3>

      {(a.demo || site.contact.demo) && (
        <p className="demo-note">
          <InfoIcon size={16} />
          {t.demoData}
        </p>
      )}

      <ul role="list" className={styles.lines}>
        <li>
          <PhoneIcon size={18} />
          <span className={styles.k}>{t.phone}</span>
          <a href={site.contact.phoneHref} className={styles.v}>
            {site.contact.phone}
          </a>
        </li>
        <li>
          <MailIcon size={18} />
          <span className={styles.k}>{t.email}</span>
          <a href={`mailto:${site.contact.email}`} className={styles.v}>
            {site.contact.email}
          </a>
        </li>
        <li>
          <PinIcon size={18} />
          <span className={styles.k}>{t.address}</span>
          <address className={styles.v}>
            {a.street}
            <br />
            {a.postalCode} {a.city}
          </address>
        </li>
      </ul>
      <p className={styles.commute}>{t.commute}</p>

      <div>
        <h4 className={styles.sub}>{t.hoursTitle}</h4>
        <dl className={styles.hours}>
          {t.hours.map(([d, h]) => (
            <div key={d}>
              <dt>{d}</dt>
              <dd className="tabular">{h}</dd>
            </div>
          ))}
        </dl>
      </div>

      <MapEmbed t={t} />

      <div>
        <h4 className={styles.sub}>{t.social}</h4>
        <ul role="list" className={styles.social}>
          {site.social.map((s) => {
            const Icon = socialIcons[s.id];
            return (
              <li key={s.id}>
                {s.url ? (
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className={styles.socialBtn} aria-label={s.label}>
                    <Icon size={20} />
                  </a>
                ) : (
                  <span className={styles.socialBtn} title={fmt(t.socialPending, { name: s.label })}>
                    <Icon size={20} />
                    <span className="sr-only">{fmt(t.socialPending, { name: s.label })}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
