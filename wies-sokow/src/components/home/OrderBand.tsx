import Link from "next/link";
import { formatPrice } from "@/lib/money";
import { FREE_SHIPPING_FROM, shippingMethods } from "@/lib/order";
import styles from "./home.module.css";

const courier = shippingMethods.find((method) => method.id === "kurier");

export function OrderBand() {
  return (
    <section className={`${styles.order} on-dark`} aria-labelledby="zamow-tytul">
      <div className={`container ${styles.orderInner}`}>
        <div className={styles.orderFrame}>
          <h2 id="zamow-tytul" className={styles.orderLabel}>
            Zamów bezpośrednio od producenta
          </h2>
          <p className={styles.orderSlogan}>Twój ulubiony smak może być już w&nbsp;Twoim domu.</p>
          <Link href="/sklep" className="btn btn--light">
            Przejdź do sklepu
          </Link>

          <dl className={styles.orderInfo}>
            <div>
              <dt>Dostawa</dt>
              <dd>
                Kurier {courier ? formatPrice(courier.price) : ""}, bezpłatnie od {formatPrice(FREE_SHIPPING_FROM)}. Możliwy
                odbiór osobisty.
              </dd>
            </div>
            <div>
              <dt>Płatność</dt>
              <dd>Przelew tradycyjny albo płatność przy odbiorze. Płatności online nie są w tej wersji podłączone.</dd>
            </div>
            <div>
              <dt>Realizacja</dt>
              <dd>Zamówienia pakujemy i nadajemy w ciągu dwóch dni roboczych.</dd>
            </div>
          </dl>
          <p className={styles.orderNote}>
            Warunki przykładowe. Szczegóły w{" "}
            <Link href="/dostawa-i-platnosci" className="text-link">
              zasadach dostawy i płatności
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
