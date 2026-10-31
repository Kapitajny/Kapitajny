"use client";

import { Check } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { type FormEvent, type ReactNode, useId, useRef, useState } from "react";

import { site } from "@/data/site";
import { type ContactData, type ContactErrors, fields, propertyTypes, scopes, validate, validateField } from "@/lib/contact";

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "sent" }
  | { kind: "not_configured" }
  | { kind: "error"; message: string };

const empty: ContactData = { name: "", email: "", phone: "", propertyType: "", area: "", scope: "", message: "", consent: false, website: "" };

const inputCls =
  "peer w-full rounded-none border-0 border-b border-graphite/25 bg-transparent px-0 pt-7 pb-3 text-[1.0625rem] text-graphite outline-none transition-colors duration-300 placeholder:text-transparent focus:border-graphite aria-[invalid=true]:border-danger";

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <label htmlFor={id} className="t-meta pointer-events-none absolute top-0 left-0 text-stone">
        {label}
      </label>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] text-stone">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.8125rem] text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export function ContactForm() {
  const params = useSearchParams();
  const initialScope = scopes.some((s) => s.value === params.get("zakres")) ? (params.get("zakres") as string) : "";
  const [data, setData] = useState<ContactData>({ ...empty, scope: initialScope });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof ContactData, boolean>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const uid = useId();
  const id = (f: string) => `${uid}-${f}`;

  const set = <K extends keyof ContactData>(k: K, v: ContactData[K]) => {
    const next = { ...data, [k]: v };
    setData(next);
    if (touched[k] || errors[k]) setErrors((e) => ({ ...e, [k]: validateField(k, next) }));
  };
  const blur = (k: keyof ContactData) => {
    setTouched((t) => ({ ...t, [k]: true }));
    setErrors((e) => ({ ...e, [k]: validateField(k, data) }));
  };
  const describedBy = (k: keyof ContactData, hint = false) =>
    errors[k] ? `${id(k)}-error` : hint ? `${id(k)}-hint` : undefined;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate(data);
    setErrors(errs);
    setTouched(Object.fromEntries(fields.map((f) => [f, true])));
    const first = fields.find((f) => errs[f]);
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`);
      el?.focus();
      setStatus({ kind: "error", message: "Formularz zawiera błędy. Popraw zaznaczone pola i wyślij ponownie." });
      return;
    }
    setStatus({ kind: "sending" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string; errors?: ContactErrors };
      if (res.ok && json.ok) {
        setStatus({ kind: "sent" });
        setData({ ...empty });
        setTouched({});
      } else if (json.reason === "not_configured") {
        setStatus({ kind: "not_configured" });
      } else if (json.reason === "invalid" && json.errors) {
        setErrors(json.errors);
        setStatus({ kind: "error", message: "Serwer odrzucił część danych. Popraw zaznaczone pola." });
      } else {
        setStatus({ kind: "error", message: `Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz na ${site.contact.email}.` });
      }
    } catch {
      setStatus({ kind: "error", message: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie." });
    }
  }

  const mailto = () => {
    const scope = scopes.find((s) => s.value === data.scope)?.label ?? "";
    const body = [
      `Imię i nazwisko: ${data.name}`,
      `Telefon: ${data.phone || "—"}`,
      `Rodzaj nieruchomości: ${data.propertyType}`,
      `Metraż: ${data.area} m²`,
      `Zakres współpracy: ${scope}`,
      "",
      data.message,
    ].join("\n");
    return `mailto:${site.contact.email}?subject=${encodeURIComponent("Zapytanie o projekt wnętrza")}&body=${encodeURIComponent(body)}`;
  };

  if (status.kind === "sent") {
    return (
      <div role="status" className="border-t border-graphite pt-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-graphite text-paper">
          <Check size={18} strokeWidth={1.5} aria-hidden="true" />
        </span>
        <h2 className="t-h3 mt-8">Dziękujemy, wiadomość została wysłana.</h2>
        <p className="t-body mt-4 max-w-[30rem]">Odpowiemy w ciągu dwóch dni roboczych i zaproponujemy termin pierwszej rozmowy.</p>
        <button type="button" className="btn btn-dark mt-10" onClick={() => setStatus({ kind: "idle" })}>
          Wyślij kolejne zapytanie
        </button>
      </div>
    );
  }

  return (
    <form ref={formRef} noValidate onSubmit={onSubmit} aria-describedby={`${uid}-status`} className="grid gap-x-10 gap-y-10 md:grid-cols-2">
      <Field id={id("name")} label="Imię i nazwisko" error={errors.name}>
        <input
          id={id("name")}
          name="name"
          autoComplete="name"
          required
          value={data.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => blur("name")}
          aria-invalid={!!errors.name}
          aria-describedby={describedBy("name")}
          className={inputCls}
        />
      </Field>
      <Field id={id("email")} label="Adres e-mail" error={errors.email}>
        <input
          id={id("email")}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => blur("email")}
          aria-invalid={!!errors.email}
          aria-describedby={describedBy("email")}
          className={inputCls}
        />
      </Field>
      <Field id={id("phone")} label="Telefon (opcjonalnie)" hint="Zadzwonimy tylko, jeśli o to poprosisz." error={errors.phone}>
        <input
          id={id("phone")}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => set("phone", e.target.value)}
          onBlur={() => blur("phone")}
          aria-invalid={!!errors.phone}
          aria-describedby={describedBy("phone", true)}
          className={inputCls}
        />
      </Field>
      <div className="grid grid-cols-[1.4fr_1fr] gap-x-6">
        <Field id={id("propertyType")} label="Rodzaj nieruchomości" error={errors.propertyType}>
          <select
            id={id("propertyType")}
            name="propertyType"
            required
            value={data.propertyType}
            onChange={(e) => set("propertyType", e.target.value)}
            onBlur={() => blur("propertyType")}
            aria-invalid={!!errors.propertyType}
            aria-describedby={describedBy("propertyType")}
            className={`${inputCls} select-arrow cursor-pointer appearance-none pr-6`}
          >
            <option value="" disabled>
              Wybierz
            </option>
            {propertyTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field id={id("area")} label="Metraż (m²)" error={errors.area}>
          <input
            id={id("area")}
            name="area"
            inputMode="decimal"
            required
            value={data.area}
            onChange={(e) => set("area", e.target.value)}
            onBlur={() => blur("area")}
            aria-invalid={!!errors.area}
            aria-describedby={describedBy("area")}
            className={inputCls}
          />
        </Field>
      </div>

      <fieldset
        className="md:col-span-2"
        aria-invalid={!!errors.scope}
        aria-describedby={errors.scope ? `${id("scope")}-error` : undefined}
      >
        <legend className="t-meta text-stone">Zakres współpracy</legend>
        <div className="mt-5 flex flex-wrap gap-3">
          {scopes.map((s) => (
            <label key={s.value} className="cursor-pointer">
              <input
                type="radio"
                name="scope"
                value={s.value}
                checked={data.scope === s.value}
                onChange={() => {
                  set("scope", s.value);
                  setErrors((e) => ({ ...e, scope: undefined }));
                }}
                className="peer sr-only"
              />
              <span className="inline-flex min-h-11 items-center rounded-full border border-graphite/25 px-5 text-[0.9375rem] transition-colors duration-300 peer-checked:border-graphite peer-checked:bg-graphite peer-checked:text-paper peer-focus-visible:outline peer-focus-visible:outline-1 peer-focus-visible:outline-offset-4 hover:border-graphite">
                {s.label}
              </span>
            </label>
          ))}
        </div>
        {errors.scope && (
          <p id={`${id("scope")}-error`} className="mt-3 text-[0.8125rem] text-danger">
            {errors.scope}
          </p>
        )}
      </fieldset>

      <div className="md:col-span-2">
        <Field id={id("message")} label="Opis projektu" hint="Na przykład: lokalizacja, etap inwestycji, termin, czego potrzebujesz." error={errors.message}>
          <textarea
            id={id("message")}
            name="message"
            required
            rows={5}
            value={data.message}
            onChange={(e) => set("message", e.target.value)}
            onBlur={() => blur("message")}
            aria-invalid={!!errors.message}
            aria-describedby={describedBy("message", true)}
            className={`${inputCls} resize-y`}
          />
        </Field>
      </div>

      {/* pole-pułapka: ukryte przed ludźmi i czytnikami ekranu */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Strona www
          <input tabIndex={-1} autoComplete="off" name="website" value={data.website} onChange={(e) => set("website", e.target.value)} />
        </label>
      </div>

      <div className="md:col-span-2">
        <label className="flex cursor-pointer items-start gap-4">
          <input
            type="checkbox"
            name="consent"
            checked={data.consent}
            onChange={(e) => set("consent", e.target.checked)}
            aria-invalid={!!errors.consent}
            aria-describedby={errors.consent ? `${id("consent")}-error` : undefined}
            className="check-mark mt-1 h-5 w-5 shrink-0 cursor-pointer appearance-none rounded-none border border-graphite/40 bg-transparent transition-colors checked:border-graphite checked:bg-graphite aria-[invalid=true]:border-danger"
          />
          <span className="text-[0.9375rem] leading-relaxed text-stone">
            Wyrażam zgodę na przetwarzanie moich danych osobowych przez FORMA ATELIER w celu odpowiedzi na zapytanie i przygotowania
            oferty. Szczegóły w{" "}
            <Link href="/polityka-prywatnosci" className="text-graphite underline underline-offset-4">
              polityce prywatności
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p id={`${id("consent")}-error`} className="mt-2 pl-9 text-[0.8125rem] text-danger">
            {errors.consent}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-6 md:col-span-2 md:flex-row md:items-center">
        <button type="submit" className="btn btn-solid min-h-14 px-10" disabled={status.kind === "sending"}>
          {status.kind === "sending" ? "Wysyłanie…" : "Wyślij zapytanie"}
        </button>
        <div id={`${uid}-status`} aria-live="polite" className="text-[0.9375rem]">
          {status.kind === "error" && <p className="text-danger">{status.message}</p>}
          {status.kind === "not_configured" && (
            <div role="alert" className="max-w-[34rem] border-l-2 border-olive pl-4 text-stone">
              <p className="text-graphite">Wiadomość nie została wysłana.</p>
              <p className="mt-1">
                Formularz nie jest jeszcze połączony ze skrzynką pracowni (wersja demonstracyjna). Twoje dane nie zostały nigdzie
                zapisane.{" "}
                <a href={mailto()} className="text-graphite underline underline-offset-4">
                  Otwórz gotową wiadomość e-mail
                </a>
                .
              </p>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
