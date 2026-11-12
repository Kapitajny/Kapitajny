"use client";

import Image, { type StaticImageData } from "next/image";
import { useRef } from "react";
import kuchnia from "@/assets/photos/dom-kuchnia.jpg";
import rodzinnyStol from "@/assets/photos/dom-rodzinny-stol.jpg";
import sniadanie from "@/assets/photos/dom-sniadanie.jpg";
import spotkanie from "@/assets/photos/dom-spotkanie.jpg";
import { ArrowIcon } from "@/components/ui/Icons";
import styles from "./home.module.css";

const scenes: { title: string; text: string; photo: StaticImageData; alt: string; portrait?: boolean; position?: string }[] = [
  {
    title: "Przy śniadaniu",
    text: "Szklanka soku, zanim zacznie się dzień.",
    photo: sniadanie,
    alt: "Dziewczynka ze szklanką soku przy blacie w jasnej kuchni",
    position: "70% 50%",
  },
  {
    title: "Na rodzinnym stole",
    text: "Jeden karton wystarcza na cały obiad.",
    photo: rodzinnyStol,
    alt: "Rodzina wznosi toast szklankami soku nad zastawionym stołem",
    portrait: true,
  },
  {
    title: "Podczas spotkań",
    text: "Stawiasz na stole i każdy nalewa sobie sam.",
    photo: spotkanie,
    alt: "Znajomi przy stole w ogrodzie podają sobie półmisek z owocami",
  },
  {
    title: "W kuchni",
    text: "Do picia, do deserów i domowych lemoniad.",
    photo: kuchnia,
    alt: "Sok nalewany z karafki do szklanki na drewnianym blacie, obok jabłka",
  },
];

export function AtHome() {
  const rail = useRef<HTMLUListElement>(null);

  const scroll = (direction: 1 | -1) => {
    const element = rail.current;
    if (!element) return;
    element.scrollBy({ left: direction * element.clientWidth * 0.7, behavior: "smooth" });
  };

  return (
    <section className={`section ${styles.home}`} aria-labelledby="dom-tytul">
      <div className={`container ${styles.homeHead}`}>
        <h2 id="dom-tytul">Nasze soki w&nbsp;Twoim domu</h2>
        <p className="lead">Na co dzień i od święta. Sok, który pasuje do zwykłego poranka i do długiego stołu.</p>
        <div className={styles.homeNav}>
          <button type="button" onClick={() => scroll(-1)} aria-label="Przewiń zdjęcia w lewo">
            <ArrowIcon direction="left" />
          </button>
          <button type="button" onClick={() => scroll(1)} aria-label="Przewiń zdjęcia w prawo">
            <ArrowIcon />
          </button>
        </div>
      </div>

      <ul ref={rail} className={styles.rail} tabIndex={0} aria-label="Zdjęcia: soki w codziennych sytuacjach">
        {scenes.map((scene) => (
          <li key={scene.title} className={scene.portrait ? styles.railPortrait : undefined}>
            <figure>
              <div className={styles.railPhoto}>
                <Image
                  src={scene.photo}
                  alt={scene.alt}
                  fill
                  sizes={scene.portrait ? "(min-width: 48rem) 20rem, 60vw" : "(min-width: 48rem) 45rem, 86vw"}
                  placeholder="blur"
                  style={scene.position ? { objectPosition: scene.position } : undefined}
                />
              </div>
              <figcaption>
                <strong>{scene.title}</strong>
                <span>{scene.text}</span>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
    </section>
  );
}
