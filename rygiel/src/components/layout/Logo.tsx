import Link from "next/link";
import styles from "./Logo.module.css";

/** Znak: dwa słupki ramy i przechodzący przez nie rygiel, który wysuwa się poza ramę – konstrukcja zamknięta. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 30 28" width="30" height="28" aria-hidden="true" focusable="false">
      <rect x="3" y="2" width="3.5" height="24" fill="currentColor" />
      <rect x="16" y="2" width="3.5" height="24" fill="currentColor" />
      <rect x="3" y="11.5" width="25" height="5" fill="var(--c-brand)" />
    </svg>
  );
}

export function Logo({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <Link href="/" className={styles.logo} aria-label="Rygiel – strona główna" onClick={onNavigate}>
      <LogoMark className={styles.mark} />
      <span className={styles.word} aria-hidden="true">
        rygiel
      </span>
    </Link>
  );
}
