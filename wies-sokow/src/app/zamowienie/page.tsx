import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import styles from "@/components/checkout/checkout.module.css";
import { PageHeader } from "@/components/layout/PageHeader";

export const metadata: Metadata = {
  title: "Zamówienie",
  alternates: { canonical: "/zamowienie" },
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader title="Zamówienie" compact />
      <section className={styles.page} aria-label="Składanie zamówienia">
        <div className="container">
          <CheckoutForm />
        </div>
      </section>
    </>
  );
}
