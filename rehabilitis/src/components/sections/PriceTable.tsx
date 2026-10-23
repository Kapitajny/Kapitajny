import { PRICE_GROUPS } from "@/data/pricing";
import { PendingValue } from "@/components/ui/Pending";

/** Cennik: osobna tabela dla każdej grupy (konsultacje, terapia, pakiety). */
export function PriceTable() {
  return (
    <div className="space-y-12">
      {PRICE_GROUPS.map((group) => (
        <table key={group.title} className="w-full border-collapse text-left">
          <caption className="mb-3 text-left text-h3 font-bold text-brand-strong">{group.title}</caption>
          <thead>
            <tr className="border-b-2 border-brand-strong text-small text-muted">
              <th scope="col" className="py-2 pr-4 font-bold">
                Usługa
              </th>
              <th scope="col" className="hidden w-32 py-2 pr-4 font-bold sm:table-cell">
                Czas
              </th>
              <th scope="col" className="w-28 py-2 text-right font-bold">
                Cena
              </th>
            </tr>
          </thead>
          <tbody>
            {group.items.map((item) => (
              <tr key={`${item.title}-${item.duration}`} className="border-b border-line align-top">
                <th scope="row" className="py-4 pr-4 font-normal">
                  <span className="block font-bold text-ink">{item.title}</span>
                  {item.note && <span className="mt-0.5 block text-small text-muted">{item.note}</span>}
                  <span className="mt-1 block text-small text-muted sm:hidden">Czas: {item.duration ?? <PendingValue />}</span>
                </th>
                <td className="hidden py-4 pr-4 tabular-nums sm:table-cell">{item.duration ?? <PendingValue />}</td>
                <td className="whitespace-nowrap py-4 text-right font-bold tabular-nums text-brand-strong">{item.price ?? <PendingValue />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
