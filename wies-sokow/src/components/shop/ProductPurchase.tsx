"use client";

import { useState } from "react";
import { cart, cartDrawer } from "@/components/cart/cart-store";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { formatAmount } from "@/lib/money";
import { clampQty } from "@/lib/order";
import styles from "./shop.module.css";

export function ProductPurchase({ slug, price, label }: { slug: string; price: number; label: string }) {
  const [qty, setQty] = useState(1);

  return (
    <div className={styles.purchase}>
      <div className={styles.purchaseQty}>
        <span className="field-label" id="qty-label">
          Liczba opakowań
        </span>
        <QuantityStepper value={qty} onChange={(next) => setQty(clampQty(next))} label={label} />
      </div>
      <button
        type="button"
        className={`btn ${styles.purchaseButton}`}
        aria-label={`Dodaj do koszyka: ${label}, ${qty} szt., razem ${formatAmount(price * qty)}`}
        onClick={() => {
          cart.add(slug, qty);
          cartDrawer.open();
          setQty(1);
        }}
      >
        Dodaj do koszyka
        <span className={styles.purchaseSum} aria-hidden="true">
          {formatAmount(price * qty)}
        </span>
      </button>
    </div>
  );
}
