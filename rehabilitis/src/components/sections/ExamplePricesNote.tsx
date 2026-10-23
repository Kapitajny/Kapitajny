import { PRICES_ARE_EXAMPLES } from "@/data/pricing";

/** Informacja, że ceny są przykładowe – znika po ustawieniu PRICES_ARE_EXAMPLES = false. */
export function ExamplePricesNote({ className = "" }: { className?: string }) {
  if (!PRICES_ARE_EXAMPLES) return null;
  return (
    <p className={`border-l-4 border-brand bg-brand-soft px-4 py-3 text-small text-ink ${className}`}>
      <strong>Ceny przykładowe.</strong> Pokazują wygląd cennika. Aktualne ceny gabinet poda przed publikacją strony.
    </p>
  );
}
