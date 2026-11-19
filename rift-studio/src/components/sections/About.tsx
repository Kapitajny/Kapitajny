import Image from "next/image";
import type { Dictionary } from "@/i18n/dictionaries";
import booth from "../../../public/images/about-booth.jpg";
import portrait from "../../../public/images/about-portrait.jpg";
import room from "../../../public/images/about-studio-room.jpg";
import styles from "./About.module.css";

/** SEKCJA 3 – UNDERGROUND CULTURE: tylna okładka mixtape'u, magazyn, ksero. */
export function About({ t }: { t: Dictionary["about"] }) {
  const sideA = t.rules.filter((r) => r.side === "A");
  const sideB = t.rules.filter((r) => r.side === "B");

  return (
    <section id="o-nas" className={styles.about} aria-labelledby="about-title">
      <div className={`container ${styles.inner}`}>
        <header className={styles.head}>
          <p className={styles.kicker}>{t.kicker}</p>
          <h2 id="about-title" className={styles.title} tabIndex={-1} data-focus-target>
            {t.title}
          </h2>
          <Stamp text={t.stamp} />
        </header>

        <div className={styles.grid}>
          <div className={styles.collage}>
            <figure className={`${styles.photo} ${styles.photoBooth}`}>
              <Image src={booth} alt={t.photos.booth.alt} sizes="(min-width: 960px) 46vw, 92vw" quality={70} placeholder="blur" />
              <figcaption>{t.photos.booth.caption}</figcaption>
            </figure>
            <figure className={`${styles.photo} ${styles.photoPortrait}`}>
              <Image src={portrait} alt={t.photos.portrait.alt} sizes="(min-width: 960px) 26vw, 60vw" quality={70} placeholder="blur" />
              <figcaption>{t.photos.portrait.caption}</figcaption>
            </figure>
            <figure className={`${styles.photo} ${styles.photoRoom}`}>
              <Image src={room} alt={t.photos.room.alt} sizes="(min-width: 960px) 20vw, 50vw" quality={75} placeholder="blur" />
              <figcaption>{t.photos.room.caption}</figcaption>
            </figure>
          </div>

          <div className={styles.copy}>
            {t.body.map((p) => (
              <p key={p.slice(0, 24)}>{p}</p>
            ))}
          </div>
        </div>

        <div className={styles.history}>
          <h3 className={styles.subTitle}>{t.historyTitle}</h3>
          <ol role="list" className={styles.timeline}>
            {t.history.map((h) => (
              <li key={h.year}>
                <span className={styles.year}>{h.year}</span>
                <span className={styles.event}>{h.title}</span>
                <span className={styles.eventText}>{h.text}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className={styles.jcard}>
          <div className={styles.spine} aria-hidden="true">
            RIFT STUDIO <span>2013</span>
          </div>
          <div className={styles.jcardBody}>
            <h3 className={styles.jcardTitle}>{t.rulesTitle}</h3>
            <div className={styles.sides}>
              {[
                { label: t.sideA, items: sideA },
                { label: t.sideB, items: sideB },
              ].map((side) => (
                <div key={side.label}>
                  <h4 className={styles.sideLabel}>{side.label}</h4>
                  <ol role="list" className={styles.tracklist}>
                    {side.items.map((r) => (
                      <li key={r.n}>
                        <span className={styles.trackNo}>{r.n}</span>
                        <span>{r.text}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pieczątka: tekst po okręgu, czerwony tusz. */
function Stamp({ text }: { text: string }) {
  return (
    <svg className={styles.stamp} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>
        <path id="stamp-circle" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0" />
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <text className={styles.stampRing}>
        <textPath href="#stamp-circle" startOffset="0" textLength="430">
          {`${text.toUpperCase()} • ${text.toUpperCase()} •`}
        </textPath>
      </text>
      <text x="100" y="114" textAnchor="middle" className={styles.stampCore}>
        RIFT
      </text>
    </svg>
  );
}
