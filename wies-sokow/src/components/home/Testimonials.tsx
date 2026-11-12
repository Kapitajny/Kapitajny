"use client";

import { useState } from "react";
import { ArrowIcon } from "@/components/ui/Icons";
import { testimonials } from "@/data/testimonials";
import styles from "./home.module.css";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const total = testimonials.length;
  const current = testimonials[index];

  return (
    <section className={`section ${styles.reviews}`} aria-labelledby="opinie-tytul">
      <div className={`container ${styles.reviewsGrid}`}>
        <div className={styles.reviewsIntro}>
          <h2 id="opinie-tytul">Opinie klientów</h2>
          <p className="demo-note">
            <strong>Opinie przykładowe.</strong> Pokazują układ sekcji i nie pochodzą od prawdziwych klientów.
          </p>
        </div>

        <div className={styles.reviewsStage}>
          <figure key={index} className={styles.review} aria-live="polite">
            <blockquote>
              <p>{current.quote}</p>
            </blockquote>
            <figcaption>
              <span className={styles.reviewAuthor}>
                {current.author}, {current.place}
              </span>
              <span className={styles.reviewTag}>opinia przykładowa</span>
            </figcaption>
          </figure>

          <div className={styles.reviewsNav}>
            <button type="button" onClick={() => setIndex((index - 1 + total) % total)} aria-label="Poprzednia opinia">
              <ArrowIcon direction="left" />
            </button>
            <span className={styles.reviewsCount} aria-hidden="true">
              {index + 1} / {total}
            </span>
            <button type="button" onClick={() => setIndex((index + 1) % total)} aria-label="Następna opinia">
              <ArrowIcon />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
