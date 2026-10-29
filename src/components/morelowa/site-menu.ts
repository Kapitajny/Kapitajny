"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";

/** Śledzi, która sekcja jest aktualnie na ekranie (do podświetlenia pozycji menu). */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");

  useEffect(() => {
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      // Sekcja jest „aktywna”, gdy przecina pasek tuż pod nagłówkiem.
      { rootMargin: "-30% 0px -65% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids]);

  return active;
}

/** `true`, gdy strona jest przewinięta – do cienia pod nagłówkiem. */
export function useScrolled(offset = 8) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [offset]);

  return scrolled;
}

/**
 * Menu mobilne: blokada przewijania, Escape, pułapka fokusu, zamknięcie po przejściu
 * na szerokość desktopową oraz nawigacja do sekcji z zamknięciem panelu.
 */
export function useMobileMenu(desktopQuery: string) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  // Link z menu: najpierw zdejmujemy blokadę przewijania, potem przewijamy do sekcji
  // (przy zablokowanym przewijaniu natywny skok kotwicy kończy się w złym miejscu).
  const navigateFromMenu = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const hash = event.currentTarget.hash;
      const target = hash ? document.getElementById(hash.slice(1)) : null;
      if (!target) return close();
      event.preventDefault();
      delete document.documentElement.dataset.menuOpen;
      close();
      history.pushState(null, "", hash);
      target.scrollIntoView();
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    },
    [close],
  );

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.dataset.menuOpen = "";
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close(true);
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = [toggleRef.current, ...panelRef.current.querySelectorAll<HTMLElement>("a")].filter(Boolean) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    const desktop = window.matchMedia(desktopQuery);
    const onBreakpoint = () => desktop.matches && close();

    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      delete root.dataset.menuOpen;
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, close, desktopQuery]);

  return { open, setOpen, toggleRef, panelRef, navigateFromMenu };
}
