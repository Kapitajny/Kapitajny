"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { requestConsultation } from "@/app/actions";
import { categories, treatments } from "@/data/treatments";
import {
  contactChannels,
  LIMITS,
  maxBookingDate,
  timesOfDay,
  todayInWarsaw,
  UNSURE,
  validateConsultation,
  weekdays,
  type ConsultationCategory,
} from "@/lib/validation";
import { ConsentField, FieldError, Honeypot, NotConfiguredNotice, SubmitButton, TextAreaField, TextField, describe } from "./fields";
import { useValidatedForm } from "./useValidatedForm";

const categoryOptions: { value: ConsultationCategory; label: string }[] = [...categories.map((c) => ({ value: c.slug, label: c.name })), { value: UNSURE, label: "Jeszcze nie wiem" }];

function Fieldset({ legend, hint, error, name, children }: { legend: string; hint?: string; error?: string; name: string; children: React.ReactNode }) {
  return (
    <fieldset aria-describedby={describe(name, error, Boolean(hint))["aria-describedby"]}>
      <legend className="field-label">{legend}</legend>
      {hint && (
        <span id={`${name}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      <div className="mt-3">{children}</div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

/** Formularz to rzeczywista sekwencja trzech części, dlatego są numerowane. */
function Part({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-8 border-t border-black pt-8 md:grid-cols-[12rem_1fr] md:gap-12">
      <h2 className="font-serif text-3xl leading-tight">
        <span aria-hidden="true" className="mb-2 block font-sans text-xs font-medium text-rose-deep">
          {String(n).padStart(2, "0")} z 03
        </span>
        {title}
      </h2>
      <div className="space-y-9">{children}</div>
    </section>
  );
}

export function ConsultationForm({ initialTreatment }: { initialTreatment?: string }) {
  const preselected = treatments.find((t) => t.slug === initialTreatment);
  const [category, setCategory] = useState<ConsultationCategory | "">(preselected?.category ?? "");
  const [treatment, setTreatment] = useState(preselected?.slug ?? "");
  const { state, pending, errors, summary, formRef, formAction, onSubmit, onBlur, clearError } = useValidatedForm(requestConsultation, (input) =>
    validateConsultation(input),
  );

  if (state.status === "sent") {
    return (
      <div role="status" className="border-t border-black pt-10">
        <p className="font-serif text-5xl leading-tight text-burgundy">Zapytanie wysłane</p>
        <p className="mt-5 max-w-lg text-stone">{state.message}</p>
      </div>
    );
  }

  const shownCategories = category && category !== UNSURE ? categories.filter((c) => c.slug === category) : categories;

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} onBlur={onBlur} noValidate className="relative space-y-14" aria-describedby="consultation-status">
      <Honeypot />

      <Part n={1} title="Twoja wizyta">
        <Fieldset legend="Obszar" name="category" error={errors.category}>
          <div className="flex flex-wrap gap-2">
            {categoryOptions.map((option) => (
              <label key={option.value} className="chip">
                <input
                  type="radio"
                  name="category"
                  value={option.value}
                  checked={category === option.value}
                  onChange={() => {
                    setCategory(option.value);
                    clearError("category");
                    if (treatment && option.value !== UNSURE && treatments.find((t) => t.slug === treatment)?.category !== option.value) setTreatment("");
                  }}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <div>
          <label htmlFor="treatment" className="field-label">
            Zabieg <span className="font-normal text-stone">(opcjonalnie)</span>
          </label>
          <span id="treatment-hint" className="field-hint">
            Nie masz pewności? Zostaw puste – wybierzemy razem podczas konsultacji.
          </span>
          <select
            id="treatment"
            name="treatment"
            value={treatment}
            onChange={(e) => {
              setTreatment(e.target.value);
              const found = treatments.find((t) => t.slug === e.target.value);
              if (found && category !== UNSURE) setCategory(found.category);
              clearError("treatment");
            }}
            className="field-input"
            {...describe("treatment", errors.treatment, true)}
          >
            <option value="">Do ustalenia na konsultacji</option>
            {shownCategories.map((c) => (
              <optgroup key={c.slug} label={c.name}>
                {treatments
                  .filter((t) => t.category === c.slug)
                  .map((t) => (
                    <option key={t.slug} value={t.slug}>
                      {t.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <FieldError id="treatment-error" message={errors.treatment} />
        </div>

        <Fieldset legend="Czy to Twoja pierwsza wizyta w VÉRA?" name="firstVisit" error={errors.firstVisit}>
          <div className="flex flex-wrap gap-2" onChange={() => clearError("firstVisit")}>
            {[
              { value: "yes", label: "Tak, pierwsza" },
              { value: "no", label: "Nie, kolejna" },
            ].map((o) => (
              <label key={o.value} className="chip">
                <input type="radio" name="firstVisit" value={o.value} />
                <span>{o.label}</span>
              </label>
            ))}
          </div>
        </Fieldset>
      </Part>

      <Part n={2} title="Preferowany termin">
        <Fieldset legend="Dni tygodnia" name="days" hint="Zaznacz wszystkie, które Ci odpowiadają. Brak wyboru oznacza dowolny dzień." error={errors.days}>
          <div className="flex flex-wrap gap-2">
            {weekdays.map((d) => (
              <label key={d.value} className="chip">
                <input type="checkbox" name="days" value={d.value} aria-label={d.full} />
                <span aria-hidden="true">{d.label}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="Pora dnia" name="timeOfDay" error={errors.timeOfDay}>
          <div className="flex flex-wrap gap-2">
            {timesOfDay.map((t) => (
              <label key={t.value} className="chip">
                <input type="radio" name="timeOfDay" value={t.value} defaultChecked={t.value === "any"} />
                <span>
                  {t.label}
                  {t.hint && <span className="ml-2 text-xs opacity-70">{t.hint}</span>}
                </span>
              </label>
            ))}
          </div>
        </Fieldset>

        <TextField
          name="dateFrom"
          type="date"
          label="Najwcześniejsza data"
          optional
          hint="Przyjmujemy zapytania z wyprzedzeniem do sześciu miesięcy."
          min={todayInWarsaw()}
          max={maxBookingDate()}
          className="max-w-xs"
          error={errors.dateFrom}
        />
      </Part>

      <Part n={3} title="Twoje dane">
        <div className="grid gap-9 sm:grid-cols-2 sm:gap-8">
          <TextField name="name" label="Imię i nazwisko" autoComplete="name" required maxLength={LIMITS.name} error={errors.name} />
          <TextField name="phone" type="tel" label="Telefon" autoComplete="tel" inputMode="tel" required error={errors.phone} />
        </div>
        <TextField name="email" type="email" label="E-mail" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} error={errors.email} />

        <Fieldset legend="Jak mamy się z Tobą skontaktować?" name="contactBy" error={errors.contactBy}>
          <div className="flex flex-wrap gap-2">
            {contactChannels.map((c) => (
              <label key={c.value} className="chip">
                <input type="radio" name="contactBy" value={c.value} defaultChecked={c.value === "phone"} />
                <span>{c.label}</span>
              </label>
            ))}
          </div>
        </Fieldset>

        <TextAreaField
          name="message"
          label="Co warto, żebyśmy wiedzieli"
          optional
          hint="Na przykład co chcesz zmienić. Szczegóły medyczne prosimy zostawić na konsultację."
          maxLength={LIMITS.consultationMessage}
          rows={4}
          error={errors.message}
        />

        <div onChange={() => clearError("consent")}>
          <ConsentField error={errors.consent} />
        </div>
      </Part>

      <div className="md:pl-[calc(12rem+3rem)]">
        <div id="consultation-status" aria-live="polite" className="mb-6 space-y-4">
          {summary && <p className="text-sm text-danger">{summary}</p>}
          {state.status === "error" && <p className="text-sm text-danger">{state.message}</p>}
          {state.status === "not_configured" && <NotConfiguredNotice what="Zapytanie nie zostało wysłane" />}
        </div>
        <SubmitButton pending={pending} label="Wyślij zapytanie" pendingLabel="Wysyłanie…" />
        <p className="mt-4 max-w-md text-xs text-stone">Wysłanie formularza to zapytanie, a nie rezerwacja. Studio skontaktuje się z Tobą, aby ustalić termin.</p>
      </div>
    </form>
  );
}

function WithParams() {
  const slug = useSearchParams().get("zabieg") ?? undefined;
  return <ConsultationForm key={slug} initialTreatment={slug} />;
}

/**
 * Formularz z zabiegiem wybranym na podstawie adresu (`/konsultacja?zabieg=…`).
 * Strona pozostaje statyczna: w HTML jest pełny formularz, a wybór z adresu uzupełnia się po załadowaniu.
 */
export function ConsultationFormFromUrl() {
  return (
    <Suspense fallback={<ConsultationForm />}>
      <WithParams />
    </Suspense>
  );
}
