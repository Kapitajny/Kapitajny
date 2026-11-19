import { site } from "@/config/site";
import type { Dictionary } from "@/i18n/dictionaries";
import { MailIcon, PhoneIcon, PlusIcon } from "@/components/ui/Icons";
import styles from "./Faq.module.css";

/** SEKCJA 8 – FAQ: natywne <details>, dostępne bez JavaScriptu. */
export function Faq({ t, contact }: { t: Dictionary["faq"]; contact: Dictionary["contact"] }) {
  return (
    <section id="faq" className={`section ${styles.section}`} aria-labelledby="faq-title">
      <div className={`container ${styles.layout}`}>
        <header className={styles.head}>
          <h2 id="faq-title" className="section-title" tabIndex={-1} data-focus-target>
            {t.title}
          </h2>
          <p className="lead">{t.lead}</p>
          <ul role="list" className={styles.contact}>
            <li>
              <a href={site.contact.phoneHref}>
                <PhoneIcon size={18} />
                <span className="sr-only">{contact.phone}: </span>
                {site.contact.phone}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`}>
                <MailIcon size={18} />
                <span className="sr-only">{contact.email}: </span>
                {site.contact.email}
              </a>
            </li>
          </ul>
        </header>

        <div className={styles.list}>
          {t.items.map((item, i) => (
            <details key={item.q} className={styles.item} name="faq" open={i === 0}>
              <summary className={styles.q}>
                <span>{item.q}</span>
                <PlusIcon size={20} className={styles.icon} />
              </summary>
              <div className={styles.a}>
                <p>{item.a}</p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
