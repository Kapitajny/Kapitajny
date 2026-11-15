import { getImageProps } from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { formatPrice, getService, type ServiceSlug } from "@/data/services";
import { ChevronIcon } from "./Icons";
import styles from "./Hero.module.css";

// Punkty oznaczeń na zdjęciu (ułamek szerokości i wysokości oryginału 2400 × 1600).
// "visible" – urządzenie widać na zdjęciu; "inside" – instalacja pracuje wewnątrz budynku
// (rysowana linią przerywaną, jak element ukryty na rysunku technicznym).
// "verb" – jakiej pozycji cennika dotyczy cena na etykiecie.
const annotations: { slug: ServiceSlug; x: number; y: number; kind: "visible" | "inside"; verb: string }[] = [
  { slug: "klimatyzacja", x: 0.152, y: 0.215, kind: "inside", verb: "montaż" },
  { slug: "pompy-ciepla", x: 0.585, y: 0.39, kind: "visible", verb: "montaż" },
  { slug: "rekuperacja", x: 0.4, y: 0.155, kind: "inside", verb: "montaż" },
  // Serwis dotyczy tego samego, widocznego urządzenia – znacznik na dolnej części obudowy.
  { slug: "serwis-hvac", x: 0.64, y: 0.6, kind: "visible", verb: "przegląd" },
];

const alt = "Nowoczesny dom z grafitowej cegły; przy betonowej ścianie stoi jednostka zewnętrzna pompy ciepła";

export function Hero() {
  // Kierunek artystyczny: na szerokich ekranach pełne zdjęcie 3:2, na telefonach pionowy kadr z pompą ciepła.
  const {
    props: { srcSet: wideSrcSet, sizes: wideSizes },
  } = getImageProps({
    src: "/images/hero-dom-pompa-ciepla.jpg",
    alt,
    width: 2400,
    height: 1600,
    quality: 75,
    // W pionie (tablet) zdjęcie jest kadrowane po wysokości, więc jest szersze niż ekran.
    sizes: "(orientation: portrait) 150vh, 100vw",
  });
  const {
    props: { srcSet: narrowSrcSet, ...narrowImg },
  } = getImageProps({
    src: "/images/hero-dom-pompa-ciepla-pion.jpg",
    alt,
    width: 1200,
    height: 1600,
    quality: 75,
    sizes: "75vh",
  });

  return (
    <section className={`theme-dark ${styles.hero}`} aria-labelledby="hero-tytul">
      <picture>
        <source media="(min-width: 48rem)" srcSet={wideSrcSet} sizes={wideSizes} />
        <img {...narrowImg} srcSet={narrowSrcSet} alt={alt} fetchPriority="high" loading="eager" className={styles.photo} />
      </picture>
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
              <li
                key={item.slug}
                className={styles.annotation}
                data-kind={item.kind}
                style={{ "--x": item.x, "--y": item.y, "--i": index } as CSSProperties}
              >
                <span className={styles.marker} aria-hidden="true" />
                <span className={styles.leader} aria-hidden="true" />
                <Link href={`/uslugi#${service.slug}`} className={styles.label}>
                  <span className={styles.labelName}>{service.name}</span>
                  <span className={`num ${styles.labelPrice}`}>
                    {item.verb} od {formatPrice(install.from)}
                  </span>
                  <ChevronIcon className={styles.labelIcon} />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className={styles.foot}>
          <p className={styles.priceNote}>Ceny orientacyjne, montaż bez urządzenia – ostateczna wycena zależy od instalacji i zakresu prac.</p>
          <p className={styles.key} aria-hidden="true">
            <span className={styles.keyVisible}>urządzenie na zdjęciu</span>
            <span className={styles.keyInside}>instalacja wewnątrz budynku</span>
          </p>
        </div>
      </div>
    </section>
  );
}
