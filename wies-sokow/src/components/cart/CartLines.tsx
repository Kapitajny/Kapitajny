"use client";

import Image from "next/image";
import Link from "next/link";
import { capacityLabel, flavors } from "@/data/products";
import { formatAmount } from "@/lib/money";
import type { ResolvedLine } from "@/lib/order";
import { QuantityStepper } from "@/components/ui/QuantityStepper";
import { cart } from "./cart-store";
import styles from "./CartLines.module.css";

type Props = {
  lines: ResolvedLine[];
  /** false = samo podsumowanie, bez zmiany ilości i usuwania. */
  editable?: boolean;
  onNavigate?: () => void;
};

export function CartLines({ lines, editable = true, onNavigate }: Props) {
  return (
    <ul className={styles.list}>
      {lines.map(({ product, qty, total }) => {
        const flavor = flavors[product.flavor];
        const label = `${product.name}, ${capacityLabel(product.capacity)}`;
        return (
          <li key={product.slug} className={styles.line}>
            <Link href={`/sklep/${product.slug}`} className={styles.thumb} onClick={onNavigate} tabIndex={-1} aria-hidden="true">
              <Image src={flavor.image} alt="" sizes="88px" />
            </Link>
            <div className={styles.body}>
              <div className={styles.head}>
                <h3 className={styles.name}>
                  <Link href={`/sklep/${product.slug}`} onClick={onNavigate}>
                    {product.name}
                  </Link>
                </h3>
                <p className={styles.total}>{formatAmount(total)}</p>
              </div>
              <p className={styles.meta}>
                {capacityLabel(product.capacity)}
                {editable ? null : <>, {qty} szt.</>}
              </p>
              {editable ? (
                <div className={styles.actions}>
                  <QuantityStepper size="sm" value={qty} label={label} onChange={(next) => cart.setQty(product.slug, next)} />
                  <button type="button" className={styles.remove} aria-label={`Usuń: ${label}`} onClick={() => cart.remove(product.slug)}>
                    Usuń
                  </button>
                </div>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
