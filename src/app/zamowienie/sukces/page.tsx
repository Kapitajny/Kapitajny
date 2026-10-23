import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderResultView } from "@/components/checkout/OrderResultView";

export const metadata: Metadata = { title: "Status zamówienia", robots: { index: false, follow: false } };

export default function OrderSuccessPage() {
  return (
    <div className="wrap pb-24 pt-10">
      <Suspense fallback={<p className="py-16 text-muted">Sprawdzanie statusu zamówienia…</p>}>
        <OrderResultView />
      </Suspense>
    </div>
  );
}
