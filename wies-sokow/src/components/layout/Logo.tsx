import styles from "./Logo.module.css";

/** Znak: jabłko nad dwiema liniami pól – echo etykiety na opakowaniu. */
export function Logo({ className, mono = false }: { className?: string; mono?: boolean }) {
  return (
    <span className={[styles.logo, mono ? styles.mono : "", className ?? ""].join(" ").trim()}>
      <svg className={styles.mark} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
        <path
          className={styles.apple}
          d="M20 12.4c-2.9-2.3-8.9-1.5-8.9 5 0 5.2 3.7 10.2 6.5 10.2 1.1 0 1.6-.5 2.4-.5s1.3.5 2.4.5c2.8 0 6.5-5 6.5-10.2 0-6.5-6-7.3-8.9-5Z"
        />
        <path className={styles.leaf} d="M20.4 11.3c.1-3 1.9-5.3 4.9-6-.2 3.1-1.9 5.3-4.9 6Z" />
        <path className={styles.field} d="M4.5 33.8c8.8-4.800 22.200-4.800 31 0" />
        <path className={styles.field} d="M9.5 37.6c6.3-2.900 14.700-2.900 21 0" />
      </svg>
      <span className={styles.word}>Wieś Soków</span>
    </span>
  );
}
