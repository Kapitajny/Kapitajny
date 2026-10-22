"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useId, useRef, useState, useSyncExternalStore } from "react";
import { submitContact } from "@/app/kontakt/actions";
import {
  FIELD_ORDER,
  LIMITS,
  scopeOptions,
  serviceOptions,
  validateContact,
  validateField,
  type ContactField,
  type ContactInput,
  type FieldErrors,
} from "@/lib/contact/schema";
import { HONEYPOT_FIELD, STARTED_AT_FIELD } from "@/lib/contact/spam";
import { initialContactState } from "@/lib/contact/state";
import { buttonClass } from "@/components/ui/LinkButton";
import styles from "./ContactForm.module.css";

const EMPTY: ContactInput = { name: "", email: "", company: "", service: "", scope: "", message: "", consent: false };

const FIELD_LABELS: Record<ContactField, string> = {
  name: "Imię",
  email: "Służbowy adres e-mail",
  company: "Nazwa firmy",
  service: "Interesująca usługa",
  scope: "Orientacyjny zakres",
  message: "Opis problemu lub potrzeby",
  consent: "Zgoda na przetwarzanie danych",
};

// Usługa wskazana w adresie (?usluga=...) – odczyt bez efektu, z bezpieczną wartością na serwerze.
const subscribeToNothing = () => () => {};
function useServiceFromUrl(): string {
  return useSyncExternalStore(
    subscribeToNothing,
    () => {
      const value = new URLSearchParams(window.location.search).get("usluga") ?? "";
      return serviceOptions.some((option) => option.value === value) ? value : "";
    },
    () => "",
  );
}

export function ContactForm({ demoMode }: { demoMode: boolean }) {
  const [state, formAction, isPending] = useActionState(submitContact, initialContactState);
  const [values, setValues] = useState<ContactInput>(EMPTY);
  const [serviceTouched, setServiceTouched] = useState(false);
  const [clientErrors, setClientErrors] = useState<FieldErrors>({});
  // Pola edytowane od ostatniej odpowiedzi serwera – dla nich nie pokazujemy już błędu z serwera.
  const [editedSinceSubmit, setEditedSinceSubmit] = useState<ReadonlySet<ContactField>>(new Set());
  const [summary, setSummary] = useState<FieldErrors | null>(null);
  // Wynik wysyłki, który użytkownik zamknął przyciskiem „Wróć do formularza”.
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);

  const formRef = useRef<HTMLFormElement>(null);
  // Moment pokazania formularza (pułapka czasowa) – ustawiany w przeglądarce, bo strona jest generowana statycznie.
  const startedAtRef = useRef(0);
  const resultHeadingRef = useRef<HTMLHeadingElement>(null);
  const id = useId();

  const urlService = useServiceFromUrl();
  const service = serviceTouched ? values.service : values.service || urlService;
  const current: ContactInput = { ...values, service };

  const showResult = (state.status === "sent" || state.status === "demo") && state.submittedAt !== dismissedAt;

  useEffect(() => {
    if (showResult) resultHeadingRef.current?.focus();
    else startedAtRef.current = Date.now();
  }, [showResult]);

  const serverErrors: FieldErrors = state.status === "invalid" ? state.errors : {};
  const errorFor = (field: ContactField) => clientErrors[field] ?? (editedSinceSubmit.has(field) ? undefined : serverErrors[field]);

  const update = <K extends keyof ContactInput>(field: K, value: ContactInput[K]) => {
    setValues((previous) => ({ ...previous, [field]: value }));
    if (field === "service") setServiceTouched(true);
    setEditedSinceSubmit((previous) => new Set(previous).add(field as ContactField));
    // Po pierwszym błędzie walidujemy na bieżąco, żeby komunikat znikał zaraz po poprawce.
    if (clientErrors[field as ContactField]) {
      const message = validateField(field as ContactField, { ...current, [field]: value });
      setClientErrors((previous) => ({ ...previous, [field]: message }));
    }
  };

  const validateOnBlur = (field: ContactField) => {
    const message = validateField(field, current);
    setClientErrors((previous) => ({ ...previous, [field]: message }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = validateContact(current);
    if (!result.ok) {
      setClientErrors(result.errors);
      setSummary(result.errors);
      const first = FIELD_ORDER.find((field) => result.errors[field]);
      if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setClientErrors({});
    setSummary(null);
    setEditedSinceSubmit(new Set());
    const formData = new FormData(event.currentTarget);
    formData.set("service", service);
    formData.set(STARTED_AT_FIELD, String(startedAtRef.current));
    startTransition(() => formAction(formData));
  };

  const closeResult = () => {
    if (state.status !== "sent" && state.status !== "demo") return;
    // Po udanej wysyłce czyścimy formularz; w trybie demonstracyjnym dane zostają, żeby nie trzeba było ich wpisywać ponownie.
    if (state.status === "sent") {
      setValues(EMPTY);
      setServiceTouched(true);
    }
    setDismissedAt(state.submittedAt);
  };

  if (showResult) {
    const isDemo = state.status === "demo";
    return (
      <div className={`${styles.result} ${isDemo ? styles.resultDemo : styles.resultSent}`} role="status">
        <h2 ref={resultHeadingRef} tabIndex={-1} className={styles.resultTitle}>
          {isDemo ? "Wiadomość nie została wysłana – tryb demonstracyjny" : "Wiadomość wysłana"}
        </h2>
        {isDemo ? (
          <>
            <p>
              Formularz przeszedł walidację po stronie serwera, ale w tym wdrożeniu nie skonfigurowano wysyłki poczty, więc{" "}
              <strong>nikt nie otrzymał Twojej wiadomości</strong>. Twoje dane nie zostały zapisane.
            </p>
            <p>Aby uruchomić prawdziwą wysyłkę, administrator strony musi skonfigurować dostawcę poczty zgodnie z instrukcją w pliku README.</p>
          </>
        ) : (
          <p>Dziękujemy. Odpowiemy na adres {values.email || "podany w formularzu"}. Jeśli odpowiedź nie dotrze, sprawdź folder spamu.</p>
        )}
        <div className={styles.resultActions}>
          <button type="button" className={buttonClass({ variant: "secondary" })} onClick={closeResult}>
            {isDemo ? "Wróć do formularza" : "Wyślij kolejne zapytanie"}
          </button>
          <Link href="/baza-wiedzy" className="text-link">
            Przejdź do bazy wiedzy
          </Link>
        </div>
      </div>
    );
  }

  const summaryErrors = summary ? FIELD_ORDER.filter((field) => summary[field] && errorFor(field)) : [];
  const describedBy = (field: ContactField, extra?: string) => [extra, errorFor(field) ? `${id}-${field}-error` : null].filter(Boolean).join(" ") || undefined;

  return (
    <form ref={formRef} className={styles.form} action={formAction} onSubmit={handleSubmit} noValidate aria-describedby={demoMode ? `${id}-demo` : undefined}>
      {demoMode ? (
        <p id={`${id}-demo`} className={styles.demoNotice}>
          <strong>Tryb demonstracyjny.</strong> Wysyłka poczty nie jest skonfigurowana – formularz sprawdzi dane, ale wiadomość nie zostanie nikomu
          przekazana.
        </p>
      ) : null}

      <noscript>
        <p className={styles.formError}>Formularz wymaga włączonej obsługi JavaScriptu w przeglądarce.</p>
      </noscript>

      {summaryErrors.length > 0 ? (
        <div className={styles.summary} role="alert">
          <p className={styles.summaryTitle}>Formularz wymaga poprawek ({summaryErrors.length}):</p>
          <ul>
            {summaryErrors.map((field) => (
              <li key={field}>
                <a href={`#${id}-${field}`}>
                  {FIELD_LABELS[field]}: {errorFor(field)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {state.status === "invalid" || state.status === "rejected" || state.status === "rate-limited" || state.status === "failed" ? (
        <p className={styles.formError} role="alert">
          {state.message}
        </p>
      ) : null}

      <div className={styles.row}>
        <Field id={`${id}-name`} label={FIELD_LABELS.name} required error={errorFor("name")} errorId={`${id}-name-error`}>
          <input
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="given-name"
            maxLength={LIMITS.name.max}
            required
            aria-invalid={Boolean(errorFor("name"))}
            aria-describedby={describedBy("name")}
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            onBlur={() => validateOnBlur("name")}
          />
        </Field>
        <Field id={`${id}-email`} label={FIELD_LABELS.email} required error={errorFor("email")} errorId={`${id}-email-error`}>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            maxLength={LIMITS.email.max}
            required
            aria-invalid={Boolean(errorFor("email"))}
            aria-describedby={describedBy("email")}
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            onBlur={() => validateOnBlur("email")}
          />
        </Field>
      </div>

      <Field id={`${id}-company`} label={FIELD_LABELS.company} optional error={errorFor("company")} errorId={`${id}-company-error`}>
        <input
          id={`${id}-company`}
          name="company"
          type="text"
          autoComplete="organization"
          maxLength={LIMITS.company.max}
          aria-invalid={Boolean(errorFor("company"))}
          aria-describedby={describedBy("company")}
          value={values.company}
          onChange={(event) => update("company", event.target.value)}
          onBlur={() => validateOnBlur("company")}
        />
      </Field>

      <div className={styles.row}>
        <Field id={`${id}-service`} label={FIELD_LABELS.service} required error={errorFor("service")} errorId={`${id}-service-error`}>
          <select
            id={`${id}-service`}
            name="service"
            required
            aria-invalid={Boolean(errorFor("service"))}
            aria-describedby={describedBy("service")}
            value={service}
            onChange={(event) => update("service", event.target.value)}
            onBlur={() => validateOnBlur("service")}
          >
            <option value="" disabled>
              Wybierz z listy
            </option>
            {serviceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Field id={`${id}-scope`} label={FIELD_LABELS.scope} optional error={errorFor("scope")} errorId={`${id}-scope-error`}>
          <select
            id={`${id}-scope`}
            name="scope"
            aria-invalid={Boolean(errorFor("scope"))}
            aria-describedby={describedBy("scope")}
            value={values.scope}
            onChange={(event) => update("scope", event.target.value)}
          >
            <option value="">Nie wybrano</option>
            {scopeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field
        id={`${id}-message`}
        label={FIELD_LABELS.message}
        required
        error={errorFor("message")}
        errorId={`${id}-message-error`}
        hint={
          <span id={`${id}-message-hint`} className={styles.hintRow}>
            <span>Co się dzieje, od kiedy i czego oczekujesz. Nie podawaj haseł ani danych dostępowych.</span>
            <span className={styles.counter} data-over={values.message.trim().length > LIMITS.message.max || undefined}>
              {values.message.trim().length} / {LIMITS.message.max}
            </span>
          </span>
        }
      >
        <textarea
          id={`${id}-message`}
          name="message"
          rows={7}
          required
          aria-invalid={Boolean(errorFor("message"))}
          aria-describedby={describedBy("message", `${id}-message-hint`)}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          onBlur={() => validateOnBlur("message")}
        />
      </Field>

      <div className={styles.consent}>
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          required
          aria-invalid={Boolean(errorFor("consent"))}
          aria-describedby={describedBy("consent")}
          checked={values.consent}
          onChange={(event) => update("consent", event.target.checked)}
        />
        <label htmlFor={`${id}-consent`}>
          Potwierdzam zapoznanie się z{" "}
          <Link href="/polityka-prywatnosci" className="text-link" target="_blank">
            polityką prywatności
            <span className="visually-hidden"> (otwiera się w nowej karcie)</span>
          </Link>{" "}
          i rozumiem, że dane z formularza posłużą wyłącznie do odpowiedzi na zapytanie. <span className={styles.required}>(wymagane)</span>
        </label>
        {errorFor("consent") ? (
          <p id={`${id}-consent-error`} className={styles.error}>
            {errorFor("consent")}
          </p>
        ) : null}
      </div>

      {/* Pole-pułapka dla automatów: ukryte przed ludźmi i czytnikami ekranu. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor={`${id}-trap`}>Nie wypełniaj tego pola</label>
        <input id={`${id}-trap`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <div className={styles.submitRow}>
        <button type="submit" className={buttonClass({ size: "large" })} disabled={isPending} aria-disabled={isPending}>
          {isPending ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              Wysyłanie…
            </>
          ) : (
            "Wyślij zapytanie"
          )}
        </button>
        <p className={styles.submitNote} aria-live="polite">
          {isPending ? "Wysyłamy formularz, to potrwa chwilę." : "Pola oznaczone jako wymagane trzeba uzupełnić."}
        </p>
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  errorId: string;
  hint?: React.ReactNode;
  children: React.ReactNode;
};

function Field({ id, label, required, optional, error, errorId, hint, children }: FieldProps) {
  return (
    <div className={styles.field} data-invalid={error ? "" : undefined}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {required ? <span className={styles.required}> (wymagane)</span> : null}
        {optional ? <span className={styles.optional}> (opcjonalnie)</span> : null}
      </label>
      {children}
      {hint}
      {error ? (
        <p id={errorId} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
