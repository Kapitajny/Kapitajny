"use client";

import { useSite } from "@/components/providers/SiteProvider";
import type { ServiceId } from "@/data/services";

interface Props {
  service: ServiceId;
  durationMin?: number;
  label: string;
  className?: string;
}

/** Przycisk „Zarezerwuj” – wybiera usługę w formularzu i przewija do niego. */
export function BookServiceButton({ service, durationMin, label, className = "btn btn-primary btn-small" }: Props) {
  const { requestBooking } = useSite();
  return (
    <button type="button" className={className} onClick={() => requestBooking({ service, durationMin })}>
      {label}
    </button>
  );
}
