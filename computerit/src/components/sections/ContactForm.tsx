"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { budgets, projectTypes, type ProjectType } from "@/data/offer";
import { CONSENT_TEXT, LIMITS, validateContact, type ContactErrors, type ContactField } from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "failed"; message: string };

const FIELD_ORDER: ContactField[] = ["name", "email", "company", "projectType", "budget", "message", "consent"];

const empty = { name: "", email: "", company: "", projectType: "", budget: "", message: "", consent: false, website: "" };

export function ContactForm({ fallbackEmail }: { fallbackEmail: string | null }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  // Przyciski „Zapytaj o stronę”, „Skorzystaj z promocji” itp. ustawiają od razu rodzaj projektu.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>("a[data-project]");
      const project = link?.dataset.project as ProjectType | undefined;
      if (project && projectTypes.some((type) => type.value === project)) {
        setValues((current) => ({ ...current, projectType: project }));
        setErrors((current) => ({ ...current, projectType: undefined }));
      }
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const update = (field: keyof typeof empty, value: string | boolean) => {
    setValues((current) => ({ ...current, [field]: value }));
    if (field in errors) setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const focusFirstError = (fieldErrors: ContactErrors) => {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (status.kind === "sending") return;

    const result = validateContact(values);
    if (!result.ok) {
      setErrors(result.errors);
      focusFirstError(result.errors);
      return;
    }

    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: values.website }),
      });
      const body = (await response.json().catch(() => ({}))) as { error?: { message?: string; fields?: ContactErrors } };
      if (response.ok) {
        setStatus({ kind: "sent" });
        setValues(empty);
        return;
      }
      if (body.error?.fields) {
        setErrors(body.error.fields);
        focusFirstError(body.error.fields);
      }
      setStatus({ kind: "failed", message: body.error?.message ?? "Nie udało się wysłać zapytania. Spróbuj ponownie za kilka minut." });
    } catch {
      setStatus({ kind: "failed", message: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie." });
    }
  };

  const describedBy = (field: ContactField, extra?: string) => [errors[field] ? `${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  const error = (field: ContactField) =>
    errors[field] ? (
      <p id={`${field}-error`} className="field-error">
        {errors[field]}
      </p>
    ) : null;

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-ink/12 bg-white p-8 sm:p-12">
        <p className="wide text-[1.75rem] leading-tight font-medium tracking-[-0.02em]">Zapytanie wysłane.</p>
        <p className="mt-4 max-w-[32rem] text-slate">
          Dziękuję za wiadomość. Odpowiedź otrzymasz na podany adres e-mail – razem z pytaniami, które pomogą doprecyzować zakres projektu.
        </p>
        <button type="button" className="btn btn-outline-ink mt-8" onClick={() => setStatus({ kind: "idle" })}>
          Wyślij kolejne zapytanie
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby="form-hint" className="border border-ink/12 bg-white p-6 sm:p-10">
      <p id="form-hint" className="mb-8 text-[0.9375rem] text-slate">
        Wszystkie pola poza nazwą firmy są wymagane.
      </p>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="field-label">
            Imię
          </label>
          <input
            id="name"
            name="name"
            className="field"
            autoComplete="given-name"
            maxLength={LIMITS.name}
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            required
          />
          {error("name")}
        </div>
        <div>
          <label htmlFor="email" className="field-label">
            Adres e-mail
          </label>
          <input
            id="email"
            name="email"
            type="email"
            inputMode="email"
            className="field"
            autoComplete="email"
            maxLength={LIMITS.email}
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            required
          />
          {error("email")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="company" className="field-label">
            Nazwa firmy <span className="font-normal text-slate">(opcjonalnie)</span>
          </label>
          <input
            id="company"
            name="company"
            className="field"
            autoComplete="organization"
            maxLength={LIMITS.company}
            value={values.company}
            onChange={(e) => update("company", e.target.value)}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company")}
          />
          {error("company")}
        </div>
        <div>
          <label htmlFor="projectType" className="field-label">
            Rodzaj projektu
          </label>
          <select
            id="projectType"
            name="projectType"
            className="field"
            value={values.projectType}
            onChange={(e) => update("projectType", e.target.value)}
            aria-invalid={Boolean(errors.projectType)}
            aria-describedby={describedBy("projectType")}
            required
          >
            <option value="" disabled>
              Wybierz…
            </option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {error("projectType")}
        </div>
        <div>
          <label htmlFor="budget" className="field-label">
            Budżet
          </label>
          <select
            id="budget"
            name="budget"
            className="field"
            value={values.budget}
            onChange={(e) => update("budget", e.target.value)}
            aria-invalid={Boolean(errors.budget)}
            aria-describedby={describedBy("budget")}
            required
          >
            <option value="" disabled>
              Wybierz…
            </option>
            {budgets.map((budget) => (
              <option key={budget.value} value={budget.value}>
                {budget.label}
              </option>
            ))}
          </select>
          {error("budget")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="message" className="field-label">
            Wiadomość
          </label>
          <textarea
            id="message"
            name="message"
            className="field"
            maxLength={LIMITS.message}
            placeholder="Czym zajmuje się Twoja firma, czego potrzebujesz i do kiedy?"
            value={values.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={Boolean(errors.message)}
            aria-describedby={describedBy("message")}
            required
          />
          {error("message")}
        </div>
      </div>

      {/* Pole-pułapka dla botów – niewidoczne i pomijane przez czytniki ekranu. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor="website">Nie wypełniaj tego pola</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      <div className="mt-7">
        <label className="flex cursor-pointer items-start gap-3 text-[0.9375rem]">
          <input
            type="checkbox"
            name="consent"
            className="mt-1 h-5 w-5 shrink-0 accent-sky"
            checked={values.consent}
            onChange={(e) => update("consent", e.target.checked)}
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={describedBy("consent")}
            required
          />
          <span>
            {CONSENT_TEXT} Szczegóły w{" "}
            <Link href="/polityka-prywatnosci" className="underline underline-offset-2 hover:text-sky">
              polityce prywatności
            </Link>
            .
          </span>
        </label>
        {error("consent")}
      </div>

      <div className="mt-9 flex flex-col gap-5 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-ink" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Wysyłanie…" : "Wyślij zapytanie"}
        </button>
        <div aria-live="polite" className="text-[0.9375rem]">
          {status.kind === "failed" && (
            <p className="text-danger">
              {status.message}
              {fallbackEmail && (
                <>
                  {" "}
                  Możesz też napisać bezpośrednio na{" "}
                  <a href={`mailto:${fallbackEmail}`} className="underline underline-offset-2">
                    {fallbackEmail}
                  </a>
                  .
                </>
              )}
            </p>
          )}
        </div>
      </div>
    </form>
  );
}
