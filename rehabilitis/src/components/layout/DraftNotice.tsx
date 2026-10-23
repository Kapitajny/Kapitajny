import { isDraft } from "@/config/site";

/** Informacja, że strona jest wersją roboczą – znika po uzupełnieniu danych w config/site.ts. */
export function DraftNotice() {
  if (!isDraft()) return null;
  return (
    <aside aria-label="Informacja o stronie" className="bg-sand px-4 py-1.5 text-center text-[0.95rem] text-graphite">
      Wersja robocza strony. Dane kontaktowe i ceny gabinet uzupełni przed publikacją.
    </aside>
  );
}
