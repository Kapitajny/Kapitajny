import Link from "next/link";
import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";

/**
 * Przycisk „Umów wizytę”.
 * - Z NEXT_PUBLIC_BOOKING_URL prowadzi do zewnętrznego kalendarza rezerwacji (nowa karta).
 * - Bez niego prowadzi do formularza kontaktowego – to prośba o kontakt, a nie rezerwacja terminu.
 */
export function BookingLink({ className = "btn btn-primary", children = "Umów wizytę", onClick }: { className?: string; children?: ReactNode; onClick?: () => void }) {
  if (siteConfig.bookingUrl) {
    return (
      <a href={siteConfig.bookingUrl} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>
        {children}
        <span className="sr-only"> (system rezerwacji otworzy się w nowej karcie)</span>
      </a>
    );
  }
  return (
    <Link href="/#kontakt" className={className} onClick={onClick}>
      {children}
    </Link>
  );
}
