import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Hero } from "@/components/Hero";
import { HowWeWork } from "@/components/HowWeWork";
import { ServiceCards } from "@/components/ServiceCards";
import { TrustSection } from "@/components/TrustSection";
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

      <section className="theme-light section" aria-labelledby="uslugi-tytul">
        <div className="container">
          <div className={`section-head ${styles.headRow}`}>
            <div className={styles.headText}>
              <h2 id="uslugi-tytul" className="h-section">
                Usługi i ceny
              </h2>
              <p className="lead">Cztery obszary, jeden zespół: od doboru urządzenia po regularny serwis. Ceny początkowe widzisz od razu.</p>
            </div>
            <Link href="/uslugi" className="btn btn-secondary">
              Pełny cennik
            </Link>
          </div>

          <ServiceCards services={services} />

          <p className={styles.priceNote}>{PRICE_NOTE}</p>
        </div>
      </section>

      <section className={`theme-white ${styles.about}`} aria-labelledby="firma-tytul">
        <div className={`container ${styles.aboutGrid}`}>
          <div className={styles.aboutImage}>
            <Image
              src="/images/rekuperacja-maszynownia.jpg"
              alt="Pomieszczenie techniczne z jednostką wewnętrzną pompy ciepła i izolowanymi zasobnikami"
              fill
              sizes="(min-width: 64rem) 45vw, 100vw"
            />
          </div>
          <div className={styles.aboutText}>
            <h2 id="firma-tytul" className="h-section">
              Od {site.foundedYear} roku na Mazowszu
            </h2>
            <p className="lead">
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
                <dt>Dla kogo</dt>
                <dd>Domy, mieszkania, biura, lokale usługowe, wspólnoty</dd>
              </div>
            </dl>
            <Link href="/o-nas" className="btn btn-secondary">
              Więcej o firmie
            </Link>
          </div>
        </div>
      </section>

      <HowWeWork />

      <TrustSection />

      <CtaBand />
    </>
  );
}
