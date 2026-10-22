"use client";

import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { mainNav, primaryCta } from "@/content/site";
import { LinkButton } from "@/components/ui/LinkButton";
import { NavLinks } from "./NavLinks";
import styles from "./MobileNav.module.css";

// Elementy strony, które przy otwartym menu stają się nieaktywne (inert), aby fokus nie uciekał pod panel.
const BACKGROUND_SELECTORS = ["#tresc", "#stopka"];

export function MobileNav() {
  const pathname = usePathname();
  // Menu jest otwarte tylko dla ścieżki, na której je otwarto – zmiana trasy (także „wstecz”) zamyka je automatycznie.
  const [openOnPath, setOpenOnPath] = useState<string | null>(null);
  const open = openOnPath === pathname;
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = () => setOpenOnPath(null);

  useEffect(() => {
    if (!open) return;

    const background = BACKGROUND_SELECTORS.map((selector) => document.querySelector<HTMLElement>(selector)).filter(
      (element): element is HTMLElement => element !== null,
    );
    background.forEach((element) => {
      element.inert = true;
    });
    document.body.dataset.scrollLocked = "";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpenOnPath(null);
        buttonRef.current?.focus();
      }
    };
    // Po przejściu do układu desktopowego panel nie powinien blokować strony.
    const desktop = window.matchMedia("(min-width: 60.0625rem)");
    const onResize = () => {
      if (desktop.matches) setOpenOnPath(null);
    };

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onResize);
    return () => {
      background.forEach((element) => {
        element.inert = false;
      });
      delete document.body.dataset.scrollLocked;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onResize);
    };
  }, [open]);

  return (
    <div className={styles.root}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpenOnPath(open ? null : pathname)}
      >
        <span className={styles.toggleLabel}>{open ? "Zamknij" : "Menu"}</span>
        <span className={styles.bars} data-open={open || undefined} aria-hidden="true">
          <span />
          <span />
        </span>
      </button>

      <div id={panelId} className={styles.panel} hidden={!open}>
        <nav aria-label="Nawigacja mobilna" className={styles.nav}>
          <NavLinks
            items={[{ href: "/", label: "Strona główna" }, ...mainNav]}
            listClassName={styles.list}
            linkClassName={styles.link}
            onNavigate={close}
          />
        </nav>
        <div className={styles.footer}>
          <LinkButton href={primaryCta.href} size="large" className={styles.cta} onClick={close} withArrow>
            {primaryCta.label}
          </LinkButton>
          <p className={styles.note}>Pierwsza rozmowa służy ustaleniu, czy i&nbsp;jak możemy pomóc. Nie zobowiązuje do współpracy.</p>
        </div>
      </div>
    </div>
  );
}
