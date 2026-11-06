import Link from "next/link";
import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";
import { AccessibilityControls } from "./AccessibilityControls";

/**
 * Górny pasek serwisu (wzorem dużych placówek): ścieżki dla pacjentów i dla firm,
 * informacja o numerach alarmowych oraz ustawienia dostępności.
 */
export function EmergencyBar() {
  const { contact } = siteConfig;
  return (
    <aside aria-label="Informacje i ustawienia strony" className="border-b border-line bg-white text-[0.875rem]">
      <div className="container-x flex min-h-11 items-center justify-between gap-x-6 gap-y-1 py-1.5">
        <nav aria-label="Dla kogo" className="hidden md:block">
          <ul className="flex items-center gap-5 text-muted">
            <li>
              <Link href="/uslugi" className="hover:text-ink">
                Dla pacjentów
              </Link>
            </li>
            <li>
              <Link href="/uslugi#obsluga-firm-i-instytucji" className="hover:text-ink">
                Dla firm i&nbsp;placówek
              </Link>
            </li>
            <li>
              <Link href="/nfz" className="hover:text-ink">
                Pacjenci NFZ
              </Link>
            </li>
          </ul>
        </nav>
        <p className="flex items-center gap-2 text-ink">
          <Icon name="alert" size={16} className="shrink-0 text-red" />
          <span>
            Zagrożenie życia: dzwoń <strong>112</strong> lub <strong>999</strong>
          </span>
        </p>
        <div className="hidden items-center gap-5 lg:flex">
          <a href={`mailto:${contact.email}`} className="text-muted hover:text-ink">
            {contact.email}
          </a>
          <span aria-hidden="true" className="h-4 w-px bg-line-strong" />
          <AccessibilityControls />
        </div>
      </div>
    </aside>
  );
}
