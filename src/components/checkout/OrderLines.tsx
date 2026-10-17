import { formatPrice } from "@/lib/pricing";

export interface OrderLineView {
  key?: string;
  name: string;
  quantity: number;
  optionLabels: string[];
  lineTotal: number;
}

/** Lista pozycji zamówienia (tylko do odczytu) z sumą. */
export function OrderLines({ lines, total }: { lines: OrderLineView[]; total: number }) {
  return (
    <div>
      <ul className="divide-y divide-line">
        {lines.map((line, i) => (
          <li key={line.key ?? i} className="flex items-start justify-between gap-4 py-4">
            <div className="min-w-0">
              <p className="text-roast">
                <span className="tabular-nums text-muted">{line.quantity} × </span>
                <span className="font-serif text-lg">{line.name}</span>
              </p>
              {line.optionLabels.length > 0 && <p className="mt-0.5 text-xs leading-relaxed text-muted">{line.optionLabels.join(" · ")}</p>}
            </div>
            <p className="shrink-0 tabular-nums">{formatPrice(line.lineTotal)}</p>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between border-t border-roast/20 pt-4">
        <span className="font-medium text-roast">Do zapłaty</span>
        <span className="font-serif text-3xl text-roast tabular-nums">{formatPrice(total)}</span>
      </div>
    </div>
  );
}
