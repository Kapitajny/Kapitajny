"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { Alert, ArrowRight, Check } from "@/components/ui/Icons";
import { budgetOptions, serviceOptions, type ServiceValue } from "@/data/offer";
import { LIMITS, validateContact, type ContactErrors, type ContactField } from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "error"; title: string; message: string };

const FIELD_ORDER: ContactField[] = ["name", "company", "email", "phone", "service", "budget", "message", "privacy"];

const FIELD_LABELS: Record<ContactField, string> = {
  name: "Imię i nazwisko",
  company: "Nazwa firmy",
  email: "Adres e-mail",
  phone: "Telefon",
  service: "Usługa",
  budget: "Budżet",
  message: "Opis projektu",
  privacy: "Polityka prywatności",
};

export function ContactForm({
  initialService,
  initialMessage = "",
  reference = "",
  referenceName,
  fallbackEmail,
}: {
  initialService?: ServiceValue;
  initialMessage?: string;
  reference?: string;
  referenceName?: string;
  fallbackEmail?: string | null;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const sendingRef = useRef(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [attempted, setAttempted] = useState(false);
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [messageLength, setMessageLength] = useState(initialMessage.length);

  const read = () => {
    const data = new FormData(formRef.current!);
    return {
      name: String(data.get("name") ?? ""),
      company: String(data.get("company") ?? ""),
      email: String(data.get("email") ?? ""),
      phone: String(data.get("phone") ?? ""),
      service: String(data.get("service") ?? ""),
      budget: String(data.get("budget") ?? ""),
      message: String(data.get("message") ?? ""),
      privacy: data.get("privacy") === "on",
      reference: String(data.get("reference") ?? ""),
      website: String(data.get("website") ?? ""),
    };
  };

  /** Po pierwszej próbie wysłania błędy aktualizują się na bieżąco, pole po polu. */
  const revalidate = (field: ContactField) => {
    if (!attempted) return;
    const result = validateContact(read());
    setErrors((current) => {
      const next = { ...current };
      const message = result.ok ? undefined : result.errors[field];
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const focusField = (field: ContactField) => {
    const element = formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`);
    element?.focus();
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (sendingRef.current) return; // blokada podwójnego wysłania
    setAttempted(true);

    const raw = read();
    const result = validateContact(raw);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus({ kind: "idle" });
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }

    setErrors({});
    sendingRef.current = true;
    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...result.data, website: raw.website }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: { code?: string; message?: string; fields?: ContactErrors } };

      if (response.ok) {
        formRef.current?.reset();
        setMessageLength(0);
        setAttempted(false);
        setStatus({ kind: "sent" });
        requestAnimationFrame(() => resultRef.current?.focus());
        return;
      }

      if (response.status === 422 && data.error?.fields) {
        setErrors(data.error.fields);
        setStatus({ kind: "idle" });
        requestAnimationFrame(() => summaryRef.current?.focus());
        return;
      }

      const notConfigured = data.error?.code === "FORM_NOT_CONFIGURED";
      setStatus({
        kind: "error",
        title: notConfigured ? "Wiadomość nie została wysłana" : "Nie udało się wysłać wiadomości",
        message: data.error?.message ?? "Spróbuj ponownie za kilka minut.",
      });
    } catch {
      setStatus({
        kind: "error",
        title: "Nie udało się wysłać wiadomości",
        message: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie – wpisane dane zostały w formularzu.",
      });
    } finally {
      sendingRef.current = false;
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  };

  const errorList = FIELD_ORDER.filter((field) => errors[field]);
  const sending = status.kind === "sending";
  const describe = (field: ContactField, hint?: string) => [hint, errors[field] ? `${field}-error` : null].filter(Boolean).join(" ") || undefined;

  if (status.kind === "sent") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="card p-8 outline-none sm:p-10">
        <span className="grid size-12 place-items-center rounded-full bg-ink text-white">
          <Check className="size-5" />
        </span>
        <h2 className="mt-6 text-[1.6rem] tracking-[-0.03em]">Dziękujemy, wiadomość została wysłana</h2>
        <p className="mt-3 text-steel">
          Otrzymaliśmy Twoje zapytanie. Odpowiemy na podany adres e-mail z propozycją dalszych kroków. Wysłanie wiadomości nie jest zawarciem umowy.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" className="btn btn-secondary" onClick={() => setStatus({ kind: "idle" })}>
            Wyślij kolejne zapytanie
          </button>
          <Link href="/realizacje" className="btn btn-primary">
            Zobacz realizacje
            <ArrowRight />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} noValidate className="card relative p-6 sm:p-9" aria-describedby="form-info">
      <p id="form-info" className="text-[0.9rem] text-steel">
        Pola oznaczone <span aria-hidden="true">*</span>
        <span className="sr-only">gwiazdką</span> są wymagane.
      </p>

      {errorList.length > 0 && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-6 rounded-xl border border-danger/40 bg-[#fdf0ee] p-5 outline-none">
          <p className="flex items-center gap-2 font-semibold text-danger">
            <Alert className="size-4" />
            {errorList.length === 1 ? "Popraw 1 pole formularza" : `Popraw pola formularza (${errorList.length})`}
          </p>
          <ul className="mt-3 space-y-1 text-[0.95rem]">
            {errorList.map((field) => (
              <li key={field}>
                <a
                  href={`#f-${field}`}
                  className="link text-ink"
                  onClick={(event) => {
                    event.preventDefault();
                    focusField(field);
                  }}
                >
                  {FIELD_LABELS[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {referenceName && (
        <p className="mt-6 flex items-center gap-3 rounded-xl bg-paper px-4 py-3 text-[0.95rem]">
          <span className="size-2 shrink-0 rounded-[1px] bg-gold" aria-hidden="true" />
          Inspiracja z portfolio: <strong className="font-semibold">{referenceName}</strong>
        </p>
      )}
      <input type="hidden" name="reference" value={reference} />

      <div className="mt-7 grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="f-name" className="field-label">
            Imię i nazwisko <span aria-hidden="true">*</span>
          </label>
          <input
            id="f-name"
            name="name"
            className="field"
            autoComplete="name"
            required
            maxLength={LIMITS.name}
            aria-invalid={errors.name ? true : undefined}
            aria-describedby={describe("name")}
            onBlur={() => revalidate("name")}
            onChange={() => errors.name && revalidate("name")}
          />
          {errors.name && (
            <p id="name-error" className="field-error">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="f-company" className="field-label">
            Nazwa firmy <span className="font-normal text-steel">(opcjonalnie)</span>
          </label>
          <input
            id="f-company"
            name="company"
            className="field"
            autoComplete="organization"
            maxLength={LIMITS.company}
            aria-invalid={errors.company ? true : undefined}
            aria-describedby={describe("company")}
            onBlur={() => revalidate("company")}
          />
          {errors.company && (
            <p id="company-error" className="field-error">
              {errors.company}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="f-email" className="field-label">
            Adres e-mail <span aria-hidden="true">*</span>
          </label>
          <input
            id="f-email"
            name="email"
            type="email"
            inputMode="email"
            className="field"
            autoComplete="email"
            required
            maxLength={LIMITS.email}
            aria-invalid={errors.email ? true : undefined}
            aria-describedby={describe("email")}
            onBlur={() => revalidate("email")}
            onChange={() => errors.email && revalidate("email")}
          />
          {errors.email && (
            <p id="email-error" className="field-error">
              {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="f-phone" className="field-label">
            Telefon <span className="font-normal text-steel">(opcjonalnie)</span>
          </label>
          <input
            id="f-phone"
            name="phone"
            type="tel"
            inputMode="tel"
            className="field"
            autoComplete="tel"
            maxLength={LIMITS.phone}
            aria-invalid={errors.phone ? true : undefined}
            aria-describedby={describe("phone")}
            onBlur={() => revalidate("phone")}
            onChange={() => errors.phone && revalidate("phone")}
          />
          {errors.phone && (
            <p id="phone-error" className="field-error">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <fieldset className="mt-7" aria-describedby={errors.service ? "service-error" : undefined}>
        <legend className="field-label">
          Czego dotyczy zapytanie? <span aria-hidden="true">*</span>
        </legend>
        <div className="mt-2 grid gap-3 sm:grid-cols-3">
          {serviceOptions.map((option) => (
            <label key={option.value} className="choice">
              <input
                type="radio"
                name="service"
                value={option.value}
                defaultChecked={option.value === initialService}
                required
                onChange={() => revalidate("service")}
              />
              {option.label}
            </label>
          ))}
        </div>
        {errors.service && (
          <p id="service-error" className="field-error">
            {errors.service}
          </p>
        )}
      </fieldset>

      <div className="mt-7">
        <label htmlFor="f-budget" className="field-label">
          Budżet <span className="font-normal text-steel">(opcjonalnie)</span>
        </label>
        <select
          id="f-budget"
          name="budget"
          className="field"
          defaultValue=""
          aria-invalid={errors.budget ? true : undefined}
          aria-describedby={describe("budget")}
          onChange={() => revalidate("budget")}
        >
          <option value="">Wybierz przybliżony budżet</option>
          {budgetOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.budget && (
          <p id="budget-error" className="field-error">
            {errors.budget}
          </p>
        )}
      </div>

      <div className="mt-7">
        <label htmlFor="f-message" className="field-label">
          Opowiedz nam o swoim projekcie. Jakiej strony internetowej lub sklepu potrzebujesz? <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="f-message"
          name="message"
          className="field"
          rows={6}
          required
          maxLength={LIMITS.message}
          defaultValue={initialMessage}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describe("message", "message-hint")}
          onBlur={() => revalidate("message")}
          onChange={(event) => {
            setMessageLength(event.target.value.length);
            if (errors.message) revalidate("message");
          }}
        />
        <div className="flex justify-between gap-4">
          {errors.message ? (
            <p id="message-error" className="field-error">
              {errors.message}
            </p>
          ) : (
            <p id="message-hint" className="field-hint">
              Np. czym zajmuje się firma, jakie podstrony lub funkcje są potrzebne, czy masz teksty i zdjęcia.
            </p>
          )}
          <p className="field-hint shrink-0 tabular-nums" aria-hidden="true">
            {messageLength}/{LIMITS.message}
          </p>
        </div>
      </div>

      {/* Pole-pułapka dla botów – ukryte przed ludźmi i czytnikami ekranu */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="f-website">Strona WWW</label>
        <input id="f-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-7">
        <label className="flex gap-3 text-[0.95rem] leading-relaxed">
          <input
            type="checkbox"
            name="privacy"
            required
            className="mt-0.5 size-5 shrink-0 accent-ink"
            aria-invalid={errors.privacy ? true : undefined}
            aria-describedby={errors.privacy ? "privacy-error" : undefined}
            onChange={() => revalidate("privacy")}
          />
          <span>
            Zapoznałem(-am) się z{" "}
            <Link href="/polityka-prywatnosci" target="_blank" className="link font-medium">
              polityką prywatności
              <span className="sr-only"> (otwiera się w nowej karcie)</span>
            </Link>{" "}
            i wiem, w jakim celu przetwarzane będą moje dane. <span aria-hidden="true">*</span>
          </span>
        </label>
        {errors.privacy && (
          <p id="privacy-error" className="field-error pl-8">
            {errors.privacy}
          </p>
        )}
      </div>

      {status.kind === "error" && (
        <div ref={resultRef} tabIndex={-1} role="alert" className="mt-7 rounded-xl border border-danger/40 bg-[#fdf0ee] p-5 outline-none">
          <p className="flex items-center gap-2 font-semibold text-danger">
            <Alert className="size-4" />
            {status.title}
          </p>
          <p className="mt-2 text-[0.95rem]">{status.message}</p>
          {fallbackEmail && (
            <p className="mt-2 text-[0.95rem]">
              Możesz też napisać bezpośrednio na{" "}
              <a href={`mailto:${fallbackEmail}`} className="link font-medium">
                {fallbackEmail}
              </a>
              .
            </p>
          )}
        </div>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={sending} aria-disabled={sending}>
          {sending ? (
            <>
              <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white motion-reduce:animate-none" aria-hidden="true" />
              Wysyłanie…
            </>
          ) : (
            <>
              Wyślij wiadomość
              <ArrowRight />
            </>
          )}
        </button>
        <p className="text-[0.875rem] text-steel">Odpowiadamy na adres e-mail podany w formularzu.</p>
      </div>
      <p className="sr-only" role="status" aria-live="polite">
        {sending ? "Wysyłanie wiadomości…" : ""}
      </p>
    </form>
  );
}
