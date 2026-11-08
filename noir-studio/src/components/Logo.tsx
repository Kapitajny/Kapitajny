import styles from "./Logo.module.css";

/** Znak słowny NOIR STUDIO: kontrast szeryfowego „NOIR” i rozstrzelonego „STUDIO”. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`${styles.logo} ${className}`}>
      <span className={styles.noir}>NOIR</span>
      <span className={styles.studio}>Studio</span>
    </span>
  );
}
