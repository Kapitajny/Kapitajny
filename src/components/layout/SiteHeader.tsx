"use client";

import Link from "next/link";
import { useState } from "react";
import { mainNav } from "@/config/site";
import { LOCATIONS, formatHours } from "@/data/locations";
import { useCart } from "@/components/cart/CartProvider";
import { BagIcon, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Logo } from "./Logo";

export function SiteHeader() {
  const { itemCount, hydrated, openCart } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartLabel = hydrated && itemCount > 0 ? `Koszyk, ${itemCount} w koszyku` : "Koszyk";

  return (
    <>
      <a href="#tresc" className="sr-only z-50 rounded-full bg-roast px-4 py-2 text-paper focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Przejdź do treści
      </a>
      <header className="site-menu">
        <div className="container-x site-menu__bar">
          <Logo tone="light" />

          <nav aria-label="Główna nawigacja" className="site-menu__nav">
            <ul className="site-menu__list">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="site-menu__link">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="site-menu__actions">
            <button type="button" onClick={openCart} className="site-menu__icon-btn" aria-label={cartLabel}>
              <BagIcon size={22} />
              {hydrated && itemCount > 0 && (
                <span aria-hidden="true" className="site-menu__badge">
                  {itemCount}
                </span>
              )}
            </button>
            <Link href="/#menu" className="btn btn-sm site-menu__cta">
              Zamów kawę
            </Link>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="site-menu__icon-btn site-menu__burger"
              aria-label="Otwórz menu"
              aria-expanded={menuOpen}
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      <Modal open={menuOpen} onClose={() => setMenuOpen(false)} labelledBy="mobile-menu-title" className="sheet-full mobile-menu">
        <div className="mobile-menu__inner">
          <div className="container-x site-menu__bar">
            <Logo tone="light" onNavigate={() => setMenuOpen(false)} />
            <button type="button" onClick={() => setMenuOpen(false)} className="site-menu__icon-btn" aria-label="Zamknij menu">
              <CloseIcon size={24} />
            </button>
          </div>
          <nav aria-labelledby="mobile-menu-title" className="container-x mobile-menu__nav">
            <h2 id="mobile-menu-title" className="mobile-menu__title">
              Menu
            </h2>
            <ul>
              {mainNav.map((item, i) => (
                <li key={item.href} className="mobile-menu__item">
                  <Link href={item.href} onClick={() => setMenuOpen(false)} className="mobile-menu__link">
                    <span className="mobile-menu__num">0{i + 1}</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/#menu" onClick={() => setMenuOpen(false)} className="btn mobile-menu__cta">
              Zamów kawę
            </Link>
            <div className="mobile-menu__hours">
              {LOCATIONS.map((l) => (
                <p key={l.id}>
                  <strong>{l.district}</strong>
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
