"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import heroGrusze from "@/assets/photos/hero-grusze.jpg";
import heroGalaz from "@/assets/photos/hero-jablka-galaz.jpg";
import heroJablonie from "@/assets/photos/hero-sad-jablonie.jpg";
import { ArrowDownIcon } from "@/components/ui/Icons";
import { capacityLabel, flavors, getProduct, type FlavorId } from "@/data/products";
import styles from "./Hero.module.css";

const slides: { flavor: FlavorId; slug: string; word: string; photo: typeof heroJablonie; position: string }[] = [
  { flavor: "jablko", slug: "sok-jablkowy-5l", word: "Jabłko", photo: heroJablonie, position: "70% 50%" },
  { flavor: "gruszka", slug: "sok-gruszkowy-5l", word: "Gruszka", photo: heroGrusze, position: "60% 50%" },
  { flavor: "jablko-gruszka", slug: "sok-jablkowo-gruszkowy-5l", word: "Duet", photo: heroGalaz, position: "30% 60%" },
];

export function Hero() {
  const [active, setActive] = useState(0);
  // Zdjęcia kolejnych smaków dociągamy dopiero po pierwszym wyborze – na start ładuje się tylko jedno.
  const [seen, setSeen] = useState([0]);

  const select = (index: number) => {
    setActive(index);
    setSeen((current) => (current.includes(index) ? current : [...current, index]));
  };

  const current = slides[active];
  const product = getProduct(current.slug);

  return (
    <section className={`${styles.hero} on-dark`} aria-labelledby="hero-title">
      <div className={styles.bg} aria-hidden="true">
        {slides.map((slide, index) =>
          seen.includes(index) ? (
            <Image
              key={slide.flavor}
              src={slide.photo}
              alt=""
              fill
              sizes="100vw"
              quality={75}
              placeholder="blur"
              preload={index === 0}
              data-active={index === active}
              style={{ objectPosition: slide.position }}
            />
          ) : null,
        )}
      </div>

      <div className={styles.panel}>
        <div className={styles.content}>
          <h1 id="hero-title" className={styles.title}>
            Prawdziwy smak owoców zamknięty w&nbsp;każdej kropli.
          </h1>
          <p className={styles.text}>
            Poznaj nasze soki tworzone z&nbsp;owoców i&nbsp;wybierz smak, który zagości w&nbsp;Twoim domu.
          </p>
          <div className={styles.actions}>
            {/* Zwykła kotwica: sekcja produktów jest na tej samej stronie. */}
            <a href="#produkty" className="btn btn--light">
              Poznaj nasze soki
            </a>
            <Link href="/o-nas" className="btn btn--ghost-light">
              O naszej firmie
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.frame} aria-hidden="true" />
      <p className={`${styles.ghost} ${styles.ghostTop}`} aria-hidden="true">
        Soki
      </p>
      <p key={current.word} className={`${styles.ghost} ${styles.ghostBottom}`} aria-hidden="true">
        {current.word}
      </p>

      <div className={styles.stage}>
        <Link
          href={`/sklep/${current.slug}`}
          className={styles.pack}
          aria-label={product ? `${product.name}, ${capacityLabel(product.capacity)} – zobacz produkt` : "Zobacz produkt"}
        >
          {slides.map((slide, index) => (
            <Image
              key={slide.flavor}
              src={flavors[slide.flavor].image}
              alt=""
              sizes="(min-width: 52rem) 28rem, 60vw"
              quality={90}
              preload={index === 0}
              data-active={index === active}
            />
          ))}
        </Link>

        <div className={styles.picker} role="group" aria-label="Wybierz smak">
          {slides.map((slide, index) => (
            <button
              key={slide.flavor}
              type="button"
              className={styles.dot}
              aria-pressed={index === active}
              onClick={() => select(index)}
            >
              <span className={styles.dotLabel}>{flavors[slide.flavor].label}</span>
            </button>
          ))}
        </div>
      </div>

      <a href="#produkty" className={styles.scroll} aria-label="Przewiń do produktów">
        <ArrowDownIcon />
      </a>
    </section>
  );
}
