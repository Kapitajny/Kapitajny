"use client";

import { useEffect, useRef, useState } from "react";
import type { ResolvedImage } from "@/config/images";
import { Logo } from "./Logo";
import { MenuOverlay } from "./MenuOverlay";
import styles from "./SiteHeader.module.css";

type HeaderState = "over-hero" | "solid" | "hidden";

/**
 * Nagłówek: znak po lewej, przycisk menu (trzy kreski) po prawej.
 * Nad zdjęciem otwierającym jest przezroczysty; niżej chowa się przy przewijaniu w dół
 * i wraca jako ciemny pasek przy przewijaniu w górę.
 */
export function SiteHeader({ menuImages, email }: { menuImages: Record<string, ResolvedImage>; email: string | null }) {
  const [state, setState] = useState<HeaderState>("over-hero");
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const travel = useRef(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const y = window.scrollY;
      const delta = y - lastY.current;
      lastY.current = y;
      // Droga przewinięta w bieżącym kierunku – wolne przewijanie też zmienia stan.
      if (Math.sign(delta) !== Math.sign(travel.current)) travel.current = 0;
      travel.current += delta;
      // Przezroczysty, dopóki nagłówek leży na zdjęciu otwierającym.
      const heroEnd = (document.getElementById("top")?.offsetHeight ?? window.innerHeight) - 90;
      if (y < heroEnd) setState("over-hero");
      else if (travel.current > 12) setState("hidden");
      else if (travel.current < -12) setState("solid");
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <header className={styles.header} data-state={state} onFocusCapture={() => state === "hidden" && setState("solid")}>
        <div className={styles.inner}>
          <a href="#top" className={styles.logoLink} aria-label="NOIR STUDIO, back to the top">
            <Logo />
          </a>
          <button
            type="button"
            className={styles.menuButton}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            onClick={() => setMenuOpen(true)}
          >
            <span className={styles.menuLabel}>Menu</span>
            <span className={styles.burger} aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </header>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} images={menuImages} email={email} />
    </>
  );
}
