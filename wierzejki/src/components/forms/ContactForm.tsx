"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  BUSINESS_TYPES,
  CONSENT_TEXT,
  CONTACT_TOPICS,
  INTERESTS,
  LIMITS,
  getTopic,
  isB2BTopic,
  validateContact,
  type ContactErrors,
  type ContactPayload,
  type ContactTopicId,
} from "@/lib/contact";
import { CheckIcon, InfoIcon } from "@/components/ui/Icons";

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "error"; message: string; notConfigured?: boolean };

interface ContactFormProps {
  variant: "general" | "b2b";
  /** Czy serwer ma skonfigurowany kanał wysyłki (ustalane po stronie serwera). */
  configured: boolean;
  defaultTopic?: ContactTopicId;
  /** Kontakt pokazywany, gdy formularz nie może wysłać wiadomości. */
  fallback: ReactNode;
}

const FIELD_ORDER: (keyof ContactPayload)[] = ["topic", "company", "businessType", "nip", "region", "name", "email", "phone", "message", "consent"];

function emptyPayload(topic: ContactTopicId): ContactPayload {
  return { topic, name: "", email: "", phone: "", message: "", consent: false, company: "", nip: "", businessType: "", region: "", interests: [], website: "" };
}

export function ContactForm({ variant, configured, defaultTopic, fallback }: ContactFormProps) {
  const topics = variant === "b2b" ? CONTACT_TOPICS.filter((t) => t.b2b) : CONTACT_TOPICS;
  const initialTopic = defaultTopic ?? topics[0].id;
  const [data, setData] = useState<ContactPayload>(() => emptyPayload(initialTopic));
  const [errors, setErrors] = useState<ContactErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (name: string) => `${uid}-${name}`;

  const b2b = isB2BTopic(data.topic);
  const topic = getTopic(data.topic);

  function set<K extends keyof ContactPayload>(key: K, value: ContactPayload[K]) {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function focusFirstError(found: ContactErrors) {
    const first = FIELD_ORDER.find((k) => found[k]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    const found = validateContact(data);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      setStatus({ kind: "idle" });
      focusFirstError(found);
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const response = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = (await response.json().catch(() => ({}))) as { ok?: boolean; error?: { code: string; message: string; fields?: ContactErrors } };
      if (response.ok && result.ok) {
        setStatus({ kind: "sent" });
        setData(emptyPayload(initialTopic));
        return;
      }
      if (result.error?.fields) {
        setErrors(result.error.fields);
        focusFirstError(result.error.fields);
      }
      setStatus({
        kind: "error",
        message: result.error?.message ?? "Nie udało się wysłać wiadomości. Spróbuj ponownie.",
        notConfigured: result.error?.code === "CONTACT_NOT_CONFIGURED",
      });
    } catch {
      setStatus({ kind: "error", message: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie." });
    }
  }

  if (status.kind === "sent") {
    return (
      <div role="status" className="border border-success/40 bg-surface p-8">
        <CheckIcon size={32} className="text-success" />
        <p className="display-md mt-4">Wiadomość wysłana</p>
        <p className="mt-3 max-w-[32rem] text-muted">Trafiła do: {topic?.department ?? "sekretariatu"}. Odpowiemy na podany adres e-mail.</p>
        <button type="button" className="btn btn-outline mt-6" onClick={() => setStatus({ kind: "idle" })}>
          Napisz kolejną wiadomość
        </button>
      </div>
    );
  }

  const errorCount = Object.values(errors).filter(Boolean).length;
  const describedBy = (name: keyof ContactPayload, hint?: boolean) =>
    [hint ? id(`${name}-hint`) : null, errors[name] ? id(`${name}-error`) : null].filter(Boolean).join(" ") || undefined;
  const fieldError = (name: keyof ContactPayload) =>
    errors[name] ? (
      <p id={id(`${name}-error`)} className="field-error">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} className="space-y-6" aria-describedby={!configured ? id("demo") : undefined}>
      {!configured && (
        <p id={id("demo")} className="ui flex items-start gap-3 border-l-2 border-red bg-surface px-4 py-3 text-[0.875rem] leading-relaxed">
          <InfoIcon size={18} className="mt-0.5 shrink-0 text-red" />
          <span>
            <strong className="font-semibold">Tryb demonstracyjny.</strong> Formularz sprawdza dane, ale nie wysyła wiadomości, dopóki firma
            nie podłączy skrzynki pocztowej. Zadzwoń lub napisz bezpośrednio na adres działu.
          </span>
        </p>
      )}

      <div aria-live="assertive" className="empty:hidden">
        {errorCount > 0 && (
          <p className="ui border border-danger/40 bg-surface px-4 py-3 text-[0.9rem] font-medium text-danger">
            Popraw zaznaczone pola ({errorCount}).
          </p>
        )}
      </div>

      <div>
        <label htmlFor={id("topic")} className="field-label">
          Temat
        </label>
        <select
          id={id("topic")}
          name="topic"
          value={data.topic}
          onChange={(e) => set("topic", e.target.value as ContactTopicId)}
          className="field-input"
          aria-invalid={!!errors.topic}
          aria-describedby={describedBy("topic", true)}
        >
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <p id={id("topic-hint")} className="field-hint">
          Wiadomość trafi do: {topic?.department}
        </p>
        {fieldError("topic")}
      </div>

      {b2b && (
        <fieldset className="border-t border-line pt-6">
          <legend className="display-sm mb-5 text-[1.2rem]">Dane firmy</legend>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor={id("company")} className="field-label">
                Nazwa firmy lub instytucji
              </label>
              <input
                id={id("company")}
                name="company"
                value={data.company}
                onChange={(e) => set("company", e.target.value)}
                className="field-input"
                autoComplete="organization"
                maxLength={LIMITS.company}
                aria-invalid={!!errors.company}
                aria-describedby={describedBy("company")}
              />
              {fieldError("company")}
            </div>
            <div>
              <label htmlFor={id("businessType")} className="field-label">
                Rodzaj działalności
              </label>
              <select
                id={id("businessType")}
                name="businessType"
                value={data.businessType}
                onChange={(e) => set("businessType", e.target.value)}
                className="field-input"
                aria-invalid={!!errors.businessType}
                aria-describedby={describedBy("businessType")}
              >
                <option value="">Wybierz…</option>
                {BUSINESS_TYPES.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              {fieldError("businessType")}
            </div>
            <div>
              <label htmlFor={id("nip")} className="field-label">
                NIP <span className="font-normal text-muted">(opcjonalnie)</span>
              </label>
              <input
                id={id("nip")}
                name="nip"
                value={data.nip}
                onChange={(e) => set("nip", e.target.value)}
                className="field-input"
                inputMode="numeric"
                maxLength={13}
                aria-invalid={!!errors.nip}
                aria-describedby={describedBy("nip")}
              />
              {fieldError("nip")}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={id("region")} className="field-label">
                Miejscowość lub region dostaw <span className="font-normal text-muted">(opcjonalnie)</span>
              </label>
              <input
                id={id("region")}
                name="region"
                value={data.region}
                onChange={(e) => set("region", e.target.value)}
                className="field-input"
                maxLength={LIMITS.region}
                aria-invalid={!!errors.region}
                aria-describedby={describedBy("region", true)}
              />
              <p id={id("region-hint")} className="field-hint">
                Własny transport obsługuje województwa lubelskie i mazowieckie.
              </p>
              {fieldError("region")}
            </div>
          </div>
          <fieldset className="mt-6">
            <legend className="field-label">Interesujący asortyment</legend>
            <div className="ui flex flex-wrap gap-x-6 gap-y-2">
              {INTERESTS.map((interest) => (
                <label key={interest} className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[0.9375rem]">
                  <input
                    type="checkbox"
                    name="interests"
                    checked={data.interests.includes(interest)}
                    onChange={(e) =>
                      set("interests", e.target.checked ? [...data.interests, interest] : data.interests.filter((i) => i !== interest))
                    }
                    className="h-5 w-5 accent-[var(--color-red)]"
                  />
                  {interest}
                </label>
              ))}
            </div>
          </fieldset>
        </fieldset>
      )}

      <div className={`grid gap-6 sm:grid-cols-2 ${b2b ? "border-t border-line pt-6" : ""}`}>
        <div className="sm:col-span-2">
          <label htmlFor={id("name")} className="field-label">
            {b2b ? "Osoba kontaktowa" : "Imię i nazwisko"}
          </label>
          <input
            id={id("name")}
            name="name"
            value={data.name}
            onChange={(e) => set("name", e.target.value)}
            className="field-input"
            autoComplete="name"
            maxLength={LIMITS.name}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
          />
          {fieldError("name")}
        </div>
        <div>
          <label htmlFor={id("email")} className="field-label">
            E-mail
          </label>
          <input
            id={id("email")}
            name="email"
            type="email"
            value={data.email}
            onChange={(e) => set("email", e.target.value)}
            className="field-input"
            autoComplete="email"
            maxLength={LIMITS.email}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
          />
          {fieldError("email")}
        </div>
        <div>
          <label htmlFor={id("phone")} className="field-label">
            Telefon <span className="font-normal text-muted">(opcjonalnie)</span>
          </label>
          <input
            id={id("phone")}
            name="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => set("phone", e.target.value)}
            className="field-input"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            aria-invalid={!!errors.phone}
            aria-describedby={describedBy("phone")}
          />
          {fieldError("phone")}
        </div>
        <div className="sm:col-span-2">
          <label htmlFor={id("message")} className="field-label">
            Wiadomość
          </label>
          <textarea
            id={id("message")}
            name="message"
            value={data.message}
            onChange={(e) => set("message", e.target.value)}
            className="field-input"
            maxLength={LIMITS.message}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message", true)}
            rows={6}
          />
          <p id={id("message-hint")} className="field-hint">
            {b2b ? "Napisz, jakich produktów potrzebujesz, w jakich ilościach i jak często." : "Opisz krótko sprawę."}
          </p>
          {fieldError("message")}
        </div>
      </div>

      {/* Pułapka na boty – ukryta przed ludźmi i czytnikami ekranu. */}
      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <label htmlFor={id("website")}>Strona internetowa</label>
        <input id={id("website")} name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={(e) => set("website", e.target.value)} />
      </div>

      <div>
        <label className="ui flex cursor-pointer items-start gap-3 text-[0.875rem] leading-relaxed">
          <input
            type="checkbox"
            name="consent"
            checked={data.consent}
            onChange={(e) => set("consent", e.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--color-red)]"
            aria-invalid={!!errors.consent}
            aria-describedby={describedBy("consent")}
          />
          <span>
            {CONSENT_TEXT} Szczegóły w{" "}
            <Link href="/polityka-prywatnosci" className="link font-semibold">
              polityce prywatności
            </Link>
            .
          </span>
        </label>
        {fieldError("consent")}
      </div>

      {status.kind === "error" && (
        <div role="alert" className="ui border border-danger/40 bg-surface px-4 py-4 text-[0.9375rem]">
          <p className="font-semibold text-danger">{status.message}</p>
          {status.notConfigured && <div className="mt-3 text-ink">{fallback}</div>}
        </div>
      )}

      <button type="submit" className="btn btn-red w-full sm:w-auto" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Wysyłanie…" : b2b ? "Wyślij zapytanie handlowe" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
