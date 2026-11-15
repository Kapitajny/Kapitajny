"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { site } from "@/data/site";
import { CloseIcon, MailIcon, MenuIcon, PhoneIcon } from "./Icons";
import { NavLinks } from "./NavLinks";
import styles from "./SiteHeader.module.css";

const CLOSE_MS = 200;

export function MobileMenu() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  const openMenu = () => {
    window.clearTimeout(closeTimer.current);
    setClosing(false);
    dialogRef.current?.showModal();
    setOpen(true);
  };

  // Zamknięcie jest szybsze niż otwarcie; po animacji zamykamy natywny dialog.
  const closeMenu = useCallback(() => {
    const dialog = dialogRef.current;
    if (!dialog?.open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setOpen(false);
    if (reduce) {
      dialog.close();
      return;
    }
    setClosing(true);
    closeTimer.current = window.setTimeout(() => {
      dialog.close();
      setClosing(false);
    }, CLOSE_MS);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onCancel = (event: Event) => {
      event.preventDefault();
      closeMenu();
    };
    const onClose = () => setOpen(false);
    dialog.addEventListener("cancel", onCancel);
    dialog.addEventListener("close", onClose);
    return () => {
      dialog.removeEventListener("cancel", onCancel);
      dialog.removeEventListener("close", onClose);
      window.clearTimeout(closeTimer.current);
    };
  }, [closeMenu]);

  // Menu mobilne nie ma sensu na szerokim ekranie – zamykamy je przy zmianie układu.
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1100px)");
    const onChange = () => query.matches && dialogRef.current?.open && dialogRef.current.close();
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <button type="button" className={styles.menuButton} aria-haspopup="dialog" aria-expanded={open} aria-controls="menu-mobilne" onClick={openMenu}>
        <MenuIcon />
        <span>Menu</span>
      </button>

      <dialog
        id="menu-mobilne"
        ref={dialogRef}
        className={styles.drawer}
        data-closing={closing || undefined}
        aria-label="Menu"
        onClick={(event) => {
          // Kliknięcie w tło (poza panelem) zamyka menu.
          if (event.target === event.currentTarget) closeMenu();
        }}
      >
        <div className={styles.drawerPanel}>
          <div className={styles.drawerTop}>
            <span className={styles.drawerTitle}>Menu</span>
            <button type="button" className={styles.closeButton} onClick={closeMenu}>
              <CloseIcon />
              <span>Zamknij</span>
            </button>
          </div>

          <nav aria-label="Menu główne">
            <NavLinks className={styles.drawerNav} linkClassName={styles.drawerLink} onNavigate={closeMenu} />
          </nav>

          <div className={styles.drawerContact}>
            <a href={site.phoneHref} className={styles.drawerContactLink}>
              <PhoneIcon />
              <span className="num">{site.phone}</span>
            </a>
            <a href={`mailto:${site.email}`} className={styles.drawerContactLink}>
              <MailIcon />
              <span>{site.email}</span>
            </a>
          </div>

          <Link href="/kontakt" className={`btn btn-primary ${styles.drawerCta}`} onClick={closeMenu}>
            Bezpłatna wycena
          </Link>
        </div>
      </dialog>
    </>
  );
}
