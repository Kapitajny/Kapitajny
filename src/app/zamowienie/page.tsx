import type { Metadata } from "next";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Zamówienie", robots: { index: false, follow: false } };

export default function CheckoutPage() {
  return (
    <div className="wrap pb-24 pt-10">
      <h1 className="display mb-10 text-[clamp(2.8rem,1rem+6vw,6.5rem)]">Zamówienie</h1>
      <CheckoutForm />
    </div>
  );
}
