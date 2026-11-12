"use client";

import { cart, cartDrawer } from "./cart-store";

type Props = {
  slug: string;
  qty?: number;
  /** Pełna nazwa produktu dla czytników ekranu. */
  productLabel: string;
  className?: string;
  children?: React.ReactNode;
};

export function AddToCartButton({ slug, qty = 1, productLabel, className = "btn", children }: Props) {
  return (
    <button
      type="button"
      className={className}
      aria-label={`Dodaj do koszyka: ${productLabel}`}
      onClick={() => {
        cart.add(slug, qty);
        cartDrawer.open();
      }}
    >
      {children ?? "Dodaj do koszyka"}
    </button>
  );
}
