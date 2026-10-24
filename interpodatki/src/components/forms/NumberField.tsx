"use client";

import { useId, useState } from "react";
import { IconAlert } from "@/components/ui/Icons";

type Props = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  hint?: string;
  unit?: string;
  disabled?: boolean;
  /** Dodatkowy suwak dla szybkiej zmiany (zakres suwaka może być mniejszy niż pola). */
  sliderMax?: number;
  name?: string;
};

/**
 * Pole liczbowe z przyciskami −/+ i opcjonalnym suwakiem. Podczas wpisywania trzyma wersję roboczą,
 * a do stanu przekazuje wyłącznie liczby całkowite z dozwolonego zakresu.
 */
export function NumberField({ label, value, min, max, step = 1, onChange, hint, unit, disabled, sliderMax, name }: Props) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const commit = (n: number) => onChange(Math.min(max, Math.max(min, Math.round(n))));

  function handleInput(text: string) {
    setDraft(text);
    if (text.trim() === "") {
      setError(`Wpisz liczbę od ${min} do ${max}.`);
      return;
    }
    const n = Number(text);
    if (!Number.isInteger(n)) {
      setError("Wpisz liczbę całkowitą.");
      return;
    }
    if (n < min || n > max) {
      setError(`Dozwolony zakres: ${min}–${max}.`);
      commit(n);
      return;
    }
    setError(null);
    commit(n);
  }

  function handleBlur() {
    setDraft(null);
    setError(null);
  }

  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          className="btn btn-outline w-12 shrink-0 px-0 text-xl"
          onClick={() => commit(value - step)}
          disabled={disabled || value <= min}
          aria-label={`Zmniejsz: ${label}`}
        >
          −
        </button>
        <div className="relative flex-1">
          <input
            id={id}
            name={name}
            type="number"
            inputMode="numeric"
            className="input num pr-16 text-center"
            min={min}
            max={max}
            step={step}
            value={draft ?? String(value)}
            onChange={(e) => handleInput(e.target.value)}
            onBlur={handleBlur}
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
          />
          {unit && (
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">{unit}</span>
          )}
        </div>
        <button
          type="button"
          className="btn btn-outline w-12 shrink-0 px-0 text-xl"
          onClick={() => commit(value + step)}
          disabled={disabled || value >= max}
          aria-label={`Zwiększ: ${label}`}
        >
          +
        </button>
      </div>
      {sliderMax !== undefined && (
        <input
          type="range"
          className="mt-3 w-full accent-[var(--color-blue)]"
          min={min}
          max={sliderMax}
          step={step}
          value={Math.min(value, sliderMax)}
          onChange={(e) => commit(Number(e.target.value))}
          disabled={disabled}
          aria-label={`${label} – suwak`}
          aria-valuetext={`${value}${unit ? ` ${unit}` : ""}`}
        />
      )}
      {hint && (
        <p id={`${id}-hint`} className="field-hint mt-1.5">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error" role="alert">
          <IconAlert size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
