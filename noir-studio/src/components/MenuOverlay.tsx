"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ResolvedImage } from "@/config/images";
import { navigation } from "@/config/site";
import type { Locale } from "@/i18n/config";
import { LanguageSwitch } from "./LanguageSwitch";
import { Logo } from "./Logo";
import { Photo } from "./Photo";
import { scrollToSection } from "./scroll";
import type { HeaderTexts } from "./SiteHeader";
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
  locale,
  t,
}: {
  open: boolean;
  onClose: () => void;
  images: Record<string, ResolvedImage>;
  email: string | null;
  locale: Locale;
  t: HeaderTexts;
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
      aria-label={t.nav.menuDialog}
      onCancel={(event) => {
        event.preventDefault();
        close();
      }}
    >
      <div className={styles.bar}>
        <a
          href="#top"
          className={styles.logoLink}
          aria-label={t.common.backToTop}
          onClick={(event) => {
            event.preventDefault();
            close(() => scrollToSection("#top"));
          }}
        >
          <Logo />
        </a>
        <button type="button" className={styles.close} onClick={() => close()} ref={closeButton}>
          <span className={styles.closeLabel}>{t.nav.close}</span>
          <span className={styles.cross} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.body}>
        <nav aria-label={t.nav.label} className={styles.nav}>
          <ul role="list" className={styles.list} onMouseLeave={() => setActive(0)}>
            {navigation.map((item, index) => (
              <li key={item.id} className={styles.item} style={{ ["--i" as string]: index }}>
                <a
                  href={`#${item.id}`}
                  className={styles.link}
                  data-active={active === index}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={(event) => {
                    event.preventDefault();
                    close(() => scrollToSection(`#${item.id}`));
                  }}
                >
                  <span className={styles.linkText}>{t.nav.items[item.id]}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.aside} aria-hidden="true">
          <div className={styles.frame}>
            {navigation.map((item, index) => (
              <div key={item.id} className={styles.slide} data-active={active === index}>
                <Photo image={images[item.image]} sizes="(min-width: 900px) 34vw, 1px" tone="dark" />
              </div>
            ))}
          </div>
        </div>

        <footer className={styles.footer}>
          <p>
            {t.common.city}, {t.common.country}
          </p>
          <LanguageSwitch locale={locale} label={t.language.label} names={t.language.names} className={styles.language} />
          {email ? (
            <a className="text-link" href={`mailto:${email}`}>
              {email}
            </a>
          ) : (
            <p>{t.common.visitsByAppointment}</p>
          )}
        </footer>
      </div>
    </dialog>
  );
}
