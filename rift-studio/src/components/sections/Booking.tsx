import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { BookingForm } from "@/components/booking/BookingForm";
import { ContactPanel } from "@/components/booking/ContactPanel";
import { MailIcon, PhoneIcon } from "@/components/ui/Icons";
import styles from "./Booking.module.css";

/** SEKCJA 7 – FUTURISTIC CONTACT + DIGITAL BOOKING INTERFACE */
export function Booking({ lang, t }: { lang: Locale; t: Dictionary }) {
  return (
    <section id="rezerwacja" className={`section ${styles.section}`} aria-labelledby="booking-title">
      <div className="container">
        <header className="section-head section-head--split">
          <h2 id="booking-title" className="section-title" tabIndex={-1} data-focus-target>
            {t.booking.title}
          </h2>
          <div className={styles.intro}>
            <p className="lead">{t.booking.lead}</p>
            <p className={styles.quick}>
              <span>{t.booking.preferCall}</span>
              <a href={site.contact.phoneHref}>
                <PhoneIcon size={16} />
                {site.contact.phone}
              </a>
              <a href={`mailto:${site.contact.email}`}>
                <MailIcon size={16} />
                {site.contact.email}
              </a>
            </p>
          </div>
        </header>

        <div className={styles.layout}>
          <BookingForm lang={lang} t={t.booking} />
          <ContactPanel t={t.contact} />
        </div>
      </div>
    </section>
  );
}
