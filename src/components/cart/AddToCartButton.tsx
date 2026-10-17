"use client";

import { getProduct } from "@/data/menu";
import { getDefaultSelection } from "@/lib/pricing";
import { PlusIcon } from "@/components/ui/Icons";
import { useCart } from "./CartProvider";

/** Dodaje napój w wersji domyślnej (np. mała, mleko krowie) prosto do koszyka. */
export function QuickAddButton({
  productId,
  className = "btn btn-secondary btn-sm",
  label = "Dodaj do zamówienia",
}: {
  productId: string;
  className?: string;
  label?: string;
}) {
  const { addItem } = useCart();
  const product = getProduct(productId);
  if (!product) return null;
  return (
    <button type="button" className={className} onClick={() => addItem(product.id, getDefaultSelection(product))} aria-label={`${label}: ${product.name}`}>
      <PlusIcon size={16} />
      {label}
    </button>
  );
}

/** Otwiera okno personalizacji (rozmiar, mleko, temperatura, dodatki). */
export function CustomizeButton({
  productId,
  className = "btn btn-secondary btn-sm",
  label = "Wybierz",
}: {
  productId: string;
  className?: string;
  label?: string;
}) {
  const { openCustomizer } = useCart();
  const product = getProduct(productId);
  if (!product) return null;
  return (
    <button
      type="button"
      className={className}
      onClick={() => openCustomizer(product.id)}
      aria-label={`${label}: ${product.name} – wybierz opcje`}
      aria-haspopup="dialog"
    >
      {label}
    </button>
  );
}
