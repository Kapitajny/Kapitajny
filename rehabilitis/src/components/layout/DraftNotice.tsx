import { isDraft } from "@/config/site";

/** Cienki pasek informujący, że strona jest wersją roboczą – znika po uzupełnieniu danych w config/site.ts. */
export function DraftNotice() {
  if (!isDraft()) return null;
  return (
    <p className="bg-sand px-4 py-2 text-center text-[0.82rem] leading-snug text-graphite">
      <strong className="font-semibold">Wersja robocza strony.</strong> Dane kontaktowe, cennik i zakres usług wymagają uzupełnienia i potwierdzenia przez
      gabinet.
    </p>
  );
}
