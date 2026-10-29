"use client";

import { useId, useRef, useState, type FormEvent } from "react";
import { validateContact, type ContactErrors, type ContactField } from "./contact-validation";

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

  const describedBy = (field: ContactField) => (errors[field] ? `${id}-${field}-blad` : undefined);

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${id}-demo`} className="border border-krem/25 p-6 sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-serif text-[1.8rem] leading-tight text-krem">Napisz do nas</h3>
        <span className="border border-krem/40 px-3 py-1 text-[0.62rem] font-semibold tracking-[0.22em] text-krem uppercase">Demo</span>
      </div>
      <p id={`${id}-demo`} className="mt-3 text-[0.85rem] text-krem/80">
        Formularz demonstracyjny — wiadomości nie są wysyłane ani zapisywane.
      </p>

      <div className="mt-8 space-y-7">
        <div>
          <label htmlFor={`${id}-name`} className="text-[0.7rem] font-semibold tracking-[0.2em] text-krem uppercase">
            Imię
          </label>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="given-name"
            className="field"
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
          />
          {errors.name && (
            <p id={`${id}-name-blad`} className="mt-2 text-[0.82rem] text-[#f6cfc3]">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="text-[0.7rem] font-semibold tracking-[0.2em] text-krem uppercase">
            E-mail
          </label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className="field"
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describedBy("email")}
          />
          {errors.email && (
            <p id={`${id}-email-blad`} className="mt-2 text-[0.82rem] text-[#f6cfc3]">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label htmlFor={`${id}-message`} className="text-[0.7rem] font-semibold tracking-[0.2em] text-krem uppercase">
            Wiadomość
          </label>
          <textarea
            id={`${id}-message`}
            name="message"
            rows={4}
            className="field resize-y"
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message")}
          />
          {errors.message && (
            <p id={`${id}-message-blad`} className="mt-2 text-[0.82rem] text-[#f6cfc3]">
              {errors.message}
            </p>
          )}
        </div>
      </div>

      <button type="submit" className="btn btn-light mt-9 w-full sm:w-auto">
        Sprawdź formularz
      </button>

      <div ref={statusRef} tabIndex={-1} role="status" className="outline-none">
        {checked && (
          <p className="mt-6 border-l-2 border-zloto pl-4 text-[0.9rem] text-krem">
            Formularz został wypełniony poprawnie. To jednak wersja demonstracyjna —{" "}
            <strong className="font-semibold">wiadomość nie została wysłana.</strong> W prawdziwym wdrożeniu trafiłaby do skrzynki piekarni.
          </p>
        )}
      </div>
    </form>
  );
}
