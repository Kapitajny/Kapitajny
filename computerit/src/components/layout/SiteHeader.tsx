"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from "react";
import { mainNav, siteConfig } from "@/config/site";

const CLOSE_MS = 700;

/**
 * Nagłówek: logo (po opuszczeniu hero) i menu z trzech kresek w prawym górnym rogu.
 * Menu to modalny <dialog> – przechwytuje fokus, zamyka się klawiszem Esc i kliknięciem w przyciemnione tło.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [heroVisible, setHeroVisible] = useState(true);
  const [state, setState] = useState<"closed" | "open" | "closing">("closed");

  useEffect(() => {
    const hero = document.getElementById("start");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setHeroVisible(entry.isIntersecting), {
      rootMargin: "-72px 0px 0px 0px",
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  const open = () => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    dialog.showModal();
    // Klasa stanu w kolejnej klatce, aby przejście clip-path wystartowało od stanu zamkniętego.
    requestAnimationFrame(() => requestAnimationFrame(() => setState("open")));
  };

  const close = useCallback((after?: () => void) => {
    setState("closing");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(
      () => {
        dialogRef.current?.close();
        setState("closed");
        after?.();
      },
      reduce ? 0 : CLOSE_MS,
    );
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    const onClick = (event: globalThis.MouseEvent) => {
      // Kliknięcie poza panelem trafia w sam <dialog> (tło) – zamykamy menu.
      const rect = dialog.getBoundingClientRect();
      const inside = event.clientX >= rect.left && event.clientX <= rect.right && event.clientY >= rect.top && event.clientY <= rect.bottom;
      if (event.target === dialog && !inside) close();
    };
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("click", onClick);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("click", onClick);
    };
  }, [close]);

  const goTo = (event: MouseEvent<HTMLAnchorElement>, id: string) => {
    if (!isHome) {
      // Na podstronach zwykła nawigacja na stronę główną z kotwicą.
      close();
      return;
    }
    event.preventDefault();
    close(() => {
      const target = document.getElementById(id);
      if (!target) return;
      history.pushState(null, "", `#${id}`);
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      target.focus({ preventScroll: true });
    });
  };

  // Na podstronach nie ma hero – nagłówek jest od razu pełny.
  const solid = !isHome || !heroVisible;
  const href = (id: string) => (isHome ? `#${id}` : `/#${id}`);

  return (
    <>
      <a href="#tresc" className="skip-link">
        Przejdź do treści
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow,color] duration-500 ${
          solid ? "bg-cloud/88 text-ink shadow-[0_1px_0_rgb(10_22_51/0.08)] backdrop-blur-md" : "text-white"
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between">
          <Link
            href={isHome ? "#start" : "/"}
            aria-label={`${siteConfig.name} – strona główna`}
            tabIndex={solid ? 0 : -1}
            className={`wide text-[0.95rem] font-semibold tracking-[0.06em] transition-[opacity,transform] duration-500 ${
              solid ? "opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
            }`}
          >
            {siteConfig.wordmark}
          </Link>
          <button type="button" className="burger -mr-3 hover:bg-current/10" aria-label="Otwórz menu" aria-haspopup="dialog" onClick={open}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <dialog ref={dialogRef} className="menu-dialog on-dark" data-state={state === "open" ? "open" : "closed"} aria-label="Menu">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between px-[var(--gutter)] sm:px-12">
            <span className="wide text-[0.95rem] font-semibold tracking-[0.06em] text-white/70">{siteConfig.wordmark}</span>
            <button
              type="button"
              className="burger -mr-3 hover:bg-white/10"
              aria-label="Zamknij menu"
              data-cross={state === "open"}
              onClick={() => close()}
              autoFocus
            >
              <span />
              <span />
              <span />
            </button>
          </div>

          <nav aria-label="Główna nawigacja" className="flex flex-1 flex-col justify-center px-[var(--gutter)] py-10 sm:px-12">
            <ul className="space-y-1">
              {mainNav.map((item, i) => (
                <li key={item.id} className="menu-item" style={{ "--i": i } as CSSProperties}>
                  <a
                    href={href(item.id)}
                    onClick={(event) => goTo(event, item.id)}
                    className="group flex flex-col border-b border-white/10 py-4 outline-offset-4 sm:py-5"
                  >
                    <span className="wide text-[clamp(1.75rem,4.4vw,2.6rem)] leading-tight font-medium tracking-[-0.02em] transition-colors duration-300 group-hover:text-sun">
                      {item.label}
                    </span>
                    <span className="mt-1 text-[0.95rem] text-mist">{item.hint}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu-item px-[var(--gutter)] pb-10 sm:px-12" style={{ "--i": mainNav.length } as CSSProperties}>
            <a href={href("kontakt")} onClick={(event) => goTo(event, "kontakt")} className="btn btn-sun w-full sm:w-auto">
              Wyślij zapytanie
            </a>
          </div>
        </div>
      </dialog>
    </>
  );
}
