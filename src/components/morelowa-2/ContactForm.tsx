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
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${id}-demo`} className="border border-linia bg-papier p-6 sm:p-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h3 className="text-[2rem] leading-tight text-braz">Napisz do nas</h3>
        <span className="rounded-full bg-bez px-3 py-1 text-[0.65rem] font-medium tracking-[0.2em] text-braz uppercase">Demo</span>
      </div>
      <p id={`${id}-demo`} className="mt-3 text-[0.9rem] text-szary">
        Formularz demonstracyjny — wiadomości nie są wysyłane ani zapisywane.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {FIELDS.map((field) => {
          const fieldId = `${id}-${field.name}`;
          const errorId = `${fieldId}-blad`;
          const common = {
            id: fieldId,
            name: field.name,
            className: "input",
            "aria-invalid": errors[field.name] ? true : undefined,
            "aria-describedby": errors[field.name] ? errorId : undefined,
          };
          return (
            <div key={field.name} className={field.type === "textarea" ? "sm:col-span-2" : undefined}>
              <label htmlFor={fieldId} className="mb-2 block text-[0.72rem] font-medium tracking-[0.2em] text-braz uppercase">
                {field.label}
              </label>
              {field.type === "textarea" ? (
                <textarea {...common} rows={4} className="input resize-y" />
              ) : (
                <input {...common} type={field.type} autoComplete={field.autoComplete} inputMode={field.type === "email" ? "email" : undefined} />
              )}
              {errors[field.name] && (
                <p id={errorId} className="mt-2 text-[0.85rem] text-[#9b2c2c]">
                  {errors[field.name]}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button type="submit" className="pill pill-bordo mt-8 w-full sm:w-auto">
        Sprawdź formularz
      </button>

      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
        {checked && (
          <p className="mt-6 border-l-2 border-bordo pl-4 text-[0.95rem] text-braz">
            Formularz został wypełniony poprawnie. To jednak wersja demonstracyjna —{" "}
            <strong className="font-medium">wiadomość nie została wysłana.</strong> W prawdziwym wdrożeniu trafiłaby do skrzynki piekarni.
          </p>
        )}
      </div>
    </form>
  );
}
