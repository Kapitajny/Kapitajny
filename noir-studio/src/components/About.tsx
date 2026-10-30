import type { ResolvedImage } from "@/config/images";
import { Photo } from "./Photo";
import { Unveil } from "./Unveil";
import styles from "./About.module.css";

const FACTS = [
  { term: "Behind the camera", detail: "Since 2012" },
  { term: "Studio", detail: "Śródmieście, Warszawa" },
  { term: "Works across", detail: "Poland and Europe" },
  { term: "Languages", detail: "Polish, English, Italian" },
];

const PRINCIPLES = [
  {
    title: "Light first",
    text: "We read the light in a room before we take a camera out of the bag. Most of a good photograph is decided there.",
  },
  {
    title: "Direct less, notice more",
    text: "We give just enough direction to put people at ease, then step back and wait for the moment that would have happened anyway.",
  },
  {
    title: "Edit honestly",
    text: "Skin stays skin. We correct light and colour, remove what distracts, and leave the rest of the person alone.",
  },
];

export function About({ portrait }: { portrait: ResolvedImage }) {
  return (
    <section id="about" tabIndex={-1} className={styles.section} aria-labelledby="about-title">
      <div className={`container ${styles.layout}`}>
        <div className={styles.portraitColumn}>
          <Unveil className={styles.portrait}>
            <Photo image={portrait} sizes="(min-width: 900px) 42vw, 100vw" tone="dark" />
          </Unveil>
          <p className={styles.portraitCaption}>
            <span className={styles.name}>Maja Leśniak</span>
            <span>Founder and lead photographer</span>
          </p>
        </div>

        <div className={styles.text}>
          <h2 id="about-title" className={styles.title}>
            Behind every frame, there is a story.
          </h2>

          <div className={styles.story}>
            <p>
              NOIR STUDIO began as a single rented room in central Warsaw: one camera, one light and a roll of grey paper. Maja had spent years assisting
              fashion photographers, learning how much of a picture is decided before the shutter is pressed.
            </p>
            <p>
              She wanted to bring that discipline to the photographs people actually keep: a wedding, a parent&apos;s hands, a child on a Saturday
              morning. The studio still works that way. We take fewer commissions than we could, and we stay with each one from the first conversation to
              the final print.
            </p>
          </div>

          <blockquote className={styles.quote}>
            <p>We would rather make one photograph you keep for forty years than three hundred you scroll past once.</p>
          </blockquote>

          <div className={styles.principles}>
            <h3 className={styles.subhead}>How we work</h3>
            <dl className={styles.principleList}>
              {PRINCIPLES.map((principle) => (
                <div key={principle.title} className={styles.principle}>
                  <dt>{principle.title}</dt>
                  <dd>{principle.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <dl className={styles.facts}>
            {FACTS.map((fact) => (
              <div key={fact.term} className={styles.fact}>
                <dt>{fact.term}</dt>
                <dd>{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
