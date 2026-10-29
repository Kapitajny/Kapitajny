"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Ledger } from "@/components/calculator/Ledger";
import { IconArrowLeft, IconArrowRight, IconEdit, IconLock } from "@/components/ui/Icons";
import { Notice } from "@/components/ui/Notice";
import { postJson } from "@/lib/api-client";
import { formatDateTime } from "@/lib/format";
import type { CalculationResult } from "@/lib/pricing/calculator";
import { BUSINESS_TYPES, SERVICE_IDS, pricingConfig as cfg, type ServiceId } from "@/lib/pricing/config";
import { hasErrors, type FieldErrors } from "@/lib/validation/fields";
import {
  BUDGETS,
  QUOTE_STEPS,
  START_TERMS,
  TAX_FORMS,
  validateQuote,
  type QuoteField,
  type QuoteFormValues,
} from "@/lib/validation/quote";
import { StepIndicator } from "./StepIndicator";
import { CheckboxField, ErrorSummary, FieldMessages, Honeypot, SelectField, TextField, TextareaField } from "./Fields";

const LABELS: Record<QuoteField, string> = {
  name: "Imię",
  email: "Adres e-mail",
  phone: "Telefon",
  company: "Nazwa firmy",
  businessType: "Rodzaj działalności",
  taxForm: "Forma opodatkowania",
  documents: "Liczba dokumentów",
  employees: "Liczba pracowników",
  services: "Zakres usług",
  budget: "Orientacyjny budżet",
  startTerm: "Termin rozpoczęcia",
  message: "Dodatkowe informacje",
  consent: "Zgoda",
};

const BUSINESS_OPTIONS = Object.fromEntries(BUSINESS_TYPES.map((t) => [t, cfg.businessTypes[t].label]));
const SUMMARY_STEP = QUOTE_STEPS.length;

type Props = {
  initial: QuoteFormValues;
  calculatorQuery: string | null;
  estimate: CalculationResult | null;
};

export function QuoteForm({ initial, calculatorQuery, estimate }: Props) {
  const [values, setValues] = useState<QuoteFormValues>(initial);
  const [errors, setErrors] = useState<FieldErrors<QuoteField>>({});
  const [step, setStep] = useState(0);
  const [honeypot, setHoneypot] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [result, setResult] = useState<{ number: string; createdAt: string } | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const set = <K extends QuoteField>(key: K, value: QuoteFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  function goTo(next: number) {
    setStep(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  function showErrors(found: FieldErrors<QuoteField>) {
    setErrors(found);
    requestAnimationFrame(() => document.getElementById("error-summary")?.focus());
  }

  function next() {
    const found = validateQuote(values, QUOTE_STEPS[step].fields);
    if (hasErrors(found)) return showErrors(found);
    setErrors({});
    goTo(step + 1);
  }

  async function submit() {
    const found = validateQuote(values);
    if (hasErrors(found)) {
      const firstStep = QUOTE_STEPS.findIndex((s) => s.fields.some((f) => found[f]));
      setStep(Math.max(0, firstStep));
      return showErrors(found);
    }
    setStatus("sending");
    const res = await postJson<{ number: string; createdAt: string }>("/api/demo/inquiries", {
      kind: "wycena",
      values,
      website: honeypot,
      startedAt,
      calculatorQuery,
    });
    if (res.ok) {
      setResult(res.data);
      setStatus("idle");
      requestAnimationFrame(() => document.getElementById("quote-success")?.focus());
      return;
    }
    setStatus("error");
    setServerMessage(res.message);
    if (res.errors) {
      const serverErrors = res.errors as FieldErrors<QuoteField>;
      const firstStep = QUOTE_STEPS.findIndex((s) => s.fields.some((f) => serverErrors[f]));
      if (firstStep >= 0) {
        setStep(firstStep);
        showErrors(serverErrors);
      }
    }
  }

  if (result) {
    return (
      <div id="quote-success" tabIndex={-1} className="panel p-6 focus:outline-none sm:p-10">
        <Notice tone="success" title="Zgłoszenie zapisane w środowisku demonstracyjnym" role="status">
          <p>
            Numer zgłoszenia: <strong className="num">{result.number}</strong> ({formatDateTime(result.createdAt)}).
          </p>
        </Notice>
        <div className="prose-body mt-6 text-ink">
          <p>
            <strong>Nie wysłano żadnej wiadomości e-mail.</strong> Formularz nie jest połączony z pocztą ani systemem CRM
            – zgłoszenie trafiło wyłącznie do tymczasowej pamięci serwera demonstracyjnego (z zamaskowanym adresem
            e-mail) i zostanie usunięte w ciągu kilku godzin.
          </p>
          <p>W wersji produkcyjnej w tym miejscu klient otrzymałby potwierdzenie i informację o czasie odpowiedzi.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/panel-demo" className="btn btn-dark">
            Zobacz zgłoszenie w panelu demo
          </Link>
          <Link href="/" className="btn btn-outline">
            Wróć na stronę główną
          </Link>
        </div>
      </div>
    );
  }

  const stepTitles = [...QUOTE_STEPS.map((s) => s.title), "Podsumowanie"];
  const visibleErrors = Object.fromEntries(Object.entries(errors).filter(([, v]) => v));

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (step < SUMMARY_STEP) next();
          else submit();
        }}
        className="relative min-w-0"
        aria-label="Formularz indywidualnej wyceny"
      >
        <StepIndicator steps={stepTitles} current={step} label="Kroki formularza" />

        <div className="panel p-5 sm:p-8">
          <h2 ref={headingRef} tabIndex={-1} className="mb-6 text-[1.75rem] focus:outline-none">
            {stepTitles[step]}
          </h2>

          {Object.keys(visibleErrors).length > 0 && (
            <div className="mb-6">
              <ErrorSummary errors={visibleErrors} labels={LABELS} />
            </div>
          )}

          <Honeypot value={honeypot} onChange={setHoneypot} />

          {step === 0 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField
                id="businessType"
                label={LABELS.businessType}
                options={BUSINESS_OPTIONS}
                value={values.businessType}
                onChange={(e) => set("businessType", e.target.value as QuoteFormValues["businessType"])}
                error={errors.businessType}
              />
              <SelectField
                id="taxForm"
                label="Aktualna forma opodatkowania"
                optional
                options={TAX_FORMS}
                placeholder="Nie podaję"
                value={values.taxForm}
                onChange={(e) => set("taxForm", e.target.value as QuoteFormValues["taxForm"])}
                error={errors.taxForm}
              />
              <TextField
                id="documents"
                label="Miesięczna liczba dokumentów"
                type="number"
                inputMode="numeric"
                min={0}
                max={cfg.limits.documents.max}
                value={values.documents}
                onChange={(e) => set("documents", e.target.value)}
                error={errors.documents}
                hint="Szacunkowo: faktury, rachunki i wyciągi."
              />
              <TextField
                id="employees"
                label="Liczba pracowników"
                type="number"
                inputMode="numeric"
                min={0}
                max={cfg.limits.employees.max}
                value={values.employees}
                onChange={(e) => set("employees", e.target.value)}
                error={errors.employees}
                hint="Wpisz 0, jeśli nikogo nie zatrudniasz."
              />
              <fieldset id="services" tabIndex={-1} className="sm:col-span-2" aria-describedby={errors.services ? "services-error" : undefined}>
                <legend className="field-label">Zakres poszukiwanych usług</legend>
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {SERVICE_IDS.map((id) => (
                    <label key={id} className="choice py-3">
                      <input
                        type="checkbox"
                        checked={values.services.includes(id)}
                        onChange={() =>
                          set(
                            "services",
                            values.services.includes(id)
                              ? values.services.filter((s) => s !== id)
                              : ([...values.services, id] as ServiceId[]),
                          )
                        }
                      />
                      <span className="font-medium text-navy">{cfg.services[id].label}</span>
                    </label>
                  ))}
                </div>
                <FieldMessages id="services" error={errors.services} />
              </fieldset>
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <SelectField
                id="budget"
                label={LABELS.budget}
                options={BUDGETS}
                value={values.budget}
                onChange={(e) => set("budget", e.target.value as QuoteFormValues["budget"])}
                error={errors.budget}
              />
              <SelectField
                id="startTerm"
                label="Preferowany termin rozpoczęcia"
                options={START_TERMS}
                value={values.startTerm}
                onChange={(e) => set("startTerm", e.target.value as QuoteFormValues["startTerm"])}
                error={errors.startTerm}
              />
              <div className="sm:col-span-2">
                <TextareaField
                  id="message"
                  label={LABELS.message}
                  optional
                  rows={5}
                  maxLength={2000}
                  value={values.message}
                  onChange={(e) => set("message", e.target.value)}
                  error={errors.message}
                  hint={`Np. specyfika branży, transakcje zagraniczne, zmiana biura. ${values.message.length}/2000 znaków. Nie wpisuj danych wrażliwych.`}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 sm:grid-cols-2">
              <TextField id="name" label={LABELS.name} autoComplete="given-name" value={values.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
              <TextField
                id="email"
                label={LABELS.email}
                type="email"
                autoComplete="email"
                value={values.email}
                onChange={(e) => set("email", e.target.value)}
                error={errors.email}
              />
              <TextField
                id="phone"
                label={LABELS.phone}
                optional
                type="tel"
                autoComplete="tel"
                value={values.phone}
                onChange={(e) => set("phone", e.target.value)}
                error={errors.phone}
              />
              <TextField
                id="company"
                label={LABELS.company}
                optional
                autoComplete="organization"
                value={values.company}
                onChange={(e) => set("company", e.target.value)}
                error={errors.company}
              />
              <div className="space-y-3 sm:col-span-2">
                <CheckboxField
                  id="consent"
                  checked={values.consent}
                  onChange={(c) => set("consent", c)}
                  error={errors.consent}
                  label={
                    <>
                      Wyrażam zgodę na przetwarzanie podanych danych w celu przygotowania wyceny. Zapoznałem(-am) się z{" "}
                      <Link href="/polityka-prywatnosci" className="link" target="_blank">
                        polityką prywatności (wersja demonstracyjna)
                      </Link>
                      .
                    </>
                  }
                />
                <p className="flex gap-2 text-sm text-muted">
                  <IconLock size={16} className="mt-0.5 shrink-0" />
                  To wersja demonstracyjna – nie wpisuj prawdziwych danych osobowych ani danych firmy.
                </p>
              </div>
            </div>
          )}

          {step === SUMMARY_STEP && <QuoteSummary values={values} onEdit={goTo} />}

          {status === "error" && (
            <Notice tone="error" title="Nie udało się zapisać zgłoszenia" role="alert" className="mt-6">
              {serverMessage}
            </Notice>
          )}

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:justify-between">
            {step > 0 ? (
              <button type="button" className="btn btn-outline" onClick={() => goTo(step - 1)}>
                <IconArrowLeft size={18} />
                Wstecz
              </button>
            ) : (
              <span />
            )}
            {step < SUMMARY_STEP ? (
              <button type="submit" className="btn btn-primary">
                {step === SUMMARY_STEP - 1 ? "Przejdź do podsumowania" : "Dalej"}
                <IconArrowRight size={18} />
              </button>
            ) : (
              <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
                {status === "sending" && <span className="spinner" aria-hidden="true" />}
                {status === "sending" ? "Zapisywanie…" : "Wyślij zgłoszenie (demo)"}
              </button>
            )}
          </div>
        </div>
      </form>

      <aside className="space-y-6" aria-label="Informacje o wycenie">
        {estimate?.ok ? (
          <div className="panel p-5">
            <p className="text-sm font-semibold text-navy">Dane z kalkulatora</p>
            <p className="mb-3 text-sm text-muted">Przenieśliśmy wybrany zakres do formularza.</p>
            <Ledger lines={estimate.lines} adjustments={estimate.adjustments} totalLabel="Szacunek" total={estimate.monthly} />
            <p className="mt-3 text-sm text-ink">
              Proponowany pakiet: <strong className="text-navy">{estimate.recommendedPackage.name}</strong>
            </p>
            {calculatorQuery && (
              <Link href={`/kalkulator?${calculatorQuery}`} className="btn btn-sm btn-outline mt-4 w-full">
                Zmień w kalkulatorze
              </Link>
            )}
          </div>
        ) : (
          <div className="panel p-5 text-sm">
            <p className="font-semibold text-navy">Chcesz najpierw poznać szacunek?</p>
            <p className="mt-1 text-muted">Kalkulator wypełni część formularza za Ciebie.</p>
            <Link href="/kalkulator" className="btn btn-sm btn-outline mt-4 w-full">
              Otwórz kalkulator
            </Link>
          </div>
        )}
        <Notice tone="demo" title="Formularz demonstracyjny">
          Zgłoszenie nie jest wysyłane e-mailem. W wersji produkcyjnej formularz wymaga podłączenia usługi pocztowej lub
          CRM oraz weryfikacji antyspamowej po stronie serwera.
        </Notice>
      </aside>
    </div>
  );
}

function QuoteSummary({ values, onEdit }: { values: QuoteFormValues; onEdit: (step: number) => void }) {
  const sections: { step: number; rows: [string, string][] }[] = [
    {
      step: 0,
      rows: [
        ["Rodzaj działalności", values.businessType ? cfg.businessTypes[values.businessType].label : "–"],
        ["Forma opodatkowania", values.taxForm ? TAX_FORMS[values.taxForm] : "Nie podano"],
        ["Dokumenty miesięcznie", values.documents],
        ["Pracownicy", values.employees],
        ["Usługi", values.services.map((s) => cfg.services[s].label).join(", ")],
      ],
    },
    {
      step: 1,
      rows: [
        ["Budżet", values.budget ? BUDGETS[values.budget] : "–"],
        ["Termin rozpoczęcia", values.startTerm ? START_TERMS[values.startTerm] : "–"],
        ["Dodatkowe informacje", values.message || "Brak"],
      ],
    },
    {
      step: 2,
      rows: [
        ["Imię", values.name],
        ["E-mail", values.email],
        ["Telefon", values.phone || "Nie podano"],
        ["Firma", values.company || "Nie podano"],
      ],
    },
  ];
  return (
    <div className="space-y-6">
      <p className="text-ink">Sprawdź dane przed wysłaniem. Każdą sekcję możesz poprawić.</p>
      {sections.map((section) => (
        <section key={section.step} className="rounded-[var(--radius-control)] border border-line" aria-label={QUOTE_STEPS[section.step].title}>
          <div className="flex items-center justify-between border-b border-line bg-mist px-4 py-2.5">
            <h3 className="font-sans text-base font-semibold">{QUOTE_STEPS[section.step].title}</h3>
            <button
              type="button"
              className="btn btn-sm px-2 text-blue-ink"
              aria-label={`Edytuj: ${QUOTE_STEPS[section.step].title}`}
              onClick={() => onEdit(section.step)}
            >
              <IconEdit size={16} />
              Edytuj
            </button>
          </div>
          <dl className="divide-y divide-line">
            {section.rows.map(([label, value]) => (
              <div key={label} className="grid gap-1 px-4 py-2.5 text-[0.9375rem] sm:grid-cols-[12rem_1fr]">
                <dt className="text-muted">{label}</dt>
                <dd className="break-words whitespace-pre-line text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
      <p className="text-sm text-muted">Zgoda na przetwarzanie danych: {values.consent ? "udzielona" : "brak"}.</p>
    </div>
  );
}
