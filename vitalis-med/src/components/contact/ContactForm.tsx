"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, cloneElement, useCallback, useEffect, useId, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent, type ReactElement } from "react";
import { Icon } from "@/components/ui/Icons";
import { siteConfig } from "@/config/site";
import { findService, services } from "@/data/services";
import {
  LIMITS,
  OTHER_SERVICE,
  emptyContact,
  normalizeContact,
  requiresRoute,
  todayInWarsaw,
  validateContact,
  type ContactErrors,
  type ContactField,
  type ContactInput,
} from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; reference: string }
  | { kind: "error"; message: string; notConfigured?: boolean };

const noopSubscribe = () => () => {};

const FIELD_ORDER: ContactField[] = ["name", "phone", "email", "service", "pickup", "destination", "date", "time", "message", "consent"];

/** Odczytuje ?usluga=... z adresu i wstępnie wybiera usługę (w osobnym Suspense, by formularz renderował się statycznie). */
function ServiceFromUrl({ onService }: { onService: (slug: string) => void }) {
  const params = useSearchParams();
  const slug = params.get("usluga");
  useEffect(() => {
    if (slug && findService(slug)) onService(slug);
  }, [slug, onService]);
  return null;
}

export function ContactForm({ configured }: { configured: boolean }) {
  const uid = useId();
  const [values, setValues] = useState<ContactInput>(emptyContact);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [honeypot, setHoneypot] = useState("");
  const summaryRef = useRef<HTMLDivElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  // Minimalna data w kalendarzu – znana dopiero w przeglądarce (strona jest renderowana statycznie).
  const today = useSyncExternalStore(noopSubscribe, todayInWarsaw, () => undefined);

  const route = requiresRoute(values.service);
  const id = (f: string) => `${uid}-${f}`;

  const setService = useCallback((slug: string) => setValues((v) => (v.service ? v : { ...v, service: slug })), []);

  const update = (field: ContactField) => (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const value = field === "consent" ? (e.target as HTMLInputElement).checked : e.target.value;
    const next = { ...values, [field]: value } as ContactInput;
    setValues(next);
    // Po pierwszej próbie wysłania (lub opuszczeniu pola) aktualizujemy błędy na bieżąco.
    if (touched[field] || errors[field]) {
      const all = validateContact(normalizeContact(next));
      setErrors((prev) => ({ ...prev, [field]: all[field], ...(field === "service" ? { pickup: all.pickup, destination: all.destination } : {}) }));
    }
  };

  const blur = (field: ContactField) => () => {
    setTouched((t) => ({ ...t, [field]: true }));
    const all = validateContact(normalizeContact(values));
    // Pola opcjonalne i puste nie dostają błędu „na wejściu”.
    setErrors((prev) => ({ ...prev, [field]: all[field] }));
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const input = normalizeContact(values);
    const found = validateContact(input);
    setErrors(found);
    setTouched(Object.fromEntries(FIELD_ORDER.map((f) => [f, true])));
    if (Object.keys(found).length > 0) {
      const first = FIELD_ORDER.find((f) => found[f]);
      setStatus({ kind: "idle" });
      requestAnimationFrame(() => {
        summaryRef.current?.focus();
        if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
      return;
    }

    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/kontakt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...input, company_website: honeypot }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; reference?: string; error?: { code?: string; message?: string; fields?: ContactErrors } } | null;
      if (res.ok && data?.ok && data.reference) {
        setStatus({ kind: "success", reference: data.reference });
        setValues(emptyContact);
        setErrors({});
        setTouched({});
      } else if (data?.error?.fields) {
        setErrors(data.error.fields);
        setStatus({ kind: "error", message: data.error.message ?? "Popraw zaznaczone pola formularza." });
      } else {
        setStatus({
          kind: "error",
          notConfigured: data?.error?.code === "NOT_CONFIGURED",
          message: data?.error?.message ?? `Nie udało się wysłać zapytania. Zadzwoń pod numer ${siteConfig.contact.phoneDisplay}.`,
        });
      }
    } catch {
      setStatus({ kind: "error", message: `Brak połączenia z serwerem. Sprawdź internet albo zadzwoń pod numer ${siteConfig.contact.phoneDisplay}.` });
    }
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  const errorList = FIELD_ORDER.filter((f) => errors[f] && touched[f]);
  const showSummary = errorList.length > 0 && Object.keys(touched).length >= FIELD_ORDER.length;

  if (status.kind === "success") {
    return (
      <div ref={resultRef} tabIndex={-1} role="status" className="outline-none">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
          <Icon name="check" size={28} strokeWidth={2} />
        </div>
        <h3 className="mt-6 text-2xl">Dziękujemy – zapytanie zostało wysłane</h3>
        <p className="mt-3 text-body">
          Numer zapytania: <strong className="font-bold text-ink">{status.reference}</strong>. Koordynator skontaktuje się z Tobą telefonicznie, aby
          potwierdzić szczegóły i termin. Zapytanie nie jest jeszcze potwierdzeniem realizacji transportu.
        </p>
        <p className="mt-3 text-body">
          Jeśli sprawa jest pilna, zadzwoń:{" "}
          <a href={siteConfig.contact.phoneHref} className="link-quiet font-bold text-ink">
            {siteConfig.contact.phoneDisplay}
          </a>
          .
        </p>
        <button type="button" className="btn btn-outline mt-8" onClick={() => setStatus({ kind: "idle" })}>
          Wyślij kolejne zapytanie
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${id("intro")}`}>
      <Suspense fallback={null}>
        <ServiceFromUrl onService={setService} />
      </Suspense>

      <p id={id("intro")} className="text-sm text-muted">
        Pola oznaczone <span className="text-red">*</span> są wymagane. Odpowiadamy w godzinach pracy biura, a w pilnych sprawach – zadzwoń.
      </p>

      {!configured && (
        <div className="mt-5 flex gap-3 rounded-[4px] border border-line-strong bg-mist p-4 text-sm text-body">
          <Icon name="info" size={20} className="mt-0.5 shrink-0 text-ink" />
          <p>
            <strong className="font-bold text-ink">Wersja demonstracyjna.</strong> Formularz nie jest jeszcze podłączony do skrzynki odbiorczej – po
            kliknięciu „Wyślij zapytanie” zobaczysz informację, że wiadomość nie została wysłana. Aby zamówić transport, zadzwoń:{" "}
            <a href={siteConfig.contact.phoneHref} className="link-quiet font-bold text-ink">
              {siteConfig.contact.phoneDisplay}
            </a>
            .
          </p>
        </div>
      )}

      {showSummary && (
        <div ref={summaryRef} tabIndex={-1} role="alert" className="mt-5 rounded-[4px] border border-red/40 bg-red-soft p-4 text-sm text-ink outline-none">
          <p className="font-bold">Popraw {errorList.length === 1 ? "zaznaczone pole" : `zaznaczone pola (${errorList.length})`}:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {errorList.map((f) => (
              <li key={f}>
                <a href={`#${id(f)}`} className="link-quiet">
                  {errors[f]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <fieldset className="mt-7">
        <legend className="mb-4 font-display text-lg font-bold text-ink">
          Dane kontaktowe
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("name")} label="Imię i nazwisko" required error={touched.name ? errors.name : undefined} className="sm:col-span-2">
            <input
              name="name"
              type="text"
              autoComplete="name"
              maxLength={LIMITS.name}
              value={values.name}
              onChange={update("name")}
              onBlur={blur("name")}
            />
          </Field>
          <Field id={id("phone")} label="Numer telefonu" required error={touched.phone ? errors.phone : undefined}>
            <input
              name="phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={LIMITS.phone}
              placeholder="np. 500 600 700"
              value={values.phone}
              onChange={update("phone")}
              onBlur={blur("phone")}
            />
          </Field>
          <Field id={id("email")} label="Adres e-mail" required error={touched.email ? errors.email : undefined}>
            <input
              name="email"
              type="email"
              autoComplete="email"
              maxLength={LIMITS.email}
              value={values.email}
              onChange={update("email")}
              onBlur={blur("email")}
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="mt-9">
        <legend className="mb-4 font-display text-lg font-bold text-ink">
          Szczegóły usługi
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field id={id("service")} label="Rodzaj usługi" required error={touched.service ? errors.service : undefined} className="sm:col-span-2">
            <select name="service" value={values.service} onChange={update("service")} onBlur={blur("service")}>
              <option value="">Wybierz usługę…</option>
              {services.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.title}
                </option>
              ))}
              <option value={OTHER_SERVICE}>Inna usługa / pytanie ogólne</option>
            </select>
          </Field>
          <Field
            id={id("pickup")}
            label="Miejsce odbioru pacjenta"
            required={route}
            hint={route ? undefined : "Opcjonalnie – np. miejsce wydarzenia."}
            error={touched.pickup ? errors.pickup : undefined}
          >
            <input
              name="pickup"
              type="text"
              autoComplete="off"
              maxLength={LIMITS.place}
              placeholder="Miejscowość, adres lub placówka"
              value={values.pickup}
              onChange={update("pickup")}
              onBlur={blur("pickup")}
            />
          </Field>
          <Field id={id("destination")} label="Miejsce docelowe" required={route} error={touched.destination ? errors.destination : undefined}>
            <input
              name="destination"
              type="text"
              autoComplete="off"
              maxLength={LIMITS.place}
              placeholder="Miejscowość, adres lub placówka"
              value={values.destination}
              onChange={update("destination")}
              onBlur={blur("destination")}
            />
          </Field>
          <Field id={id("date")} label="Preferowany termin – data" error={touched.date ? errors.date : undefined}>
            <input name="date" type="date" min={today} value={values.date} onChange={update("date")} onBlur={blur("date")} />
          </Field>
          <Field id={id("time")} label="Preferowana godzina" hint="Opcjonalnie." error={touched.time ? errors.time : undefined}>
            <input name="time" type="time" step={900} value={values.time} onChange={update("time")} onBlur={blur("time")} />
          </Field>
          <Field
            id={id("message")}
            label="Dodatkowe informacje"
            hint="Np. czy pacjent może siedzieć, piętro i dostęp do windy, przejazd opiekuna. Nie podawaj tu diagnozy ani szczegółów leczenia – o stanie pacjenta porozmawiamy telefonicznie."
            error={touched.message ? errors.message : undefined}
            className="sm:col-span-2"
          >
            <textarea name="message" rows={5} maxLength={LIMITS.message} value={values.message} onChange={update("message")} onBlur={blur("message")} />
          </Field>
        </div>
      </fieldset>

      {/* Pole-pułapka dla botów – niewidoczne dla użytkowników i czytników ekranu. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Strona firmy
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </label>
      </div>

      <div className="mt-8">
        <div className="flex gap-3">
          <input
            id={id("consent")}
            name="consent"
            type="checkbox"
            checked={values.consent}
            onChange={update("consent")}
            onBlur={blur("consent")}
            aria-invalid={touched.consent && errors.consent ? true : undefined}
            aria-describedby={touched.consent && errors.consent ? `${id("consent")}-error` : undefined}
            className="mt-0.5 h-6 w-6 shrink-0 accent-[var(--color-red)]"
          />
          <label htmlFor={id("consent")} className="text-[0.95rem] leading-relaxed text-body">
            Zapoznałem/-am się z{" "}
            <Link href="/polityka-prywatnosci" className="link-quiet font-bold text-ink" target="_blank">
              Polityką prywatności
            </Link>{" "}
            i akceptuję ją. Rozumiem, że podane dane zostaną wykorzystane do udzielenia odpowiedzi na zapytanie. <span className="text-red">*</span>
          </label>
        </div>
        {touched.consent && errors.consent && (
          <p id={`${id("consent")}-error`} className="field-error ml-8">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary min-w-[14rem]" disabled={status.kind === "submitting"} aria-busy={status.kind === "submitting"}>
          {status.kind === "submitting" ? "Wysyłanie…" : "Wyślij zapytanie"}
        </button>
        <p className="text-sm text-muted">Wysłanie formularza nie jest równoznaczne z potwierdzeniem transportu.</p>
      </div>

      <div ref={resultRef} tabIndex={-1} aria-live="polite" className="outline-none">
        {status.kind === "error" && (
          <div role="alert" className={`mt-6 flex gap-3 rounded-[4px] border p-4 text-[0.95rem] ${status.notConfigured ? "border-line-strong bg-mist" : "border-red/40 bg-red-soft"} text-ink`}>
            <Icon name={status.notConfigured ? "info" : "alert"} size={20} className={`mt-0.5 shrink-0 ${status.notConfigured ? "text-ink" : "text-red"}`} />
            <p>{status.message}</p>
          </div>
        )}
      </div>
    </form>
  );
}

/** Pole formularza: etykieta, kontrolka, podpowiedź i komunikat błędu powiązane atrybutami ARIA. */
function Field({
  id,
  label,
  required,
  hint,
  error,
  className = "",
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  className?: string;
  children: ReactElement<Record<string, unknown>>;
}) {
  const describedBy = [hint ? `${id}-hint` : null, error ? `${id}-error` : null].filter(Boolean).join(" ") || undefined;
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
        {required && (
          <>
            {" "}
            <span className="text-red" aria-hidden="true">
              *
            </span>
            <span className="sr-only">(wymagane)</span>
          </>
        )}
      </label>
      {cloneElement(children, {
        id,
        required,
        "aria-required": required || undefined,
        "aria-invalid": error ? true : undefined,
        "aria-describedby": describedBy,
        className: "field-input",
      })}
      {hint && (
        <p id={`${id}-hint`} className="field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="field-error">
          <Icon name="alert" size={16} className="mt-0.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
