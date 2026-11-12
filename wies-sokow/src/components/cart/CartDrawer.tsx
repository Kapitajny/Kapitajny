"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatAmount, plural } from "@/lib/money";
import { FREE_SHIPPING_FROM, countItems, resolveLines, subtotal } from "@/lib/order";
import { CloseIcon } from "@/components/ui/Icons";
import { CartLines } from "./CartLines";
import { cartDrawer, useCartDrawerOpen, useCartLines } from "./cart-store";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const open = useCartDrawerOpen();
  const lines = useCartLines();
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const resolved = resolveLines(lines);
  const count = countItems(lines);
  const sum = subtotal(lines);
  const missing = FREE_SHIPPING_FROM - sum;

  return (
    <dialog
      ref={ref}
      className={styles.drawer}
      aria-labelledby="cart-drawer-title"
      onClose={cartDrawer.close}
      onClick={(event) => {
        if (event.target === event.currentTarget) cartDrawer.close();
      }}
    >
      <div className={styles.panel}>
        <header className={styles.header}>
          <h2 id="cart-drawer-title" className={styles.title}>
            Koszyk
            {count > 0 ? (
              <span className={styles.count}>
                {count} {plural(count, "opakowanie", "opakowania", "opakowań")}
              </span>
            ) : null}
          </h2>
          <button type="button" className={styles.close} onClick={cartDrawer.close} aria-label="Zamknij koszyk">
            <CloseIcon />
          </button>
        </header>

        {resolved.length === 0 ? (
          <div className={styles.empty}>
            <p className={styles.emptyTitle}>Koszyk jest pusty.</p>
            <p>Wybierz smak i pojemność, a zamówienie pojawi się tutaj.</p>
            <Link href="/sklep" className="btn" onClick={cartDrawer.close}>
              Przejdź do sklepu
            </Link>
          </div>
        ) : (
          <>
            <div className={styles.scroll}>
              <CartLines lines={resolved} onNavigate={cartDrawer.close} />
            </div>
            <footer className={styles.footer}>
              <dl className={styles.sum}>
                <dt>Wartość produktów</dt>
                <dd>{formatAmount(sum)}</dd>
              </dl>
              <p className={styles.shipping}>
                {missing > 0
                  ? `Do darmowej dostawy kurierem brakuje ${formatAmount(missing)}.`
                  : "Dostawa kurierem do tego zamówienia jest bezpłatna."}{" "}
                Koszt dostawy wybierzesz w następnym kroku.
              </p>
              <Link href="/zamowienie" className="btn btn--block" onClick={cartDrawer.close}>
                Przejdź do zamówienia
              </Link>
              <Link href="/koszyk" className={`text-link ${styles.toCart}`} onClick={cartDrawer.close}>
                Zobacz cały koszyk
              </Link>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
}
