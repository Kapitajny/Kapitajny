"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResolvedImage } from "@/config/images";
import { navigation, siteConfig } from "@/config/site";
import { Logo } from "./Logo";
import { Photo } from "./Photo";
import { scrollToSection } from "./scroll";
import styles from "./MenuOverlay.module.css";

const CLOSE_MS = 650;

/**
 * Pełnoekranowe menu na natywnym <dialog>: pułapkę fokusu, Esc i przywrócenie fokusu
 * zapewnia przeglądarka. Fotografia po prawej zmienia się razem ze wskazaną pozycją.
 */
export function MenuOverlay({
  open,
  onClose,
  images,
  email,
}: {
  open: boolean;
  onClose: () => void;
  images: Record<string, ResolvedImage>;
  email: string | null;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const [phase, setPhase] = useState<"closed" | "open" | "closing">("closed");
  const [active, setActive] = useState(0);
  const closeTimer = useRef<number>(0);
  const closeButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog || !open) return;
    if (!dialog.open) dialog.showModal();
    closeButton.current?.focus();
    // Klasa „open” w następnej klatce, aby przejścia CSS wystartowały od stanu zamkniętego.
    const frame = requestAnimationFrame(() => setPhase("open"));
    return () => cancelAnimationFrame(frame);
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const close = useCallback(
    (then?: () => void) => {
      const dialog = ref.current;
      if (!dialog) return;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      setPhase("closing");
      window.clearTimeout(closeTimer.current);
      closeTimer.current = window.setTimeout(
        () => {
          dialog.close();
          setPhase("closed");
          setActive(0);
          onClose();
          then?.();
        },
        reduced ? 0 : CLOSE_MS,
      );
    },
    [onClose],
  );

  return (
    <dialog
      ref={ref}
      id="site-menu"
      className={styles.menu}
      data-phase={phase}
      aria-label="Site menu"
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className={styles.bar}>
        <a
          href="#top"
          className={styles.logoLink}
          aria-label="NOIR STUDIO, back to the top"
          onClick={(event) => {
            event.preventDefault();
            close(() => scrollToSection("#top"));
          }}
        >
          <Logo />
        </a>
        <button type="button" className={styles.close} onClick={() => close()} ref={closeButton}>
          <span className={styles.closeLabel}>Close</span>
          <span className={styles.cross} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.body}>
        <nav aria-label="Main" className={styles.nav}>
          <ul role="list" className={styles.list} onMouseLeave={() => setActive(0)}>
            {navigation.map((item, index) => (
              <li key={item.href} className={styles.item} style={{ ["--i" as string]: index }}>
                <a
                  href={item.href}
                  className={styles.link}
                  data-active={active === index}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={(event) => {
                    event.preventDefault();
                    close(() => scrollToSection(item.href));
                  }}
                >
                  <span className={styles.linkText}>{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.aside} aria-hidden="true">
          <div className={styles.frame}>
            {navigation.map((item, index) => (
              <div key={item.href} className={styles.slide} data-active={active === index}>
                <Photo image={images[item.image]} sizes="(min-width: 900px) 34vw, 1px" tone="dark" />
              </div>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <p>
            {siteConfig.city}, {siteConfig.country}
          </p>
          {email ? (
            <a className="text-link" href={`mailto:${email}`}>
              {email}
            </a>
          ) : (
            <p>Studio visits by appointment</p>
          )}
        </footer>
      </div>
    </dialog>
  );
}
