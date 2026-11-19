"use client";

import type { ReactNode } from "react";

export function ErrorText({ id, children }: { id: string; children?: string }) {
  if (!children) return null;
  return (
    <p id={id} className="mt-2 flex items-start gap-2 font-gothic text-sm text-bengara">
      <svg viewBox="0 0 16 16" className="mt-[3px] h-3.5 w-3.5 shrink-0" aria-hidden="true">
        <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.3" />
        <path d="M8 4.5v4.2M8 10.8v.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {children}
    </p>
  );
}

const inputBase =
  "w-full rounded-[2px] border bg-washi/70 px-4 font-gothic text-base text-sumi transition-colors duration-200 placeholder:text-nezumi/60 focus:border-sumi focus:bg-washi focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sumi";

export function TextField({
  name,
  label,
  hint,
  optional,
  error,
  value,
  onChange,
  onBlur,
  type = "text",
  autoComplete,
  inputMode,
  maxLength,
  min,
  max,
}: {
  name: string;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  type?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel";
  maxLength?: number;
  min?: string;
  max?: string;
}) {
  const id = `field-${name}`;
  const describedBy = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-gothic text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-nezumi">Optional</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 font-gothic text-xs text-nezumi">
          {hint}
        </p>
      )}
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        min={min}
        max={max}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputBase} mt-2 h-13 ${error ? "border-bengara" : "border-sumi/25 hover:border-sumi/50"}`}
      />
      <ErrorText id={`${id}-error`}>{error}</ErrorText>
    </div>
  );
}

export function TextArea({
  name,
  label,
  hint,
  optional,
  error,
  value,
  onChange,
  onBlur,
  maxLength,
  rows = 6,
  placeholder,
}: {
  name: string;
  label: string;
  hint?: string;
  optional?: boolean;
  error?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  maxLength: number;
  rows?: number;
  placeholder?: string;
}) {
  const id = `field-${name}`;
  const describedBy = [hint && `${id}-hint`, `${id}-count`, error && `${id}-error`].filter(Boolean).join(" ");
  const near = value.length > maxLength * 0.9;
  return (
    <div>
      <label htmlFor={id} className="flex items-baseline justify-between gap-3 font-gothic text-sm font-medium">
        {label}
        {optional && <span className="font-normal text-nezumi">Optional</span>}
      </label>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 font-gothic text-xs text-nezumi">
          {hint}
        </p>
      )}
      <textarea
        id={id}
        name={name}
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        maxLength={maxLength}
        required={!optional}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputBase} mt-2 resize-y py-3.5 leading-relaxed ${error ? "border-bengara" : "border-sumi/25 hover:border-sumi/50"}`}
      />
      <div className="flex items-start justify-between gap-4">
        <ErrorText id={`${id}-error`}>{error}</ErrorText>
        <p id={`${id}-count`} className={`ml-auto mt-2 font-gothic text-xs tabular-nums ${near ? "text-sumi" : "text-nezumi"}`}>
          <span className="sr-only">Characters used: </span>
          {value.length} / {maxLength}
        </p>
      </div>
    </div>
  );
}

/** Grupa przycisków wyboru (radio lub checkbox) w formie eleganckich kafli. */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  hint,
  error,
  options,
  value,
  onChange,
  multiple,
  columns = "grid-cols-2",
  size = "md",
}: {
  name: string;
  legend: string;
  hint?: string;
  error?: string;
  options: readonly { id: T; label: string; detail?: string }[];
  value: T | T[] | "";
  onChange: (value: T) => void;
  multiple?: boolean;
  columns?: string;
  size?: "sm" | "md";
}) {
  const id = `field-${name}`;
  const selected = (option: T) => (Array.isArray(value) ? value.includes(option) : value === option);
  return (
    <fieldset aria-describedby={[hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(" ") || undefined}>
      <legend className="font-gothic text-sm font-medium">{legend}</legend>
      {hint && (
        <p id={`${id}-hint`} className="mt-1 font-gothic text-xs text-nezumi">
          {hint}
        </p>
      )}
      <div id={id} tabIndex={-1} className={`mt-3 grid gap-2 outline-none ${columns}`}>
        {options.map((option) => (
          <label key={option.id} className="relative cursor-pointer">
            <input
              type={multiple ? "checkbox" : "radio"}
              name={name}
              value={option.id}
              checked={selected(option.id)}
              onChange={() => onChange(option.id)}
              aria-invalid={error ? true : undefined}
              className="peer sr-only"
            />
            <span
              className={`flex h-full flex-col justify-center rounded-[2px] border px-4 transition-colors duration-200 peer-checked:border-sumi peer-checked:bg-sumi peer-checked:text-washi peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sumi ${
                size === "sm" ? "min-h-12 py-2" : "min-h-14 py-3"
              } ${error ? "border-bengara/70" : "border-sumi/20 hover:border-sumi/55"}`}
            >
              <span className="font-gothic text-sm font-medium">{option.label}</span>
              {option.detail && <span className="mt-0.5 font-gothic text-xs opacity-70">{option.detail}</span>}
            </span>
          </label>
        ))}
      </div>
      <ErrorText id={`${id}-error`}>{error}</ErrorText>
    </fieldset>
  );
}

export function CheckboxField({
  name,
  checked,
  onChange,
  error,
  children,
}: {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  children: ReactNode;
}) {
  const id = `field-${name}`;
  return (
    <div>
      <label htmlFor={id} className="flex cursor-pointer items-start gap-4">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="peer sr-only"
        />
        <span
          aria-hidden="true"
          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-[2px] border transition-colors peer-checked:border-sumi peer-checked:bg-sumi peer-checked:text-washi peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-sumi ${
            error ? "border-bengara" : "border-sumi/40"
          } ${checked ? "" : "text-transparent"}`}
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5">
            <path d="m3 8.5 3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <span className="font-gothic text-sm leading-relaxed">{children}</span>
      </label>
      <div className="pl-10">
        <ErrorText id={`${id}-error`}>{error}</ErrorText>
      </div>
    </div>
  );
}
