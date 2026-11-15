import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Hero } from "@/components/Hero";
import { ServiceIndex } from "@/components/ServiceIndex";
import { PRICE_NOTE, services } from "@/data/services";
import { site } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const reasons = [
  {
    title: "Ceny znasz przed pierwszą rozmową",
    text: "Cennik usług jest jawny. Po wizji lokalnej dostajesz pisemną ofertę z ceną końcową, terminem i zakresem prac.",
  },
  {
    title: "Dobór na podstawie pomiarów",
    text: "Moc klimatyzatora, pompy ciepła czy centrali wentylacyjnej liczymy dla konkretnego budynku i sposobu, w jaki z niego korzystasz.",
  },
  {
    title: "Montaż zgodny z wymaganiami producenta",
    text: "Próba szczelności, próżniowanie instalacji i protokół uruchomienia to warunki, od których zależy gwarancja urządzenia.",
  },
  {
    title: "Jeden zespół od montażu po serwis",
    text: "Instalacje, które wykonaliśmy, serwisujemy sami. Znamy je od pierwszego dnia i wiemy, co sprawdzić przy przeglądzie.",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="theme-graphite section" aria-labelledby="uslugi-tytul">
        <div className="container">
          <div className={styles.head}>
            <h2 id="uslugi-tytul" className={styles.display}>
              Usługi i ceny
            </h2>
            <div className={styles.headAside}>
              <p className="lead">Cztery obszary, jeden zespół: od doboru urządzenia po regularny serwis. Ceny początkowe widzisz od razu.</p>
              <Link href="/uslugi" className="text-link">
                Zakres prac i pełny cennik
              </Link>
            </div>
          </div>

          <ServiceIndex services={services} />

          <p className={styles.priceNote}>{PRICE_NOTE}</p>
        </div>
      </section>

      <section className={`theme-light ${styles.about}`} aria-labelledby="firma-tytul">
        <div className={styles.aboutImage}>
          <Image
            src="/images/dach-jednostki.jpg"
            alt="Jednostki klimatyzacji i wentylacji na dachu nowoczesnego budynku z płytową elewacją"
            fill
            sizes="(min-width: 64rem) 85vw, 100vw"
          />
        </div>
        <div className={styles.aboutText}>
          <h2 id="firma-tytul" className={styles.display}>
            Od {site.foundedYear} roku na Mazowszu
          </h2>
          <p className={styles.aboutLead}>
            CLIMARO to firma instalacyjna z Grodziska Mazowieckiego. Zaczynaliśmy od montażu klimatyzacji w domach i biurach, dziś zajmujemy się też
            pompami ciepła, rekuperacją i stałym serwisem instalacji dla firm.
          </p>
          <dl className={styles.facts}>
            <div>
              <dt>Siedziba</dt>
              <dd>{site.city}</dd>
            </div>
            <div>
              <dt>Obszar działania</dt>
              <dd>Całe {site.area}</dd>
            </div>
            <div>
              <dt>Uprawnienia</dt>
              <dd>Certyfikaty F-gazowe dla firmy i instalatorów</dd>
            </div>
            <div>
              <dt>Dla kogo</dt>
              <dd>Domy, mieszkania, biura, lokale usługowe, wspólnoty</dd>
            </div>
          </dl>
          <Link href="/o-nas" className="btn btn-secondary">
            Więcej o firmie
          </Link>
        </div>
      </section>

      <section className="theme-paper section" aria-labelledby="dlaczego-tytul">
        <div className="container">
          <div className={styles.head}>
            <h2 id="dlaczego-tytul" className={styles.display}>
              Dlaczego CLIMARO
            </h2>
            <div className={styles.headAside}>
              <p className="lead">Nie obiecujemy rzeczy, których nie da się sprawdzić. Oto, na co możesz liczyć przy każdym zleceniu.</p>
            </div>
          </div>
          <ul className={styles.reasons}>
            {reasons.map((reason) => (
              <li key={reason.title}>
                <h3>{reason.title}</h3>
                <p>{reason.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
