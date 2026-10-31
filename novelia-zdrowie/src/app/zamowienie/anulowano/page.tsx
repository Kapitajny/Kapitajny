import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderCancelledView, StatusShell } from "@/components/checkout/OrderViews";

export const metadata: Metadata = { title: "Płatność przerwana", robots: { index: false } };

export default function OrderCancelledPage() {
  return (
    <Suspense fallback={<StatusShell eyebrow="Zamówienie" title="Płatność została przerwana" />}>
      <OrderCancelledView />
    </Suspense>
  );
}
