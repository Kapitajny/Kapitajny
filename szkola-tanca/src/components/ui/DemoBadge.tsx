import { Info } from "./Icons";

/** Oznaczenie treści demonstracyjnych (ceny, terminy, opinie, osoby). */
export function DemoBadge({ children = "Dane przykładowe", className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={`inline-flex items-center gap-2 rounded-full border border-rose px-3 py-1 text-xs font-semibold tracking-wide ${className}`}>
      <Info size={14} className="text-rose" />
      <span>{children}</span>
    </p>
  );
}
