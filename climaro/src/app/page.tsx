import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CommissioningReport } from "@/components/CommissioningReport";
import { CtaBand } from "@/components/CtaBand";
import { Hero } from "@/components/Hero";
import { ServiceIndex } from "@/components/ServiceIndex";
import { PRICE_NOTE, services } from "@/data/services";
import { site } from "@/data/site";
import styles from "./page.module.css";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

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
            src="/images/rekuperacja-maszynownia.jpg"
            alt="Pomieszczenie techniczne z jednostką wewnętrzną pompy ciepła i izolowanymi zasobnikami"
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

      <CommissioningReport />

      <CtaBand />
    </>
  );
}
