"use client";

import Image from "next/image";
import Link from "next/link";
import { SIZES } from "@/data/catalog";
import { colorName, getProductById } from "@/lib/catalog";
import { formatPrice, ORDER_LIMITS, type PricedLine } from "@/lib/pricing";
import { useShop } from "@/components/shop/ShopProvider";
import { AlertIcon } from "@/components/ui/Icons";
import { QuantityStepper } from "./QuantityStepper";
import type { LineCheck } from "./useCartValidation";

/** Pozycja koszyka: zmiana koloru, rozmiaru i ilości, usuwanie, ostrzeżenie o dostępności. */
export function CartLineItem({ line, check, onNavigate, compact = false }: { line: PricedLine; check?: LineCheck; onNavigate?: () => void; compact?: boolean }) {
  const { setQuantity, removeLine, changeVariant } = useShop();
  const product = getProductById(line.productId);
  if (!product) return null;
  const limit = check && !check.error ? check.available : ORDER_LIMITS.maxQuantityPerLine;
  const maxQuantity = Math.max(1, Math.min(ORDER_LIMITS.maxQuantityPerLine, limit));
  const idBase = `line-${line.sku}`;

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/produkt/${line.slug}?kolor=${line.color}`} onClick={onNavigate} className="studio relative block aspect-[4/5] w-24 shrink-0 overflow-hidden sm:w-28">
        <Image src={line.image} alt={`${line.name}, ${line.colorName}`} fill sizes="112px" className="object-cover" />
      </Link>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/produkt/${line.slug}?kolor=${line.color}`} onClick={onNavigate} className="font-bold hover:underline">
              {line.name}
            </Link>
            <p className="text-sm text-muted">{product.kind}</p>
          </div>
          <p className="shrink-0 font-semibold tabular-nums">{formatPrice(line.lineTotal)}</p>
        </div>

        <div className={`mt-3 grid gap-2 ${compact ? "grid-cols-2" : "grid-cols-2 sm:max-w-xs"}`}>
          <div>
            <label htmlFor={`${idBase}-color`} className="sr-only">
              Kolor
            </label>
            <select id={`${idBase}-color`} className="field !min-h-9 !py-1.5 text-sm" value={line.color} onChange={(e) => changeVariant(line.sku, e.target.value, line.size)}>
              {product.variants.map((v) => (
                <option key={v.color} value={v.color}>
                  {colorName(v.color)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor={`${idBase}-size`} className="sr-only">
              Rozmiar
            </label>
            <select id={`${idBase}-size`} className="field !min-h-9 !py-1.5 text-sm" value={line.size} onChange={(e) => changeVariant(line.sku, line.color, e.target.value)}>
              {SIZES.map((size) => (
                <option key={size} value={size}>
                  Rozmiar {size}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <QuantityStepper size="sm" value={line.quantity} max={maxQuantity} onChange={(q) => setQuantity(line.sku, q)} label={`Ilość: ${line.name}`} />
          <button type="button" className="text-sm text-muted underline underline-offset-2 hover:text-paper" onClick={() => removeLine(line.sku)}>
            Usuń
          </button>
        </div>

        {check && !check.ok && (
          <p className="mt-3 flex gap-2 text-sm text-danger" role="alert">
            <AlertIcon size={16} className="mt-0.5 shrink-0" />
            {check.error ??
              (check.available === 0
                ? `Rozmiar ${line.size} w kolorze ${line.colorName.toLowerCase()} jest niedostępny. Zmień rozmiar lub kolor albo usuń pozycję.`
                : `Dostępne tylko ${check.available} szt. – zmniejsz ilość.`)}
          </p>
        )}
      </div>
    </li>
  );
}
