import type { ResolvedImage } from "@/config/images";
import type { Dictionary } from "@/i18n/dictionaries";
import { Photo } from "./Photo";
import styles from "./Hero.module.css";

/** Wcięcia kolejnych wersów (w em) – schodkowy rytm nagłówka. */
const INDENTS = [0, 0.9, 0.35];
/** Średnia szerokość wersalikowej litery Playfair Display (w em) – do dopasowania nagłówka do szerokości. */
const CAP_WIDTH = 0.66;

/**
 * Pierwszy ekran: pełnoekranowa fotografia, która „wywołuje się” przy wejściu,
 * i typografia nałożona w spokojnej części kadru. Wielkość nagłówka dopasowuje się
 * do najdłuższego wersu, więc dłuższe polskie słowa mieszczą się tak samo jak angielskie.
 */
export function Hero({ image, t }: { image: ResolvedImage; t: Dictionary["hero"] }) {
  const fit = Math.max(...t.titleLines.map((line, i) => line.length * CAP_WIDTH + (INDENTS[i] ?? 0)));

  return (
    <section id="top" tabIndex={-1} className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.media}>
        <Photo image={image} sizes="100vw" preload tone="dark" />
      </div>

      <div className={styles.content}>
        <div className={styles.titleBox}>
          <h1 id="hero-title" className={styles.title} style={{ ["--fit" as string]: fit.toFixed(2) }}>
            {t.titleLines.map((line, i) => (
              <span key={line} className={styles.line} style={{ ["--i" as string]: i, paddingLeft: `${INDENTS[i] ?? 0}em` }}>
                <span>{line}</span>
              </span>
            ))}
          </h1>
        </div>
        <div className={styles.after}>
          <p className={styles.subtitle}>{t.subtitle}</p>
          <a href="#portfolio" className="button button--light">
            {t.cta}
          </a>
        </div>
      </div>

      <a href="#portfolio" className={styles.scroll} aria-label={t.scrollLabel}>
        <span className={styles.scrollLine} aria-hidden="true" />
        <span className={styles.scrollText} aria-hidden="true">
          {t.scroll}
        </span>
      </a>
    </section>
  );
}
