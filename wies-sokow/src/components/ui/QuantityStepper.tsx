"use client";

import { MAX_QTY } from "@/lib/order";
import { MinusIcon, PlusIcon } from "./Icons";
import styles from "./QuantityStepper.module.css";

type Props = {
  value: number;
  onChange: (value: number) => void;
  /** Czego dotyczy ilość, np. „Sok jabłkowy, 5 litrów”. */
  label: string;
  size?: "md" | "sm";
};

export function QuantityStepper({ value, onChange, label, size = "md" }: Props) {
  return (
    <div className={`${styles.stepper} ${size === "sm" ? styles.sm : ""}`} role="group" aria-label={`Liczba opakowań: ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} disabled={value <= 1} aria-label="Zmniejsz liczbę opakowań">
        <MinusIcon />
      </button>
      <output aria-live="polite">{value}</output>
      <button type="button" onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Zwiększ liczbę opakowań">
        <PlusIcon />
      </button>
    </div>
  );
}
