"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { mainNav } from "@/config/site";
import { useCart } from "@/components/cart/CartProvider";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";

export function SiteHeader() {
  const cart = useCart();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-colors duration-300 ${scrolled || menuOpen ? "border-b border-line bg-paper/95 backdrop-blur" : "border-b border-transparent bg-paper"}`}
      >
        <a href="#tresc" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:bg-forest focus:px-4 focus:py-2 focus:text-cream">
          Przejdź do treści
        </a>
        <div className="container-x flex h-[4.5rem] items-center justify-between gap-4">
          <Link href="/" aria-label="NOVELIA ZDROWIE – strona główna" onClick={() => setMenuOpen(false)}>
            <Logo />
          </Link>

          <nav aria-label="Główna nawigacja" className="hidden lg:block">
            <ul className="flex items-center gap-8 text-[0.95rem]">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`py-2 transition-colors hover:text-forest ${pathname === item.href ? "text-forest" : "text-muted"}`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={cart.open}
              className="relative inline-flex h-11 w-11 items-center justify-center text-forest hover:bg-beige"
              aria-label={`Koszyk – ${cart.count} ${cart.count === 1 ? "pozycja" : "pozycji"}`}
            >
              <BagIcon size={22} />
              {cart.hydrated && cart.count > 0 && (
                <span className="absolute right-1 top-1 flex h-[1.15rem] min-w-[1.15rem] items-center justify-center rounded-full bg-gold px-1 text-[0.68rem] font-semibold text-forest-deep">
                  {cart.count}
                </span>
              )}
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center text-forest hover:bg-beige lg:hidden"
              aria-expanded={menuOpen}
              aria-controls="menu-mobilne"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Zamknij menu" : "Otwórz menu"}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Menu poza <header>: backdrop-blur nagłówka tworzyłby kontener dla elementów fixed. */}
      {menuOpen && (
        <nav id="menu-mobilne" aria-label="Menu" className="fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-paper lg:hidden">
          <ul className="container-x divide-y divide-line py-4">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} onClick={() => setMenuOpen(false)} className="flex min-h-14 items-center font-serif text-2xl text-forest">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="container-x pb-10">
            <Link href="/sklep/zdrowiej-kazdego-dnia" onClick={() => setMenuOpen(false)} className="btn btn-primary w-full">
              Kup e-book – 39,99 zł
            </Link>
          </div>
        </nav>
      )}
    </>
  );
}
