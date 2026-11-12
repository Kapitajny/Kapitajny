"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { cartDrawer, useCartCount } from "@/components/cart/cart-store";
import { BasketIcon, CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { plural } from "@/lib/money";
import { Logo } from "./Logo";
import styles from "./SiteHeader.module.css";

const leftNav = site.nav.slice(0, 3);
const rightNav = site.nav.slice(3);

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();
  const count = useCartCount();
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Na stronie głównej nagłówek leży na hero i jest przezroczysty, dopóki nie zaczniemy przewijać.
  const overHero = pathname === "/" && !scrolled;
  const closeMenu = () => menuRef.current?.close();

  const cartLabel =
    count === 0 ? "Koszyk, pusty" : `Koszyk, ${count} ${plural(count, "opakowanie", "opakowania", "opakowań")}`;

  const renderLinks = (items: readonly { href: string; label: string }[]) =>
    items.map((item) => (
      <li key={item.href}>
        <Link href={item.href} className={styles.link} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
          {item.label}
        </Link>
      </li>
    ));

  return (
    <header className={`${styles.header} ${overHero ? `${styles.overHero} on-dark` : ""} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <button
          type="button"
          className={styles.menuButton}
          onClick={() => menuRef.current?.showModal()}
          aria-label="Otwórz menu"
          aria-haspopup="dialog"
        >
          <MenuIcon />
        </button>

        <nav className={styles.nav} aria-label="Menu główne">
          <ul className={`${styles.group} ${styles.groupLeft}`}>{renderLinks(leftNav)}</ul>
          <Link href="/" className={styles.brand} aria-label="Wieś Soków – strona główna">
            <Logo mono={overHero} />
          </Link>
          <ul className={`${styles.group} ${styles.groupRight}`}>{renderLinks(rightNav)}</ul>
        </nav>

        <button type="button" className={styles.cart} onClick={cartDrawer.open} aria-label={cartLabel} aria-haspopup="dialog">
          <BasketIcon />
          <span className={styles.badge} data-empty={count === 0} aria-hidden="true">
            {count}
          </span>
        </button>
      </div>

      <dialog
        ref={menuRef}
        className={styles.menu}
        aria-label="Menu"
        onClick={(event) => {
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className={styles.menuPanel}>
          <div className={styles.menuTop}>
            <Logo />
            <button type="button" className={styles.menuClose} onClick={closeMenu} aria-label="Zamknij menu">
              <CloseIcon />
            </button>
          </div>
          <nav aria-label="Menu główne">
            <ul className={styles.menuList}>
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={closeMenu} aria-current={isActive(pathname, item.href) ? "page" : undefined}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className={styles.menuFoot}>
            <p>{site.contact.phone}</p>
            <p>{site.contact.email}</p>
            <p className={styles.menuDemo}>Dane demonstracyjne</p>
          </div>
        </div>
      </dialog>
    </header>
  );
}
