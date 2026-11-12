"use client";

import Link from "next/link";
import { CartLines } from "@/components/cart/CartLines";
import { cart, useCartLines, useHydrated } from "@/components/cart/cart-store";
import { formatAmount, plural } from "@/lib/money";
import { FREE_SHIPPING_FROM, countItems, orderTotal, resolveLines } from "@/lib/order";
import styles from "./checkout.module.css";

export function CartView() {
  const lines = useCartLines();
  const hydrated = useHydrated();
  const resolved = resolveLines(lines);
  const count = countItems(lines);
  const totals = orderTotal(lines, "kurier");

  if (!hydrated) {
    return <p className="demo-note">Wczytuję koszyk…</p>;
  }

  if (resolved.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>Koszyk jest pusty.</h2>
        <p>Wybierz smak i pojemność w sklepie, a produkty pojawią się tutaj.</p>
        <Link href="/sklep" className="btn">
          Przejdź do sklepu
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div>
        <div className={styles.listHead}>
          <p>
            {count} {plural(count, "opakowanie", "opakowania", "opakowań")}
          </p>
          <button type="button" className={styles.linkButton} onClick={cart.clear}>
            Opróżnij koszyk
          </button>
        </div>
        <CartLines lines={resolved} />
        <Link href="/sklep" className={`text-link ${styles.back}`}>
          Wróć do sklepu
        </Link>
      </div>

      <aside className={styles.summary} aria-labelledby="cart-summary-title">
        <h2 id="cart-summary-title">Podsumowanie</h2>
        <dl className={styles.totals}>
          <div>
            <dt>Wartość produktów</dt>
            <dd>{formatAmount(totals.subtotal)}</dd>
          </div>
          <div>
            <dt>Dostawa kurierem</dt>
            <dd>{totals.shipping === 0 ? "bezpłatnie" : formatAmount(totals.shipping)}</dd>
          </div>
          <div className={styles.grand}>
            <dt>Razem</dt>
            <dd>{formatAmount(totals.total)}</dd>
          </div>
        </dl>
        <p className={styles.hint}>
          {totals.shipping > 0
            ? `Do darmowej dostawy brakuje ${formatAmount(FREE_SHIPPING_FROM - totals.subtotal)}. `
            : ""}
          Sposób dostawy i płatności wybierzesz w następnym kroku.
        </p>
        <Link href="/zamowienie" className="btn btn--block">
          Przejdź do zamówienia
        </Link>
      </aside>
    </div>
  );
}
