import Link from "next/link";
import type { ComponentProps } from "react";
import styles from "./Button.module.css";

type Variant = "primary" | "secondary" | "inverse";

export function buttonClass({ variant = "primary", size, block }: { variant?: Variant; size?: "large"; block?: boolean } = {}) {
  return [styles.button, styles[variant], size === "large" && styles.large, block && styles.block].filter(Boolean).join(" ");
}

type LinkButtonProps = Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: "large";
  /** Strzałka tylko przy CTA prowadzących dalej w ścieżce zakupowej. */
  withArrow?: boolean;
  className?: string;
};

export function LinkButton({ variant, size, withArrow, className, children, ...rest }: LinkButtonProps) {
  return (
    <Link className={[buttonClass({ variant, size }), className].filter(Boolean).join(" ")} {...rest}>
      {children}
      {withArrow ? <ArrowIcon className={styles.icon} /> : null}
    </Link>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
      <path d="M1 8h13M9 3l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
