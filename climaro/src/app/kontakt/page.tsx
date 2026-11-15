import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { AreaIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/Icons";
import { PageIntro } from "@/components/PageIntro";
import { site } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Kontakt i bezpłatna wycena",
  description: "Zapytaj o bezpłatną wycenę montażu lub serwisu klimatyzacji, pompy ciepła albo rekuperacji. Grodzisk Mazowiecki, całe województwo mazowieckie.",
  alternates: { canonical: "/kontakt" },
};

export default function ContactPage() {
  return (
    <>
      <PageIntro title="Kontakt i bezpłatna wycena" lead="Opisz instalację albo problem. Odpowiemy z wstępną wyceną i propozycją terminu wizji lokalnej." />

      <section className="theme-light section" aria-label="Formularz i dane kontaktowe">
        <div className={`container ${styles.grid}`}>
          <ContactForm />

          <section className={styles.aside} aria-labelledby="dane-tytul">
            <h2 id="dane-tytul" className={styles.asideTitle}>
              Dane kontaktowe
            </h2>
            <dl className={styles.details}>
              <div>
                <dt>
                  <PhoneIcon />
                  Telefon
                </dt>
                <dd>
                  <a href={site.phoneHref} className={`num ${styles.big}`}>
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <MailIcon />
                  E-mail
                </dt>
                <dd>
                  <a href={`mailto:${site.email}`} className={styles.big}>
                    {site.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt>
                  <PinIcon />
                  Lokalizacja
                </dt>
                <dd>{site.city}</dd>
              </div>
              <div>
                <dt>
                  <AreaIcon />
                  Obszar działania
                </dt>
                <dd>Województwo mazowieckie</dd>
              </div>
            </dl>
            <p className={styles.demo}>Numer telefonu i adres e-mail są danymi demonstracyjnymi.</p>
          </section>
        </div>
      </section>
    </>
  );
}
