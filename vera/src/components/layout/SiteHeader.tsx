"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { imageFocus, imageSrc } from "@/config/images";
import { bookingHref, mainNav, siteConfig } from "@/config/site";
import { Logo } from "./Logo";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Nagłówek z panelem nawigacji studia.
 * – Zamknięty: widać tylko logo i przycisk z trzech kresek.
 * – Otwarty: burgundowy panel rozwija się od górnej krawędzi, przycisk zmienia się w X,
 *   strona pod spodem jest zablokowana i przyciemniona, a fokus zostaje w nagłówku.
 * – Zamyka się klawiszem Escape, kliknięciem w tło, przyciskiem i przy każdej nawigacji.
 */
export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [preview, setPreview] = useState<number | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Zamknij panel przy każdej zmianie adresu (np. przycisk Wstecz przy otwartym menu).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  const close = useCallback((returnFocus = false) => {
    setOpen(false);
    if (returnFocus) toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Blokada przewijania z kompensacją paska przewijania, aby strona nie przesuwała się w bok.
  useEffect(() => {
    const root = document.documentElement;
    if (!open) return;
    root.style.setProperty("--scrollbar-w", `${window.innerWidth - root.clientWidth}px`);
    root.setAttribute("data-menu-open", "");
    return () => {
      root.removeAttribute("data-menu-open");
      root.style.removeProperty("--scrollbar-w");
    };
  }, [open]);

  // Escape zamyka; Tab krąży w obrębie nagłówka, gdy panel jest otwarty.
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
        return;
      }
      if (event.key !== "Tab" || !headerRef.current) return;
      const items = Array.from(headerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => !el.closest("[inert]") && el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && (document.activeElement === first || !headerRef.current.contains(document.activeElement))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  const currentIndex = Math.max(
    0,
    mainNav.findIndex((item) => isActive(pathname, item.href)),
  );
  const shownPreview = preview ?? currentIndex;
  const onLight = !open;

  return (
    <header ref={headerRef} data-menu={open ? "open" : "closed"} className="fixed inset-x-0 top-0 z-50">
      {/* Pasek: logo + przycisk. Leży nad panelem, więc logo pozostaje widoczne. */}
      <div
        className={`relative z-[60] transition-[background-color,color,border-color] duration-500 ${
          onLight
            ? `text-burgundy ${scrolled ? "border-b border-line bg-ivory" : "border-b border-transparent bg-transparent"}`
            : "border-b border-transparent bg-burgundy text-ivory delay-150 lg:bg-transparent"
        }`}
      >
        <div className="shell flex h-[var(--header-h)] items-center justify-between">
          <Logo onNavigate={() => close()} />
          <button
            ref={toggleRef}
            type="button"
            className="menu-toggle"
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? "Zamknij menu" : "Otwórz menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="bar" aria-hidden="true" />
            <span className="bar" aria-hidden="true" />
            <span className="bar" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Przyciemnienie strony pod panelem. */}
      <div aria-hidden="true" className="menu-scrim fixed inset-0 z-40 bg-black/55" onClick={() => close()} />

      {/* Panel. Gdy jest zamknięty, ma atrybut inert – niczego w nim nie da się zaznaczyć ani odczytać. */}
      <div
        id="site-menu"
        inert={!open}
        className="menu-panel fixed inset-x-0 top-0 z-50 flex h-dvh flex-col overflow-y-auto bg-burgundy text-ivory lg:h-[84svh] lg:min-h-[38rem] lg:overflow-hidden"
      >
        <div className="h-[var(--header-h)] shrink-0" />
        <div className="shell flex flex-1 flex-col pb-6 pt-6 sm:pt-8 lg:grid lg:grid-cols-12 lg:gap-x-8 lg:pb-8 lg:pt-[3vh]">
          <nav aria-label="Menu główne" className="lg:col-span-7 lg:flex lg:flex-col lg:justify-center xl:col-span-7">
            <ul className="menu-list space-y-1 sm:space-y-2 lg:space-y-[0.6vh]" onMouseLeave={() => setPreview(null)}>
              {mainNav.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => close()}
                      onMouseEnter={() => setPreview(i)}
                      onFocus={() => setPreview(i)}
                      className="menu-link block py-1"
                    >
                      <span className="block overflow-hidden pb-[0.08em]">
                        <span className="menu-rise flex items-center gap-3 sm:gap-5" style={{ "--i": i } as React.CSSProperties}>
                          <span aria-hidden="true" className={`w-6 shrink-0 text-xs font-medium tabular-nums ${active ? "text-ivory" : "text-rose-light"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span aria-hidden="true" className="menu-dash hidden shrink-0 opacity-60 sm:inline-block" />
                          <span className="menu-label font-serif text-[clamp(1.6rem,7.6vw,3rem)] font-light uppercase leading-[1.04] tracking-[0.04em] lg:text-[clamp(2.5rem,min(5vw,7.4svh),5.25rem)]">
                            {item.label}
                          </span>
                          {active && <span className="sr-only">(bieżąca strona)</span>}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Podgląd wskazanej podstrony – tylko na komputerze. */}
          <div className="menu-fade relative hidden lg:col-span-4 lg:col-start-9 lg:flex lg:flex-col lg:justify-center" style={{ "--i": 2 } as React.CSSProperties} aria-hidden="true">
            <div className="menu-preview relative aspect-[4/5] max-h-[52svh] w-full overflow-hidden bg-burgundy-deep">
              {mainNav.map((item, i) => (
                <Image
                  key={item.href}
                  src={imageSrc(item.image)}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 30vw, 1px"
                  className={`object-cover ${i === shownPreview ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"}`}
                  style={{ objectPosition: imageFocus(item.image) }}
                />
              ))}
            </div>
            <p className="mt-4 min-h-[1.5em] font-serif text-xl italic text-rose-light">{mainNav[shownPreview].blurb}</p>
          </div>

          {/* Stopka panelu: rezerwacja i dane kontaktowe (placeholdery). */}
          <div className="menu-fade mt-10 flex flex-col gap-6 border-t border-line-light pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:col-span-12 lg:mt-auto" style={{ "--i": 4 } as React.CSSProperties}>
            <Link href={bookingHref} onClick={() => close()} className="btn btn-light self-start sm:self-auto">
              Umów wizytę
            </Link>
            <ul className="flex flex-col gap-3 text-sm sm:flex-row sm:flex-wrap sm:gap-x-10">
              <li>
                <span className="block text-2xs text-rose-light">Telefon</span>
                <a href={siteConfig.contact.phoneHref} className="link-line">
                  {siteConfig.contact.phone}
                </a>
              </li>
              <li>
                <span className="block text-2xs text-rose-light">E-mail</span>
                <a href={`mailto:${siteConfig.contact.email}`} className="link-line">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <span className="block text-2xs text-rose-light">Instagram</span>
                <a href={siteConfig.contact.instagramUrl} target="_blank" rel="noopener noreferrer" className="link-line">
                  {siteConfig.contact.instagramHandle}
                  <span className="sr-only"> (otwiera się w nowej karcie)</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </header>
  );
}
