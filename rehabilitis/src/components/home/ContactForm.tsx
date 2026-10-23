"use client";

import Link from "next/link";
import { useId, useRef, useState, useSyncExternalStore } from "react";
import { SERVICES } from "@/data/services";
import {
  CONTACT_METHODS,
  MAX_DAYS_AHEAD,
  MESSAGE_MAX_LENGTH,
  TIME_PREFERENCES,
  addDays,
  todayInWarsaw,
  validateContact,
  type ContactField,
  type ContactMethod,
  type TimePreference,
} from "@/lib/contact";
import { useSelectedService } from "@/lib/inquiry-store";
import { AlertIcon, CheckIcon, InfoIcon } from "@/components/ui/Icons";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "success" } | { kind: "unavailable" | "error"; message: string };

interface FormState {
  name: string;
  contactMethod: ContactMethod | "";
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: TimePreference;
  service: string;
  message: string;
  website: string;
}

const EMPTY: FormState = {
  name: "",
  contactMethod: "",
  phone: "",
  email: "",
  preferredDate: "",
  preferredTime: "any",
  service: "",
  message: "",
  website: "",
};

const subscribeNothing = () => () => {};

/** Kolejność pól – fokus trafia na pierwsze pole z błędem. */
const FIELD_ORDER: ContactField[] = ["name", "contactMethod", "phone", "email", "preferredDate", "preferredTime", "service", "message"];

export function ContactForm({ fallbackContact }: { fallbackContact: string | null }) {
  const uid = useId();
  const id = (field: string) => `${uid}-${field}`;
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<ContactField, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Dzisiejsza data liczona w przeglądarce (strona jest statyczna, więc nie znamy jej podczas budowania).
  const today = useSyncExternalStore(subscribeNothing, todayInWarsaw, () => null);

  // Usługa wybrana przyciskiem „Zapytaj o wizytę”.
  const selected = useSelectedService();
  const [appliedSelection, setAppliedSelection] = useState<number | null>(null);
  if (selected && selected.at !== appliedSelection) {
    setAppliedSelection(selected.at);
    setForm((f) => ({ ...f, service: selected.slug }));
  }

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key as ContactField]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const focusFirstError = (fieldErrors: Partial<Record<ContactField, string>>) => {
    const first = FIELD_ORDER.find((f) => fieldErrors[f]);
    if (!first) return;
    const target = formRef.current?.querySelector<HTMLElement>(`[data-field="${first}"]`);
    target?.focus();
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status.kind === "sending") return;

    const result = validateContact(form, today ?? undefined);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus({ kind: "idle" });
      focusFirstError(result.errors);
      return;
    }

    setErrors({});
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data?.ok === true) {
        setStatus({ kind: "success" });
        setForm(EMPTY);
      } else if (data?.error?.code === "VALIDATION_ERROR" && data.error.fields) {
        setErrors(data.error.fields);
        setStatus({ kind: "idle" });
        focusFirstError(data.error.fields);
        return;
      } else if (data?.error?.code === "CONTACT_NOT_CONFIGURED") {
        setStatus({ kind: "unavailable", message: data.error.message });
      } else {
        setStatus({ kind: "error", message: data?.error?.message ?? "Nie udało się wysłać zgłoszenia. Spróbuj ponownie za chwilę." });
      }
    } catch {
      setStatus({ kind: "error", message: "Brak połączenia z internetem. Sprawdź połączenie i spróbuj ponownie." });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const describedBy = (field: ContactField, hint?: string) => [hint, errors[field] ? id(`${field}-error`) : null].filter(Boolean).join(" ") || undefined;
  const fieldError = (field: ContactField) =>
    errors[field] ? (
      <p id={id(`${field}-error`)} className="field-error">
        {errors[field]}
      </p>
    ) : null;

  if (status.kind === "success") {
    return (
      <div ref={statusRef} tabIndex={-1} role="status" className="rounded-lg border border-success/40 bg-white p-8 outline-none">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-sage text-success">
          <CheckIcon size={24} />
        </span>
        <h3 className="mt-5 text-2xl">Dziękujemy, zgłoszenie dotarło do gabinetu.</h3>
        <p className="mt-3 max-w-lg text-graphite">
          Skontaktujemy się z Tobą wybraną drogą, aby ustalić dogodny termin. To jeszcze nie jest rezerwacja. Termin potwierdzimy
          podczas kontaktu.
        </p>
        <button type="button" className="btn btn-outline mt-8" onClick={() => setStatus({ kind: "idle" })}>
          Wyślij kolejne zgłoszenie
        </button>
      </div>
    );
  }

  const sending = status.kind === "sending";
  const messageLength = form.message.trim().length;

  return (
    <form ref={formRef} onSubmit={submit} noValidate aria-describedby={id("intro")} className="relative mt-4">
      <p id={id("intro")} className="text-[0.95rem] text-muted">
        Wysłanie formularza nie rezerwuje terminu. Odezwiemy się, żeby go razem ustalić. Pola z gwiazdką (*) są wymagane.
      </p>

      <div className="mt-7 grid gap-6">
        {/* Imię */}
        <div>
          <label htmlFor={id("name")} className="field-label">
            Imię *
          </label>
          <input
            id={id("name")}
            data-field="name"
            type="text"
            autoComplete="given-name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describedBy("name")}
            aria-required="true"
            className="field-input"
          />
          {fieldError("name")}
        </div>

        {/* Preferowany sposób kontaktu */}
        <fieldset aria-describedby={describedBy("contactMethod")}>
          <legend className="field-label">Preferowany sposób kontaktu *</legend>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(CONTACT_METHODS) as ContactMethod[]).map((method, i) => (
              <label
                key={method}
                className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-4 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-forest/40 ${
                  form.contactMethod === method ? "border-forest bg-sage/60" : errors.contactMethod ? "border-danger" : "border-[#bfc3bb] bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="contactMethod"
                  value={method}
                  data-field={i === 0 ? "contactMethod" : undefined}
                  checked={form.contactMethod === method}
                  onChange={() => update("contactMethod", method)}
                  className="h-4 w-4 accent-forest"
                />
                <span className="font-medium text-ink">{CONTACT_METHODS[method]}</span>
              </label>
            ))}
          </div>
          {fieldError("contactMethod")}
        </fieldset>

        {form.contactMethod === "phone" && (
          <div>
            <label htmlFor={id("phone")} className="field-label">
              Numer telefonu *
            </label>
            <input
              id={id("phone")}
              data-field="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              placeholder="np. 600 100 200"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              aria-invalid={errors.phone ? true : undefined}
              aria-describedby={describedBy("phone")}
              aria-required="true"
              className="field-input"
            />
            {fieldError("phone")}
          </div>
        )}

        {form.contactMethod === "email" && (
          <div>
            <label htmlFor={id("email")} className="field-label">
              Adres e-mail *
            </label>
            <input
              id={id("email")}
              data-field="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="np. anna@example.com"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              aria-invalid={errors.email ? true : undefined}
              aria-describedby={describedBy("email")}
              aria-required="true"
              className="field-input"
            />
            {fieldError("email")}
          </div>
        )}

        {/* Preferowany termin */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor={id("preferredDate")} className="field-label">
              Preferowany dzień <span className="field-hint">(opcjonalnie)</span>
            </label>
            <input
              id={id("preferredDate")}
              data-field="preferredDate"
              type="date"
              min={today ?? undefined}
              max={today ? addDays(today, MAX_DAYS_AHEAD) : undefined}
              value={form.preferredDate}
              onChange={(e) => update("preferredDate", e.target.value)}
              aria-invalid={errors.preferredDate ? true : undefined}
              aria-describedby={describedBy("preferredDate")}
              className="field-input"
            />
            {fieldError("preferredDate")}
          </div>
          <div>
            <label htmlFor={id("preferredTime")} className="field-label">
              Pora dnia
            </label>
            <select
              id={id("preferredTime")}
              data-field="preferredTime"
              value={form.preferredTime}
              onChange={(e) => update("preferredTime", e.target.value as TimePreference)}
              aria-describedby={describedBy("preferredTime")}
              className="field-input"
            >
              {(Object.keys(TIME_PREFERENCES) as TimePreference[]).map((key) => (
                <option key={key} value={key}>
                  {TIME_PREFERENCES[key]}
                </option>
              ))}
            </select>
            {fieldError("preferredTime")}
          </div>
        </div>

        {/* Usługa */}
        <div>
          <label htmlFor={id("service")} className="field-label">
            Czego dotyczy wizyta? <span className="field-hint">(opcjonalnie)</span>
          </label>
          <select
            id={id("service")}
            data-field="service"
            value={form.service}
            onChange={(e) => update("service", e.target.value)}
            aria-describedby={describedBy("service")}
            className="field-input"
          >
            <option value="">Nie wiem / chcę się skonsultować</option>
            {SERVICES.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.title}
              </option>
            ))}
          </select>
          {fieldError("service")}
        </div>

        {/* Wiadomość */}
        <div>
          <label htmlFor={id("message")} className="field-label">
            Wiadomość <span className="field-hint">(opcjonalnie)</span>
          </label>
          <textarea
            id={id("message")}
            data-field="message"
            rows={4}
            maxLength={MESSAGE_MAX_LENGTH}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            aria-invalid={errors.message ? true : undefined}
            aria-describedby={describedBy("message", id("message-hint"))}
            className="field-input resize-y"
          />
          <p id={id("message-hint")} className="mt-2 flex justify-between gap-4 text-sm text-muted">
            <span>Nie musisz opisywać stanu zdrowia. Porozmawiamy o nim na wizycie.</span>
            <span aria-hidden="true" className="shrink-0 tabular-nums">
              {messageLength}/{MESSAGE_MAX_LENGTH}
            </span>
          </p>
          {fieldError("message")}
        </div>

        {/* Pole-pułapka na boty – niewidoczne i niedostępne dla ludzi */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label htmlFor={id("website")}>Nie wypełniaj tego pola</label>
          <input id={id("website")} type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={(e) => update("website", e.target.value)} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary" disabled={sending} aria-disabled={sending}>
          {sending ? "Wysyłanie…" : "Wyślij prośbę o kontakt"}
        </button>
        <p className="text-sm leading-relaxed text-muted">
          Dane wykorzystamy wyłącznie do odpowiedzi na zgłoszenie.{" "}
          <Link href="/polityka-prywatnosci" className="link">
            Polityka prywatności
          </Link>
        </p>
      </div>

      <div ref={statusRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {(status.kind === "error" || status.kind === "unavailable") && (
          <div
            role="alert"
            className={`mt-6 flex items-start gap-3 rounded-md px-4 py-3 text-[0.95rem] ${
              status.kind === "error" ? "bg-danger/8 text-danger" : "bg-sand text-graphite"
            }`}
          >
            {status.kind === "error" ? <AlertIcon size={20} className="mt-0.5 shrink-0" /> : <InfoIcon size={20} className="mt-0.5 shrink-0 text-moss" />}
            <div>
              <p>{status.message}</p>
              {fallbackContact && <p className="mt-1 font-semibold">{fallbackContact}</p>}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
