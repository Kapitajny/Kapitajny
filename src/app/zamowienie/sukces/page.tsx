import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderSuccessView, StatusShell } from "@/components/checkout/OrderSuccessView";

export const metadata: Metadata = {
  title: "Status zamówienia",
  robots: { index: false },
};

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <StatusShell eyebrow="Zamówienie" title="Sprawdzamy status płatności…">
          <p className="text-muted">To potrwa tylko chwilę.</p>
        </StatusShell>
      }
    >
      <OrderSuccessView />
    </Suspense>
  );
}
