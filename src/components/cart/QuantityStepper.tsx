"use client";

import { MinusIcon, PlusIcon } from "@/components/ui/Icons";

export function QuantityStepper({
  value,
  max,
  onChange,
  label,
  size = "md",
}: {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-9 w-9" : "h-12 w-12";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center border border-line">
      <button type="button" className={`grid ${h} place-items-center hover:bg-surface disabled:opacity-35`} onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Zmniejsz ilość">
        <MinusIcon size={16} />
      </button>
      <output aria-live="polite" className="min-w-8 text-center text-sm font-semibold tabular-nums">
        {value}
      </output>
      <button type="button" className={`grid ${h} place-items-center hover:bg-surface disabled:opacity-35`} onClick={() => onChange(value + 1)} disabled={value >= max} aria-label="Zwiększ ilość">
        <PlusIcon size={16} />
      </button>
    </div>
  );
}
