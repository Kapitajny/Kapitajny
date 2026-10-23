import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderCancelledView } from "@/components/checkout/OrderCancelledView";

export const metadata: Metadata = { title: "Płatność przerwana", robots: { index: false, follow: false } };

export default function OrderCancelledPage() {
  return (
    <div className="wrap pb-24 pt-10">
      <Suspense fallback={<p className="py-16 text-muted">Wczytywanie…</p>}>
        <OrderCancelledView />
      </Suspense>
    </div>
  );
}
