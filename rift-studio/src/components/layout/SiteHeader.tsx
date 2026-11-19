"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { localePath, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries";
import { sectionIds, stripLocale, switchLocalePath, type SectionId } from "@/i18n/routes";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";
import { Logo } from "./Logo";
import styles from "./SiteHeader.module.css";

const navSections: SectionId[] = ["brzmienia", "o-nas", "uslugi", "realizacje", "cennik", "rezerwacja", "faq"];

interface Props {
  lang: Locale;
  t: Dictionary["nav"];
}

/**
 * „Transport bar”: pasek jak w programie DAW. Pod linkami biegnie oś czasu strony –
 * znaczniki sekcji i głowica pokazująca postęp przewijania. Aktywna sekcja jest podświetlona.
 */
export function SiteHeader({ lang, t }: Props) {
  const pathname = usePathname();
  const home = localePath(lang, "/");
  const isHome = stripLocale(pathname) === "/";
  const [active, setActive] = useState<SectionId>("start");
  const [scrolled, setScrolled] = useState(false);
  const [markers, setMarkers] = useState<{ id: SectionId; at: number }[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const otherLang: Locale = lang === "pl" ? "en" : "pl";

  const href = (id: SectionId) => (isHome ? `#${id}` : `${home}#${id}`);

  // aktywna sekcja
  useEffect(() => {
    if (!isHome) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id as SectionId);
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [isHome]);

  // postęp przewijania + pozycje znaczników
  useEffect(() => {
    let frame = 0;
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (isHome && max > 0) {
        setMarkers(
          sectionIds
            .map((id) => {
              const el = document.getElementById(id);
              return el ? { id, at: Math.min(1, Math.max(0, (el.offsetTop - 80) / max)) } : null;
            })
            .filter((m): m is { id: SectionId; at: number } => !!m),
        );
      }
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? window.scrollY / max : 0;
        progressRef.current?.style.setProperty("--p", String(p));
        setScrolled(window.scrollY > 8);
      });
    };
    measure();
    onScroll();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      ro.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [isHome]);

  // przełącznik języka zachowuje bieżącą sekcję
  const langHref = switchLocalePath(pathname, lang, otherLang) + (isHome && active !== "start" ? `#${active}` : "");

  const openMenu = () => dialogRef.current?.showModal();
  const closeMenu = () => dialogRef.current?.close();

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.bar}>
        <Link href={isHome ? "#start" : home} className={styles.home} aria-label={t.home}>
          <Logo uid="logo-hdr" />
        </Link>

        <nav aria-label={t.label} className={styles.nav}>
          <ul role="list" className={styles.links}>
            {navSections.map((id) => (
              <li key={id}>
                <a href={href(id)} className={styles.link} aria-current={isHome && active === id ? "location" : undefined}>
                  <span className={styles.led} aria-hidden="true" />
                  {t.items[id]}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          <a href={langHref} className={styles.lang} hrefLang={otherLang} lang={otherLang} aria-label={t.switchTo}>
            <span aria-hidden="true" className={lang === "pl" ? styles.langOn : ""}>
              PL
            </span>
            <span aria-hidden="true" className={styles.langSep}>
              /
            </span>
            <span aria-hidden="true" className={lang === "en" ? styles.langOn : ""}>
              EN
            </span>
          </a>
          <a href={href("rezerwacja")} className={`btn btn-primary btn-small ${styles.book}`}>
            <span className={styles.bookLong}>{t.book}</span>
            <span className={styles.bookShort}>{t.bookShort}</span>
          </a>
          <button type="button" className={styles.menuBtn} onClick={openMenu} aria-haspopup="dialog">
            <MenuIcon />
            <span>{t.menu}</span>
          </button>
        </div>
      </div>

      {/* oś czasu strony */}
      <div ref={progressRef} className={styles.timeline} aria-hidden="true">
        <span className={styles.progress} />
        <span className={styles.head} />
        {markers.map((m) => (
          <a key={m.id} href={`#${m.id}`} tabIndex={-1} className={styles.marker} style={{ left: `${m.at * 100}%` }} data-active={active === m.id || undefined}>
            <span className={styles.markerLabel}>{t.items[m.id]}</span>
          </a>
        ))}
      </div>

      <dialog ref={dialogRef} className={styles.sheet} aria-label={t.label} onClick={(e) => e.target === dialogRef.current && closeMenu()}>
        <div className={styles.sheetInner}>
          <div className={styles.sheetTop}>
            <Logo uid="logo-sheet" />
            <button type="button" className={styles.close} onClick={closeMenu} aria-label={t.closeMenu}>
              <CloseIcon size={24} />
            </button>
          </div>
          <nav aria-label={t.label}>
            <ol role="list" className={styles.sheetList}>
              {sectionIds.map((id) => (
                <li key={id}>
                  <a href={href(id)} onClick={closeMenu} aria-current={isHome && active === id ? "location" : undefined}>
                    <span className={styles.sheetTick} aria-hidden="true" />
                    {t.items[id]}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className={styles.sheetFoot}>
            <a href={href("rezerwacja")} onClick={closeMenu} className="btn btn-primary">
              {t.book}
            </a>
            <a href={langHref} className={styles.sheetLang} hrefLang={otherLang} lang={otherLang}>
              {t.switchTo}
            </a>
          </div>
        </div>
      </dialog>
    </header>
  );
}
