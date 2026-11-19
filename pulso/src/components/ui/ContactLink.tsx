import type { ReactNode } from "react";
import type { PackageId } from "@/config/pricing";
import type { ServiceId } from "@/data/services";
import { CONTACT_ID } from "@/lib/contact-intent";

type Props = {
  children: ReactNode;
  className?: string;
  services?: ServiceId[];
  package?: PackageId;
  /** Dodatkowy opis dla czytników ekranu, gdy tekst przycisku jest krótki. */
  ariaLabel?: string;
  /** Dodatkowa akcja przy kliknięciu (np. zamknięcie menu mobilnego). Nawigację obsługuje installPageNavigation(). */
  onNavigate?: () => void;
};

/**
 * Każdy przycisk kontaktowy na stronie: jeden formularz (#kontakt), jedna funkcja nawigacji
 * (`installPageNavigation` w `src/lib/contact-intent.ts`). Wybór usług i pakietu jedzie w atrybutach data-*.
 */
export function ContactLink({ children, className = "btn btn-primary", services, package: pkg, ariaLabel, onNavigate }: Props) {
  return (
    <a
      href={`#${CONTACT_ID}`}
      className={className}
      aria-label={ariaLabel}
      data-contact=""
      data-services={services?.length ? services.join(",") : undefined}
      data-package={pkg}
      onClick={onNavigate}
    >
      {children}
    </a>
  );
}

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={`btn-arrow h-4 w-4 ${className}`} aria-hidden="true" fill="none">
      <path d="M3 10h13m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
