import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice, getService, type ServiceSlug } from "@/data/services";
import { ChevronIcon } from "./Icons";
import styles from "./Hero.module.css";

// Punkty oznaczeń na zdjęciu (ułamek szerokości i wysokości oryginału 2400 × 1600).
// Wskazują miejsca w budynku, w których pracuje dana instalacja.
const annotations: { slug: ServiceSlug; x: number; y: number }[] = [
  { slug: "klimatyzacja", x: 0.152, y: 0.215 },
  { slug: "pompy-ciepla", x: 0.585, y: 0.39 },
  { slug: "rekuperacja", x: 0.43, y: 0.145 },
];

export function Hero() {
  return (
    <section className={`theme-dark ${styles.hero}`} aria-labelledby="hero-tytul">
      <Image
        src="/images/hero-dom-pompa-ciepla.jpg"
        alt="Nowoczesny dom z grafitowej cegły; przy betonowej ścianie stoi jednostka zewnętrzna pompy ciepła"
        fill
        preload
        quality={75}
        // W pionie zdjęcie jest kadrowane po wysokości, więc jest szersze niż ekran.
        sizes="(orientation: portrait) 75vh, 100vw"
        className={styles.photo}
      />
      <div className={styles.scrim} aria-hidden="true" />

      <div className={`container ${styles.content}`}>
        <h1 id="hero-tytul" className={styles.title}>
          <span>Komfort.</span> <span>Efektywność.</span> <span>Nowoczesność.</span>
        </h1>
        <p className={styles.subtitle}>Klimatyzacja, pompy ciepła i wentylacja – kompleksowe rozwiązania dla Twojego domu i biznesu.</p>
        <div className={styles.actions}>
          <Link href="/kontakt" className="btn btn-primary">
            Bezpłatna wycena
          </Link>
          <Link href="/uslugi" className="btn btn-secondary">
            Poznaj naszą ofertę
          </Link>
        </div>

        <ul className={styles.annotations} aria-label="Ceny montażu – sprawdź zakres i pełny cennik">
          {annotations.map((item, index) => {
            const service = getService(item.slug);
            if (!service) return null;
            const install = service.prices[0];
            return (
              <li key={item.slug} className={styles.annotation} style={{ "--x": item.x, "--y": item.y, "--i": index } as CSSProperties}>
                <span className={styles.marker} aria-hidden="true" />
                <span className={styles.leader} aria-hidden="true" />
                <Link href={`/uslugi#${service.slug}`} className={styles.label}>
                  <span className={styles.labelName}>{service.name}</span>
                  <span className={`num ${styles.labelPrice}`}>
                    {install.label.split(" ")[0].toLowerCase()} od {formatPrice(install.from)}
                  </span>
                  <ChevronIcon className={styles.labelIcon} />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
