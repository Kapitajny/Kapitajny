import styles from "./Logo.module.css";

/**
 * Znak RIFT: słowo rozcięte poziomą szczeliną na wysokości połowy wersalików.
 * Dolna połowa liter jest przesunięta w prawo, w szczelinie świeci linia sygnału (cyjan → fiolet).
 * `uid` – unikalny prefiks identyfikatorów SVG (logo występuje na stronie kilka razy).
 */
export function Logo({ size = "md", uid }: { size?: "md" | "lg"; uid: string }) {
  const word = (
    <text x="0" y="34" textLength="112" lengthAdjust="spacingAndGlyphs" className={styles.text}>
      RIFT
    </text>
  );
  return (
    <span className={`${styles.logo} ${size === "lg" ? styles.lg : ""}`}>
      <svg viewBox="0 0 118 40" className={styles.mark} aria-hidden="true" focusable="false">
        <defs>
          <clipPath id={`${uid}-top`}>
            <rect x="0" y="0" width="118" height="21" />
          </clipPath>
          <clipPath id={`${uid}-bottom`}>
            <rect x="0" y="23.4" width="118" height="17" />
          </clipPath>
          <linearGradient id={`${uid}-sig`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#3be8ff" />
            <stop offset="1" stopColor="#8a63ff" />
          </linearGradient>
        </defs>
        <g clipPath={`url(#${uid}-top)`}>{word}</g>
        <g clipPath={`url(#${uid}-bottom)`} transform="translate(3.5 0)">
          {word}
        </g>
        <rect x="0" y="21.6" width="118" height="1.3" fill={`url(#${uid}-sig)`} />
      </svg>
      <span className={styles.sub} aria-hidden="true">
        studio
      </span>
      <span className="sr-only">RIFT Studio</span>
    </span>
  );
}
