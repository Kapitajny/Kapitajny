import { isDraft } from "@/config/site";

/** Informacja, że strona jest wersją roboczą – znika po uzupełnieniu danych w config/site.ts. */
export function DraftNotice() {
  if (!isDraft()) return null;
  return (
    <p className="bg-sand px-4 py-1.5 text-center text-sm text-graphite">
      Wersja robocza strony: dane kontaktowe, ceny i zakres usług czekają na uzupełnienie przez gabinet.
    </p>
  );
}
