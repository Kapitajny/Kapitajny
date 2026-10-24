"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { mainNav, type NavItem } from "@/content/navigation";
import { getDepartment } from "@/content/company";
import { telHref } from "@/lib/format";
import { ChevronDown, CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Wordmark } from "./Wordmark";

const sales = getDepartment("zbyt");
const salesPhone = sales.phones[0].display;

function isActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.href || pathname.startsWith(`${item.href}/`)) return true;
  return item.children?.some((c) => c.href !== "/" && (pathname === c.href || pathname.startsWith(`${c.href}/`))) ?? false;
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Zamknięcie rozwijanego menu po kliknięciu poza nim i klawiszem Esc.
  useEffect(() => {
    if (!openDropdown) return;
    const onPointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setOpenDropdown(null);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        const trigger = navRef.current?.querySelector<HTMLButtonElement>(`[data-dropdown="${openDropdown}"]`);
        setOpenDropdown(null);
        trigger?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  // Zmiana strony zamyka menu (porównanie ścieżki z poprzednim renderem).
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpenDropdown(null);
    setMenuOpen(false);
  }

  return (
    <>
      <a href="#tresc" className="ui sr-only z-50 bg-ink px-4 py-2 text-on-dark focus:not-sr-only focus:fixed focus:left-3 focus:top-3">
        Przejdź do treści
      </a>

      {/* Pasek informacyjny B2B – przewija się razem ze stroną, więc nie zabiera miejsca przy czytaniu. */}
      <aside aria-label="Kontakt dla odbiorców hurtowych" className="ui bg-ink text-[0.8125rem] text-on-dark/85">
        <div className="container-x flex min-h-10 items-center justify-between gap-4 py-2">
          <p className="min-w-0">
            <span className="hidden sm:inline">Hurt, gastronomia i stołówki – Dział Zbytu: </span>
            <span className="sm:hidden">Dział Zbytu: </span>
            <a href={telHref(salesPhone)} className="link font-semibold text-on-dark">
              {salesPhone}
            </a>
          </p>
          <ul className="hidden items-center gap-5 md:flex">
            <li>
              <Link href="/siec-sprzedazy" className="link inline-flex min-h-6 items-center">
                Gdzie kupić
              </Link>
            </li>
            <li>
              <Link href="/dla-biznesu#hodowcy" className="link inline-flex min-h-6 items-center">
                Dla hodowców
              </Link>
            </li>
          </ul>
        </div>
      </aside>

      <header
        className={`sticky top-0 z-40 border-b transition-[background-color,border-color] duration-200 ${
          scrolled ? "border-line bg-surface/95 backdrop-blur-sm" : "border-transparent bg-paper"
        }`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
          <Wordmark />

          <nav ref={navRef} aria-label="Główna nawigacja" className="hidden xl:block">
            <ul className="ui flex items-center gap-1 text-[0.9375rem] font-medium">
              {mainNav.map((item) => {
                const active = isActive(pathname, item);
                if (!item.children) {
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={pathname === item.href ? "page" : undefined}
                        className={`relative inline-flex h-11 items-center px-3 transition-colors hover:text-red ${active ? "text-red" : ""}`}
                      >
                        {item.label}
                      </Link>
                    </li>
                  );
                }
                const open = openDropdown === item.href;
                const panelId = `dropdown-${item.href.slice(1)}`;
                return (
                  <li key={item.href} className="relative">
                    <button
                      type="button"
                      data-dropdown={item.href}
                      aria-expanded={open}
                      aria-controls={panelId}
                      onClick={() => setOpenDropdown(open ? null : item.href)}
                      className={`inline-flex h-11 cursor-pointer items-center gap-1 px-3 transition-colors hover:text-red ${active ? "text-red" : ""}`}
                    >
                      {item.label}
                      <ChevronDown size={16} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
                    </button>
                    <div
                      id={panelId}
                      hidden={!open}
                      className="absolute left-0 top-full w-80 border border-line bg-surface p-2 shadow-[0_18px_40px_-24px_rgb(34_37_42/0.45)]"
                    >
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.href + child.label}>
                            <Link
                              href={child.href}
                              aria-current={pathname === child.href ? "page" : undefined}
                              className="block px-3 py-2.5 transition-colors hover:bg-paper"
                            >
                              <span className="block font-semibold text-ink">{child.label}</span>
                              {child.description && <span className="block text-[0.8125rem] font-normal text-muted">{child.description}</span>}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/dla-biznesu#zapytanie" className="btn btn-red btn-sm hidden sm:inline-flex">
              Kontakt handlowy
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="ui inline-flex h-11 cursor-pointer items-center gap-2 px-2 text-[0.9375rem] font-semibold xl:hidden"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <MenuIcon size={24} />
              Menu
            </button>
          </div>
        </div>
      </header>

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} labelledBy="mobile-menu-title" className="sheet-full bg-paper text-ink">
        <div id="mobile-menu" className="flex h-full flex-col overflow-y-auto">
          <div className="container-x flex h-[4.5rem] shrink-0 items-center justify-between border-b border-line">
            <Wordmark onNavigate={() => setMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="ui inline-flex h-11 cursor-pointer items-center gap-2 px-2 text-[0.9375rem] font-semibold"
            >
              <CloseIcon size={24} />
              Zamknij
            </button>
          </div>
          <nav aria-labelledby="mobile-menu-title" className="container-x flex-1 pb-10 pt-6">
            <h2 id="mobile-menu-title" className="sr-only">
              Menu
            </h2>
            <ul>
              {mainNav.map((item) => (
                <li key={item.href} className="border-b border-line py-3">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`display-sm block py-1.5 text-[1.75rem] ${isActive(pathname, item) ? "text-red" : ""}`}
                  >
                    {item.label}
                  </Link>
                  {item.children && (
                    <ul className="ui mb-1 mt-1 grid gap-x-4 sm:grid-cols-2">
                      {item.children
                        .filter((c) => c.href !== item.href)
                        .map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              onClick={() => setMenuOpen(false)}
                              className="flex min-h-11 items-center text-[1rem] text-muted hover:text-ink"
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/dla-biznesu#zapytanie" onClick={() => setMenuOpen(false)} className="btn btn-red">
                Kontakt handlowy
              </Link>
              <a href={telHref(salesPhone)} className="btn btn-outline">
                <PhoneIcon size={18} />
                Dział Zbytu {salesPhone}
              </a>
            </div>
          </nav>
        </div>
      </Modal>
    </>
  );
}
