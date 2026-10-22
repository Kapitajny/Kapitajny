"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mainNav, phoneHref, siteConfig } from "@/config/site";
import { BookingLink } from "@/components/ui/BookingLink";
import { CloseIcon, MenuIcon, PhoneIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const close = () => setMenuOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu mobilne zamykamy, gdy okno zostanie poszerzone do widoku desktopowego.
  useEffect(() => {
    if (!menuOpen) return;
    const query = window.matchMedia("(min-width: 1024px)");
    const onChange = () => query.matches && setMenuOpen(false);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, [menuOpen]);

  const { phone } = siteConfig.contact;

  return (
    <>
      <a href="#tresc" className="sr-only z-50 rounded-md bg-forest px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Przejdź do treści
      </a>
      <header
        className={`sticky top-0 z-30 transition-[background-color,border-color] duration-300 ${
          scrolled ? "border-b border-line bg-paper/92 backdrop-blur-md" : "border-b border-transparent bg-paper"
        }`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Główna nawigacja" className="hidden lg:block">
            <ul className="flex items-center gap-7 text-[0.95rem]">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative py-2 text-graphite transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-forest hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            {phone && (
              <a
                href={phoneHref(phone)}
                className="hidden items-center gap-2 px-3 py-2 text-[0.95rem] font-semibold text-forest hover:underline xl:inline-flex"
              >
                <PhoneIcon size={18} />
                {phone}
              </a>
            )}
            <BookingLink className="btn btn-primary btn-sm hidden sm:inline-flex" />
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-forest transition-colors hover:bg-sage lg:hidden"
              aria-label="Otwórz menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      <Modal open={menuOpen} onClose={close} labelledBy="mobile-menu-title" className="sheet-full">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="container-x flex h-[4.5rem] shrink-0 items-center justify-between">
            <Logo onNavigate={close} />
            <button
              type="button"
              onClick={close}
              className="inline-flex h-11 w-11 items-center justify-center rounded-md text-forest hover:bg-sage"
              aria-label="Zamknij menu"
            >
              <CloseIcon size={24} />
            </button>
          </div>
          <nav aria-labelledby="mobile-menu-title" className="container-x flex flex-1 flex-col pb-10 pt-6">
            <h2 id="mobile-menu-title" className="eyebrow mb-4">
              Menu
            </h2>
            <ul>
              {mainNav.map((item) => (
                <li key={item.href} className="border-b border-line">
                  <Link href={item.href} onClick={close} className="block py-4 font-serif text-[2rem] leading-tight text-ink transition-colors hover:text-forest">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <BookingLink onClick={close} />
              {phone && (
                <a href={phoneHref(phone)} className="btn btn-secondary">
                  <PhoneIcon size={18} /> Zadzwoń: {phone}
                </a>
              )}
            </div>
          </nav>
        </div>
      </Modal>
    </>
  );
}
