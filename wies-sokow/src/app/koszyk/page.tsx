import type { Metadata } from "next";
import { CartView } from "@/components/checkout/CartView";
import styles from "@/components/checkout/checkout.module.css";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Koszyk",
  alternates: { canonical: "/koszyk" },
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHeader title="Koszyk" compact />
      <section className={styles.page} aria-label="Zawartość koszyka">
        <div className="container">
          <CartView />
        </div>
      </section>
    </>
  );
}
