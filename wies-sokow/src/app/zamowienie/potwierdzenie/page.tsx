import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/checkout/OrderConfirmation";
import styles from "@/components/checkout/checkout.module.css";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Potwierdzenie zamówienia",
  robots: { index: false, follow: false },
};

export default function ConfirmationPage() {
  return (
    <>
      <PageHeader title="Potwierdzenie" compact />
      <section className={styles.page} aria-label="Potwierdzenie zamówienia">
        <div className="container">
          <OrderConfirmation />
        </div>
      </section>
    </>
  );
}
