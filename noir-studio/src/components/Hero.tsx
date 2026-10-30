import type { ResolvedImage } from "@/config/images";
import { Photo } from "./Photo";
import styles from "./Hero.module.css";

/**
 * Pierwszy ekran: pełnoekranowa fotografia, która „wywołuje się” przy wejściu,
 * i typografia nałożona w spokojnej części kadru.
 */
export function Hero({ image }: { image: ResolvedImage }) {
  return (
    <section id="top" tabIndex={-1} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <Photo image={image} sizes="100vw" preload tone="dark" />
      </div>

      <div className={styles.content}>
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.line} style={{ ["--i" as string]: 0 }}>
            <span>Moments</span>
          </span>
          <span className={styles.line} style={{ ["--i" as string]: 1 }}>
            <span>become</span>
          </span>
          <span className={styles.line} style={{ ["--i" as string]: 2 }}>
            <span>timeless.</span>
          </span>
        </h1>
        <div className={styles.after}>
          <p className={styles.subtitle}>Photography is the art of remembering.</p>
          <a href="#portfolio" className="button button--light">
            Discover our work
          </a>
        </div>
      </div>

      <a href="#portfolio" className={styles.scroll} aria-label="Scroll to the portfolio">
        <span className={styles.scrollLine} aria-hidden="true" />
        <span className={styles.scrollText} aria-hidden="true">
          Scroll
        </span>
      </a>
    </section>
  );
}
