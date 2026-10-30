"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { BookingForm } from "./BookingForm";

function WithParams() {
  const t = useSearchParams().get("treatment") ?? undefined;
  return <BookingForm key={t} initialTreatment={t} />;
}

/** Pre-selects a treatment from `/book?treatment=…` while keeping the page static (full form in the HTML). */
export function BookingFormFromUrl() {
  return (
    <Suspense fallback={<BookingForm />}>
      <WithParams />
    </Suspense>
  );
}
