"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { validateContact, type ContactErrors, type ContactField } from "@/components/morelowa/contact-validation";

const FIELDS: { name: ContactField; label: string; type: "text" | "email" | "textarea"; autoComplete?: string }[] = [
  { name: "name", label: "Imię", type: "text", autoComplete: "given-name" },
  { name: "email", label: "E-mail", type: "email", autoComplete: "email" },
  { name: "message", label: "Wiadomość", type: "textarea" },
];

/**
 * Formularz demonstracyjny – strona nie ma backendu, więc wiadomość NIE jest nigdzie wysyłana.
 * Po poprawnym wypełnieniu pokazujemy uczciwy komunikat zamiast udawanego potwierdzenia.
 */
export function ContactForm() {
  const [errors, setErrors] = useState<ContactErrors>({});
  const [checked, setChecked] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const id = useId();

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateContact(new FormData(event.currentTarget));
    setErrors(nextErrors);
    const firstInvalid = (Object.keys(nextErrors) as ContactField[])[0];
    if (firstInvalid) {
      setChecked(false);
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }
    setChecked(true);
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${id}-demo`} className="border border-linia-ciemna p-6 text-left sm:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-linia-ciemna pb-5">
        <h3 className="text-[1.9rem] leading-tight text-krem">Napisz do nas</h3>
        <p id={`${id}-demo`} className="text-[0.8rem] text-mgla">
          <span className="mr-2 border border-zloto px-2 py-0.5 text-[0.62rem] font-semibold tracking-[0.2em] text-zloto uppercase">Demo</span>
          Wiadomości nie są wysyłane ani zapisywane.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const fieldId = `${id}-${field.name}`;
          const errorId = `${fieldId}-blad`;
          const common = {
            id: fieldId,
            name: field.name,
            "aria-invalid": errors[field.name] ? true : undefined,
            "aria-describedby": errors[field.name] ? errorId : undefined,
          };
          return (
            <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
              <label htmlFor={fieldId} className="mb-2 block text-[0.72rem] font-semibold tracking-[0.2em] text-krem uppercase">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea {...common} rows={4} className="pole resize-y" />
              ) : (
                <input
                  {...common}
                  className="pole"
                  type={field.type}
                  autoComplete={field.autoComplete}
                  inputMode={field.type === "email" ? "email" : undefined}
                />
              )}
              {errors[field.name] && (
                <p id={errorId} className="mt-2 text-[0.85rem] text-[#f0bfb3]">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button type="submit" className="cta cta-zloto mt-8 w-full sm:w-auto">
        Sprawdź formularz <span aria-hidden="true">→</span>
      </button>

      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
        {checked && (
          <p className="mt-6 border-l-2 border-zloto pl-4 text-[0.95rem] text-krem">
            Formularz został wypełniony poprawnie. To jednak wersja demonstracyjna —{" "}
            <strong className="font-semibold">wiadomość nie została wysłana.</strong> W prawdziwym wdrożeniu trafiłaby do skrzynki piekarni.
          </p>
        )}
      </div>
    </form>
  );
}
