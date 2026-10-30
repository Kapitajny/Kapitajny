"use client";

import { useState } from "react";
import { requestConsultation } from "@/app/actions";
import { categories, services } from "@/data/services";
import {
  contactChannels,
  LIMITS,
  timesOfDay,
  todayInWarsaw,
  UNSURE,
  validateConsultation,
  weekdays,
  type ConsultationCategory,
} from "@/lib/validation";
import { ConsentField, FieldError, Honeypot, NotConfiguredNotice, SubmitButton, TextAreaField, TextField, describe } from "./fields";
import { useValidatedForm } from "./useValidatedForm";

const categoryOptions: { value: ConsultationCategory; label: string; hint: string }[] = [
  ...categories.map((c) => ({ value: c.slug, label: c.name, hint: `wykonuje ${c.performedBy}` })),
  { value: UNSURE, label: "Nie wiem, doradźcie", hint: "dobierzemy konsultację" },
];

function Fieldset({ legend, hint, error, name, children }: { legend: string; hint?: string; error?: string; name: string; children: React.ReactNode }) {
  return (
    <fieldset aria-describedby={describe(name, error, Boolean(hint))["aria-describedby"]}>
      <legend className="field-label">{legend}</legend>
      {hint && (
        <span id={`${name}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      <div className="mt-4">{children}</div>
      <FieldError id={`${name}-error`} message={error} />
    </fieldset>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-8 border-t border-line pt-10 md:grid-cols-[11rem_1fr] md:gap-10">
      <h2 className="font-serif text-2xl leading-tight text-espresso">{title}</h2>
      <div className="space-y-9">{children}</div>
    </section>
  );
}

export function ConsultationForm({ initialService }: { initialService?: string }) {
  const preselected = services.find((s) => s.slug === initialService);
  const [category, setCategory] = useState<ConsultationCategory | "">(preselected?.category ?? "");
  const [service, setService] = useState(preselected?.slug ?? "");
  const { state, pending, errors, summary, formRef, formAction, onSubmit, onBlur, clearError } = useValidatedForm(requestConsultation, (input) =>
    validateConsultation(input),
  );

  if (state.status === "sent") {
    return (
      <div role="status" className="border-t border-espresso pt-10">
        <p className="font-serif text-4xl leading-tight text-espresso">Zapytanie wysłane</p>
        <p className="mt-5 max-w-lg text-taupe">{state.message}</p>
      </div>
    );
  }

  const availableServices = category && category !== UNSURE ? services.filter((s) => s.category === category) : services;
  const today = todayInWarsaw();

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} onBlur={onBlur} noValidate className="relative space-y-12" aria-describedby="consultation-status">
      <Honeypot />

      <Step title="Czego dotyczy wizyta">
        <Fieldset legend="Obszar" name="category" error={errors.category}>
          <div className="grid gap-2 sm:grid-cols-2">
            {categoryOptions.map((option) => (
              <label key={option.value} className="choice">
                <input
                  type="radio"
                  name="category"
                  value={option.value}
                  checked={category === option.value}
                  onChange={() => {
                    setCategory(option.value);
                    clearError("category");
                    if (service && option.value !== UNSURE && services.find((s) => s.slug === service)?.category !== option.value) setService("");
                  }}
                />
                <span>
                  <span className="text-sm font-medium">{option.label}</span>
                  <span className="choice-hint text-xs text-taupe">{option.hint}</span>
                </span>
              </label>
            ))}
          </div>
        </Fieldset>

        <div>
          <label htmlFor="service" className="field-label">
            Zabieg <span className="font-normal text-taupe">(opcjonalnie)</span>
          </label>
          <span id="service-hint" className="field-hint">
            Jeśli nie masz pewności, zostaw puste – dobierzemy go podczas konsultacji.
          </span>
          <select
            id="service"
            name="service"
            value={service}
            onChange={(e) => {
              setService(e.target.value);
              const found = services.find((s) => s.slug === e.target.value);
              if (found && category !== UNSURE) setCategory(found.category);
              clearError("service");
            }}
            className="field-input"
            {...describe("service", errors.service, true)}
          >
            <option value="">Do ustalenia na konsultacji</option>
            {(category && category !== UNSURE ? [categories.find((c) => c.slug === category)!] : categories).map((c) => (
              <optgroup key={c.slug} label={c.name}>
                {availableServices
                  .filter((s) => s.category === c.slug)
                  .map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
              </optgroup>
            ))}
          </select>
          <FieldError id="service-error" message={errors.service} />
        </div>

        <Fieldset legend="Czy to Twoja pierwsza wizyta w ÉLORIA?" name="firstVisit" error={errors.firstVisit}>
          <div className="flex flex-wrap gap-x-8 gap-y-3" onChange={() => clearError("firstVisit")}>
            {[
              { value: "tak", label: "Tak, pierwsza" },
              { value: "nie", label: "Nie, to kolejna wizyta" },
            ].map((o) => (
              <label key={o.value} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="radio" name="firstVisit" value={o.value} className="field-check" />
                {o.label}
              </label>
            ))}
          </div>
        </Fieldset>
      </Step>

      <Step title="Preferowany termin">
        <Fieldset legend="Dni tygodnia" name="days" hint="Zaznacz wszystkie, które Ci odpowiadają. Brak wyboru oznacza dowolny dzień." error={errors.days}>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {weekdays.map((d) => (
              <label key={d.value} className="choice text-center">
                <input type="checkbox" name="days" value={d.value} aria-label={d.full} />
                <span className="items-center text-sm" aria-hidden="true">
                  {d.label}
                </span>
              </label>
            ))}
          </div>
        </Fieldset>

        <Fieldset legend="Pora dnia" name="timeOfDay" error={errors.timeOfDay}>
          <div className="grid gap-2 sm:grid-cols-4">
            {timesOfDay.map((t) => (
              <label key={t.value} className="choice">
                <input type="radio" name="timeOfDay" value={t.value} defaultChecked={t.value === "dowolnie"} />
                <span>
                  <span className="text-sm font-medium">{t.label}</span>
                  {t.hint && <span className="choice-hint text-xs text-taupe">{t.hint}</span>}
                </span>
              </label>
            ))}
          </div>
        </Fieldset>

        <TextField
          name="dateFrom"
          type="date"
          label="Najwcześniej od"
          optional
          min={today}
          hint="Recepcja zaproponuje pierwszy wolny termin od tego dnia."
          error={errors.dateFrom}
          className="max-w-xs"
        />
      </Step>

      <Step title="Twoje dane">
        <TextField name="name" label="Imię i nazwisko" autoComplete="name" required maxLength={LIMITS.name} error={errors.name} />
        <div className="grid gap-8 sm:grid-cols-2">
          <TextField name="phone" type="tel" label="Telefon" autoComplete="tel" inputMode="tel" required error={errors.phone} />
          <TextField name="email" type="email" label="E-mail" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} error={errors.email} />
        </div>
        <Fieldset legend="Jak mamy się z Tobą skontaktować?" name="contactBy" error={errors.contactBy}>
          <div className="flex flex-wrap gap-x-8 gap-y-3">
            {contactChannels.map((c) => (
              <label key={c.value} className="flex cursor-pointer items-center gap-3 text-sm">
                <input type="radio" name="contactBy" value={c.value} defaultChecked={c.value === "telefon"} className="field-check" />
                {c.label}
              </label>
            ))}
          </div>
        </Fieldset>
        <TextAreaField
          name="message"
          label="Dodatkowe informacje"
          optional
          rows={4}
          maxLength={LIMITS.consultationMessage}
          hint="Np. dogodne godziny kontaktu. Prosimy nie opisywać szczegółów stanu zdrowia – porozmawiamy o nich na konsultacji."
          error={errors.message}
        />
        <div onChange={() => clearError("consent")}>
          <ConsentField error={errors.consent} />
        </div>
      </Step>

      <div className="space-y-6 border-t border-line pt-10 md:pl-[13.5rem]">
        <div id="consultation-status" aria-live="polite" className="space-y-4">
          {summary && <p className="text-sm text-danger">{summary}</p>}
          {state.status === "error" && <p className="text-sm text-danger">{state.message}</p>}
          {state.status === "not_configured" && <NotConfiguredNotice what="Zapytanie" />}
        </div>
        <SubmitButton pending={pending} label="Wyślij zapytanie" pendingLabel="Wysyłanie…" />
        <p className="text-xs text-taupe">Wysłanie formularza nie jest rezerwacją. Termin potwierdzi recepcja.</p>
      </div>
    </form>
  );
}
