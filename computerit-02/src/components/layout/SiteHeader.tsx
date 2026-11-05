"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Logo } from "@/components/brand/Logo";
import { ArrowRight } from "@/components/ui/Icons";
import { mainNav, siteConfig } from "@/config/site";

const CLOSE_MS = 300;

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

/**
 * Nagłówek przyklejony do góry. Na dużych ekranach pełna nawigacja, na mniejszych przycisk menu,
 * który otwiera modalny <dialog> (pułapka fokusu, Esc zamyka, fokus wraca na przycisk).
 */
export function SiteHeader() {
  const pathname = usePathname();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<"closed" | "open">("closed");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const open = () => {
    dialogRef.current?.showModal();
    requestAnimationFrame(() => requestAnimationFrame(() => setState("open")));
  };

  const close = useCallback(() => {
    setState("closed");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => dialogRef.current?.close(), reduce ? 0 : CLOSE_MS);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      close();
    };
    dialog.addEventListener("cancel", onCancel);
    // Po przejściu na szeroki ekran menu mobilne nie jest potrzebne.
    const query = window.matchMedia("(min-width: 64rem)");
    const onChange = () => query.matches && dialog.open && close();
    query.addEventListener("change", onChange);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      query.removeEventListener("change", onChange);
    };
  }, [close]);

  // Zmiana podstrony zamyka menu.
  useEffect(() => {
    if (dialogRef.current?.open) close();
  }, [pathname, close]);

  return (
    <>
      <a href="#tresc" className="skip-link">
        Przejdź do treści
      </a>
      <header
        className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-300 ${
          scrolled ? "border-line bg-paper/85 backdrop-blur-md" : "border-transparent bg-paper"
        }`}
      >
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label={`${siteConfig.name} – strona główna`} className="-m-2 rounded-lg p-2 text-[1.05rem]">
            <Logo />
          </Link>

          <nav aria-label="Główna nawigacja" className="hidden lg:block">
            <ul className="flex items-center gap-1">
              {mainNav.map((item) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`inline-flex min-h-10 items-center rounded-full px-3.5 text-[0.9375rem] font-medium transition-colors ${
                        active ? "bg-ink/[0.06] text-ink" : "text-steel hover:text-ink"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/kontakt" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Porozmawiajmy
              <ArrowRight />
            </Link>
            <button type="button" className="burger -mr-2 hover:bg-ink/[0.06] lg:hidden" aria-label="Otwórz menu" aria-haspopup="dialog" onClick={open}>
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <dialog ref={dialogRef} className="menu-dialog on-dark" data-state={state} aria-label="Menu">
        <div className="grid-bg-dark flex h-full flex-col overflow-y-auto">
          <div className="container-x flex h-[var(--header-h)] shrink-0 items-center justify-between">
            <Link href="/" onClick={close} aria-label={`${siteConfig.name} – strona główna`} className="-m-2 rounded-lg p-2 text-[1.05rem]">
              <Logo accent />
            </Link>
            <button type="button" className="burger -mr-2 hover:bg-white/10" aria-label="Zamknij menu" onClick={close} autoFocus>
              <span className="translate-y-[6.5px] rotate-45" />
              <span className="opacity-0" />
              <span className="-translate-y-[6.5px] -rotate-45" />
            </button>
          </div>

          <nav aria-label="Menu mobilne" className="container-x flex flex-1 flex-col justify-center py-8">
            <ul>
              {[{ href: "/", label: "Strona główna" }, ...mainNav, { href: "/kontakt", label: "Kontakt" }].map((item, i) => {
                const active = item.href === "/" ? pathname === "/" : isActive(pathname, item.href);
                return (
                  <li key={item.href} className="menu-item" style={{ "--i": i } as CSSProperties}>
                    <Link
                      href={item.href}
                      onClick={close}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-center justify-between border-b border-white/10 py-4 text-[clamp(1.6rem,6vw,2.4rem)] font-semibold tracking-[-0.035em]"
                    >
                      <span className={active ? "text-white" : "text-white/80 transition-colors group-hover:text-white"}>{item.label}</span>
                      {active && <span className="size-2 rounded-[1px] bg-gold" aria-hidden="true" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="container-x menu-item pb-10" style={{ "--i": mainNav.length + 2 } as CSSProperties}>
            <Link href="/kontakt" onClick={close} className="btn btn-light w-full">
              Porozmawiajmy o projekcie
              <ArrowRight />
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
