"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { CartLines } from "@/components/cart/CartLines";
import { formatAmount } from "@/lib/money";
import { paymentMethods, resolveLines, shippingMethods } from "@/lib/order";
import { readOrder } from "./order-storage";
import styles from "./checkout.module.css";

const noop = () => () => {};

export function OrderConfirmation() {
  // undefined = jeszcze nie wiemy (serwer / hydracja), null = brak zamówienia w tej sesji.
  const order = useSyncExternalStore(noop, readOrder, () => undefined);

  if (order === undefined) {
    return <p className="demo-note">Wczytuję potwierdzenie…</p>;
  }

  if (order === null) {
    return (
      <div className={styles.emptyState}>
        <h2>Nie znaleźliśmy zamówienia w tej sesji.</h2>
        <p>Potwierdzenie jest widoczne tylko bezpośrednio po złożeniu zamówienia demonstracyjnego.</p>
        <Link href="/sklep" className="btn">
          Przejdź do sklepu
        </Link>
      </div>
    );
  }

  const shipping = shippingMethods.find((method) => method.id === order.shipping);
  const payment = paymentMethods.find((method) => method.id === order.payment);

  return (
    <div className={styles.confirmation}>
      <div className={styles.confirmHead}>
        <p className={styles.orderNumber}>Numer zamówienia: {order.number}</p>
        <h2>{order.firstName ? `${order.firstName}, przebieg zamówienia zakończony.` : "Przebieg zamówienia zakończony."}</h2>
        <p className="notice">
          <strong>To było zamówienie demonstracyjne.</strong> Nie zostało wysłane do żadnego systemu, nie pobrano
          płatności i nie wyślemy żadnej paczki ani wiadomości e-mail. W gotowym sklepie w tym miejscu pojawi się
          potwierdzenie przyjęcia zamówienia.
        </p>
      </div>

      <div className={styles.confirmGrid}>
        <div>
          <h3>Zamówione produkty</h3>
          <CartLines lines={resolveLines(order.lines)} editable={false} />
        </div>
        <dl className={styles.totals}>
          <div>
            <dt>Dostawa</dt>
            <dd>
              {shipping?.label}
              {order.shipping === "kurier" && order.city ? `, ${order.city}` : ""}
            </dd>
          </div>
          <div>
            <dt>Płatność</dt>
            <dd>{payment?.label}</dd>
          </div>
          <div>
            <dt>Wartość produktów</dt>
            <dd>{formatAmount(order.subtotal)}</dd>
          </div>
          <div>
            <dt>Koszt dostawy</dt>
            <dd>{order.shippingCost === 0 ? "bezpłatnie" : formatAmount(order.shippingCost)}</dd>
          </div>
          <div className={styles.grand}>
            <dt>Razem</dt>
            <dd>{formatAmount(order.total)}</dd>
          </div>
        </dl>
      </div>

      <Link href="/sklep" className="btn btn--outline">
        Wróć do sklepu
      </Link>
    </div>
  );
}
