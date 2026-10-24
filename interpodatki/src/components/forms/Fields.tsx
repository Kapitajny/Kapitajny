"use client";

import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { IconAlert } from "@/components/ui/Icons";

type Base = { id: string; label: string; error?: string; hint?: ReactNode; optional?: boolean };

function describedBy(id: string, error?: string, hint?: ReactNode) {
  return [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
}

function Label({ id, label, optional }: Pick<Base, "id" | "label" | "optional">) {
  return (
    <label htmlFor={id} className="field-label">
      {label}
      {optional ? <span className="ml-1.5 font-normal text-muted">(opcjonalnie)</span> : null}
    </label>
  );
}

export function FieldMessages({ id, error, hint }: { id: string; error?: string; hint?: ReactNode }) {
  return (
    <>
      {hint && (
        <p id={`${id}-hint`} className="field-hint mt-1.5">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          <IconAlert size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </>
  );
}

export function TextField({ id, label, error, hint, optional, ...props }: Base & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label id={id} label={label} optional={optional} />
      <input
        id={id}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={optional ? undefined : true}
        {...props}
      />
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  );
}

export function TextareaField({ id, label, error, hint, optional, ...props }: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <Label id={id} label={label} optional={optional} />
      <textarea
        id={id}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={optional ? undefined : true}
        {...props}
      />
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  error,
  hint,
  optional,
  options,
  placeholder = "Wybierz…",
  ...props
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { options: Record<string, string>; placeholder?: string }) {
  return (
    <div>
      <Label id={id} label={label} optional={optional} />
      <select
        id={id}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(id, error, hint)}
        aria-required={optional ? undefined : true}
        {...props}
      >
        <option value="">{placeholder}</option>
        {Object.entries(options).map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
      <FieldMessages id={id} error={error} hint={hint} />
    </div>
  );
}

export function CheckboxField({
  id,
  label,
  error,
  checked,
  onChange,
}: {
  id: string;
  label: ReactNode;
  error?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="checkbox-row text-[0.9375rem] text-ink">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-required="true"
        />
        <span>{label}</span>
      </label>
      <FieldMessages id={id} error={error} />
    </div>
  );
}

/** Pole-pułapka na boty: niewidoczne dla ludzi i czytników ekranu, wypełniane przez automaty. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="website">Strona internetowa</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

/** Podsumowanie błędów na górze formularza – ułatwia nawigację czytnikom ekranu i klawiaturze. */
export function ErrorSummary({ errors, labels }: { errors: Record<string, string | undefined>; labels: Record<string, string> }) {
  const entries = Object.entries(errors).filter(([, v]) => v);
  if (entries.length === 0) return null;
  return (
    <div role="alert" tabIndex={-1} id="error-summary" className="rounded-[var(--radius-control)] border border-danger/40 bg-danger-wash p-4">
      <p className="font-semibold text-navy">Popraw {entries.length === 1 ? "1 pole" : `${entries.length} pola`}, aby kontynuować:</p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-[0.9375rem]">
        {entries.map(([field, msg]) => (
          <li key={field}>
            <a href={`#${field}`} className="text-danger underline underline-offset-2">
              {labels[field] ?? field}: {msg}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
