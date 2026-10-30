"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { ConsultationForm } from "./ConsultationForm";

function WithParams() {
  const zabieg = useSearchParams().get("zabieg") ?? undefined;
  return <ConsultationForm key={zabieg} initialService={zabieg} />;
}

/**
 * Formularz z zabiegiem wybranym na podstawie adresu (`/rezerwacja?zabieg=…`).
 * Strona pozostaje statyczna: w HTML jest pełny formularz, a wybór z adresu uzupełnia się po załadowaniu.
 */
export function ConsultationFormFromUrl() {
  return (
    <Suspense fallback={<ConsultationForm />}>
      <WithParams />
    </Suspense>
  );
}
