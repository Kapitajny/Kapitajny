"use client";

import { ORDER_LIMITS } from "@/lib/pricing";
import { MinusIcon, PlusIcon } from "@/components/ui/Icons";

export function QuantityStepper({
  value,
  onChange,
  label,
  size = "md",
  max = ORDER_LIMITS.maxQuantityPerLine,
}: {
  value: number;
  onChange: (value: number) => void;
  label: string;
  size?: "sm" | "md";
  max?: number;
}) {
  const box = size === "sm" ? "h-8 w-8" : "h-10 w-10";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-oat bg-paper">
      <button
        type="button"
        className={`${box} inline-flex items-center justify-center rounded-full text-roast transition-colors hover:bg-sand disabled:opacity-35`}
        onClick={() => onChange(value - 1)}
        disabled={value <= 1}
        aria-label="Zmniejsz ilość"
      >
        <MinusIcon size={16} />
      </button>
      <output aria-live="polite" className={`min-w-7 text-center tabular-nums ${size === "sm" ? "text-sm" : ""}`}>
        {value}
      </output>
      <button
        type="button"
        className={`${box} inline-flex items-center justify-center rounded-full text-roast transition-colors hover:bg-sand disabled:opacity-35`}
        onClick={() => onChange(value + 1)}
        disabled={value >= max}
        aria-label="Zwiększ ilość"
      >
        <PlusIcon size={16} />
      </button>
    </div>
  );
}
