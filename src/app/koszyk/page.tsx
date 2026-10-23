import type { Metadata } from "next";
import { CartPageView } from "@/components/cart/CartPageView";

export const metadata: Metadata = { title: "Koszyk", robots: { index: false, follow: false } };

export default function CartPage() {
  return (
    <div className="wrap pb-24 pt-10">
      <h1 className="display mb-10 text-[clamp(3rem,1rem+7vw,7rem)]">Koszyk</h1>
      <CartPageView />
    </div>
  );
}
