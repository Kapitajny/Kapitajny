import { formatPLN } from "@/lib/format";

export type LedgerLine = { label: string; amount: number; detail?: string };

/**
 * Zestawienie w konwencji księgowej: pozycje z kwotami wyrównanymi do prawej,
 * suma oddzielona linią i podkreślona podwójną linią.
 */
export function Ledger({
  lines,
  adjustments = [],
  totalLabel,
  total,
  totalSuffix = "/ mies.",
  caption,
}: {
  lines: LedgerLine[];
  adjustments?: LedgerLine[];
  totalLabel: string;
  total: number;
  totalSuffix?: string;
  caption?: string;
}) {
  return (
    <table className="num w-full border-collapse text-[0.9375rem]">
      {caption && <caption className="sr-only">{caption}</caption>}
      <thead className="sr-only">
        <tr>
          <th scope="col">Pozycja</th>
          <th scope="col">Kwota netto</th>
        </tr>
      </thead>
      <tbody>
        {lines.map((line) => (
          <Row key={line.label} line={line} />
        ))}
        {adjustments.length > 0 && (
          <tr>
            <td colSpan={2} className="pt-3 pb-1 text-xs font-medium text-muted">
              Korekty
            </td>
          </tr>
        )}
        {adjustments.map((line) => (
          <Row key={line.label} line={line} sign="+" />
        ))}
      </tbody>
      <tfoot>
        <tr className="border-t border-navy">
          <th scope="row" className="pt-3 text-left font-semibold text-navy">
            {totalLabel}
          </th>
          <td className="pt-3 text-right whitespace-nowrap">
            <span className="ledger-total text-lg font-semibold text-navy">{formatPLN(total)}</span>
            {totalSuffix && <span className="ml-1 text-sm text-muted">{totalSuffix}</span>}
          </td>
        </tr>
      </tfoot>
    </table>
  );
}

function Row({ line, sign }: { line: LedgerLine; sign?: string }) {
  return (
    <tr className="border-b border-dashed border-line align-top">
      <th scope="row" className="py-2 pr-4 text-left font-normal">
        <span className="text-ink">{line.label}</span>
        {line.detail && <span className="block text-[0.8125rem] text-muted">{line.detail}</span>}
      </th>
      <td className="whitespace-nowrap py-2 text-right text-navy">
        {sign}
        {formatPLN(line.amount)}
      </td>
    </tr>
  );
}
