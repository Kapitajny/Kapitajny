import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Koszyk i zamówienie",
  robots: { index: false },
};

export default function CartPage() {
  return (
    <section className="container-x pb-20 pt-10 lg:pb-28 lg:pt-14">
      <p className="eyebrow">Zamówienie</p>
      <h1 className="mt-4 text-[clamp(2.2rem,1.5rem+2.6vw,3.6rem)]">Koszyk</h1>
      <div className="mt-10">
        <CheckoutFlow />
      </div>
    </section>
  );
}
