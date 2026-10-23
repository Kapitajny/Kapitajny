import { isDraft } from "@/config/site";

/** Informacja, że strona jest wersją roboczą – znika po uzupełnieniu danych w config/site.ts. */
export function DraftNotice() {
  if (!isDraft()) return null;
  return (
    <aside aria-label="Informacja o stronie" className="bg-brand-soft px-4 py-1.5 text-center text-small text-ink">
      Wersja robocza strony. Dane kontaktowe i ceny gabinet uzupełni przed publikacją.
    </aside>
  );
}
