import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderCancelledView } from "@/components/checkout/OrderCancelledView";
import { StatusShell } from "@/components/checkout/OrderSuccessView";

export const metadata: Metadata = {
  title: "Płatność przerwana",
  robots: { index: false },
};

export default function OrderCancelledPage() {
  return (
    <Suspense
      fallback={
        <StatusShell eyebrow="Płatność" title="Sprawdzamy zamówienie…">
          <p className="text-muted">To potrwa tylko chwilę.</p>
        </StatusShell>
      }
    >
      <OrderCancelledView />
    </Suspense>
  );
}
