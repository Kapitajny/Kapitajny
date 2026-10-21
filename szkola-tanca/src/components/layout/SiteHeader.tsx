"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { siteConfig } from "@/config/site";
import { Close, Menu } from "@/components/ui/Icons";
import { Logo } from "./Logo";

/** Śledzi, która sekcja strony głównej jest aktualnie na ekranie – do podświetlenia linku w nawigacji. */
function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const sections = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => el !== null);
    const visible = new Set<string>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        // Sekcje spoza nawigacji (np. filozofia) nie podświetlają żadnego linku.
        setActive(ids.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [ids, enabled]);

  return enabled ? active : null;
}

const SECTION_IDS = siteConfig.nav.map((item) => item.href.replace("/#", ""));

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);
  const active = useActiveSection(SECTION_IDS, isHome);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobilne zamykamy, gdy ekran zrobi się szeroki (np. obrót tabletu).
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => query.matches && menuRef.current?.close();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const openMenu = () => menuRef.current?.showModal();
  const closeMenu = () => menuRef.current?.close();

  return (
    <header
      className={`sticky top-0 z-40 transition-[background-color,border-color] duration-300 ${
        scrolled ? "border-b border-cocoa/10 bg-ivory/95 backdrop-blur-sm" : "border-b border-transparent bg-ivory"
      }`}
    >
      <a href="#tresc" className="sr-only-focusable absolute left-4 top-3 z-50 rounded bg-wine px-4 py-2 text-sm font-semibold text-ivory">
        Przejdź do treści
      </a>
      <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />

        <nav aria-label="Główna nawigacja" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {siteConfig.nav.map((item) => {
              const isActive = active === item.href.replace("/#", "");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`relative inline-flex min-h-11 items-center px-3 text-[0.95rem] font-medium transition-colors hover:text-wine ${
                      isActive ? "text-wine" : ""
                    }`}
                  >
                    {item.label}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-3 bottom-2 h-px origin-left bg-wine transition-transform duration-300 ${isActive ? "scale-x-100" : "scale-x-0"}`}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/#zapis" className="btn btn-primary btn-sm hidden sm:inline-flex">
            Lekcja próbna
          </Link>
          <button type="button" onClick={openMenu} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/25 lg:hidden" aria-haspopup="dialog">
            <Menu size={22} />
            <span className="sr-only">Otwórz menu</span>
          </button>
        </div>
      </div>

      <dialog
        ref={menuRef}
        aria-label="Menu"
        className="dialog-fade m-0 h-dvh max-h-none w-full max-w-none bg-ivory p-0 text-cocoa backdrop:bg-transparent"
        onClick={(event) => {
          // Kliknięcie w link zamyka menu (nawigacja do sekcji odbywa się normalnie).
          if ((event.target as HTMLElement).closest("a")) closeMenu();
        }}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between">
          <Logo />
          <button type="button" onClick={closeMenu} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-cocoa/25" autoFocus>
            <Close size={22} />
            <span className="sr-only">Zamknij menu</span>
          </button>
        </div>
        <nav aria-label="Menu mobilne" className="container-x mt-6">
          <ul className="border-t rule">
            {siteConfig.nav.map((item) => (
              <li key={item.href} className="border-b rule">
                <Link href={item.href} className="flex min-h-14 items-center justify-between py-3 font-serif text-3xl transition-colors hover:text-wine">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/#zapis" className="btn btn-primary mt-8 w-full">
            Umów lekcję próbną
          </Link>
          <p className="mt-6 flex flex-col items-start gap-2 text-sm">
            <a href={siteConfig.contact.phoneHref} className="link">
              {siteConfig.contact.phoneDisplay}
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="link">
              {siteConfig.contact.email}
            </a>
          </p>
        </nav>
      </dialog>
    </header>
  );
}
