"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/site";
import { LOCATIONS, formatHours } from "@/data/locations";
import { useCart } from "@/components/cart/CartProvider";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "./Logo";

export function SiteHeader() {
  const { itemCount, hydrated, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const cartLabel = hydrated && itemCount > 0 ? `Koszyk, ${itemCount} w koszyku` : "Koszyk";

  return (
    <>
      <a href="#tresc" className="sr-only z-50 rounded-full bg-roast px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Przejdź do treści
      </a>
      <header
        className={`sticky top-0 z-30 transition-[background-color,border-color,box-shadow] duration-300 ${
          scrolled ? "border-b border-line bg-cream/92 backdrop-blur-md" : "border-b border-transparent bg-cream"
        }`}
      >
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-6">
          <Logo />

          <nav aria-label="Główna nawigacja" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.92rem]">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="relative py-2 text-espresso transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:text-roast hover:after:scale-x-100"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={openCart}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-roast transition-colors hover:bg-sand"
              aria-label={cartLabel}
            >
              <BagIcon size={22} />
              {hydrated && itemCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute right-0.5 top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-roast px-1 text-[0.68rem] font-semibold tabular-nums text-paper"
                >
                  {itemCount}
                </span>
              )}
            </button>
            <Link href="/#menu" className="btn btn-primary btn-sm hidden sm:inline-flex">
              Zamów kawę
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full text-roast transition-colors hover:bg-sand lg:hidden"
              aria-label="Otwórz menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} labelledBy="mobile-menu-title" className="sheet-full bg-cream">
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="container-x flex h-[4.5rem] shrink-0 items-center justify-between">
            <Logo onNavigate={() => setMenuOpen(false)} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-sand"
              aria-label="Zamknij menu"
            >
              <CloseIcon size={24} />
            </button>
          </div>
          <nav aria-labelledby="mobile-menu-title" className="container-x flex flex-1 flex-col pt-8">
            <h2 id="mobile-menu-title" className="eyebrow mb-6">
              Menu
            </h2>
            <ul className="space-y-1">
              {mainNav.map((item, i) => (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-baseline gap-4 py-4 font-serif text-4xl text-roast transition-colors hover:text-latte"
                  >
                    <span className="font-sans text-xs tabular-nums text-latte">0{i + 1}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/#menu" onClick={() => setMenuOpen(false)} className="btn btn-primary mt-10 self-start">
              Zamów kawę
            </Link>
            <div className="mt-auto grid gap-4 py-10 text-sm text-muted sm:grid-cols-3">
              {LOCATIONS.map((l) => (
                <p key={l.id}>
                  <span className="block text-roast">{l.district}</span>
                  pon.–pt. {formatHours(l.hours.weekdays)}
                </p>
              ))}
            </div>
          </nav>
        </div>
      </Modal>
    </>
  );
}
