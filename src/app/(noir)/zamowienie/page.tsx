import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { CheckoutFlow, CheckoutSkeleton } from "@/components/checkout/CheckoutFlow";
import { getPaymentsMode } from "@/lib/server/env";

export const metadata: Metadata = {
  title: "Twoje zamówienie",
  description: "Wybierz lokal NOIR COFFEE i godzinę odbioru, sprawdź zamówienie i zapłać online.",
  robots: { index: false },
};

async function CheckoutWithConfig() {
  // Konfigurację płatności czytamy przy każdym żądaniu (klucze mogą być ustawione dopiero na serwerze).
  await connection();
  return <CheckoutFlow paymentsMode={getPaymentsMode()} />;
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutWithConfig />
    </Suspense>
  );
}
