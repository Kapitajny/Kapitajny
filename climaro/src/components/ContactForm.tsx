"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { services } from "@/data/services";
import { site } from "@/data/site";
import styles from "./ContactForm.module.css";

type FieldName = "name" | "phone" | "email" | "service" | "message" | "consent";
type Values = Record<Exclude<FieldName, "consent">, string> & { consent: boolean };
type Errors = Partial<Record<FieldName, string>>;

const OTHER = "inne";
const serviceOptions = [...services.map((s) => ({ value: s.slug, label: s.name })), { value: OTHER, label: "Inne / nie wiem, co wybrać" }];

const order: FieldName[] = ["name", "phone", "email", "service", "message", "consent"];

const labels: Record<FieldName, string> = {
  name: "Imię i nazwisko",
  phone: "Numer telefonu",
  email: "Adres e-mail",
  service: "Usługa",
  message: "Opis zapytania",
  consent: "Zgoda na przetwarzanie danych",
};

function validate(field: FieldName, values: Values): string | undefined {
  switch (field) {
    case "name":
      return values.name.trim().length < 3 ? "Wpisz imię i nazwisko." : undefined;
    case "phone": {
      const digits = values.phone.replace(/[\s()-]/g, "");
      if (!digits) return "Wpisz numer telefonu.";
      return /^(\+?48)?\d{9}$/.test(digits) ? undefined : "Wpisz 9-cyfrowy numer telefonu, np. 517 734 221.";
    }
    case "email":
      if (!values.email.trim()) return "Wpisz adres e-mail.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim()) ? undefined : "Wpisz adres e-mail w formacie nazwa@domena.pl.";
    case "service":
      return values.service ? undefined : "Wybierz usługę, której dotyczy zapytanie.";
    case "message":
      return values.message.trim().length < 20 ? "Opisz zapytanie w kilku zdaniach (co najmniej 20 znaków)." : undefined;
    case "consent":
      return values.consent ? undefined : "Zaznacz zgodę, abyśmy mogli odpowiedzieć na zapytanie.";
  }
}

// „1 pole”, „2 pola”, „5 pól” – polskie formy liczby mnogiej.
const plural = new Intl.PluralRules("pl-PL");
const fieldForms: Partial<Record<Intl.LDMLPluralRule, string>> = { one: "pole", few: "pola", many: "pól" };
const fieldWord = (count: number) => fieldForms[plural.select(count)] ?? "pól";

const initial: Values ={ name: "", phone: "", email: "", service: "", message: "", consent: false };

export function ContactForm() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [summary, setSummary] = useState<FieldName[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Wybór usługi przekazany z cennika (?usluga=klimatyzacja).
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("usluga");
    if (slug && serviceOptions.some((option) => option.value === slug)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- jednorazowe odczytanie adresu po stronie klienta
      setValues((v) => ({ ...v, service: slug }));
    }
  }, []);

  const update = <K extends FieldName>(field: K, value: Values[K]) => {
    const next = { ...values, [field]: value };
    setValues(next);
    setSubmitted(false);
    // Po pierwszym błędzie walidujemy na bieżąco, żeby komunikat zniknął od razu po poprawce.
    if (touched[field] || errors[field]) setErrors((e) => ({ ...e, [field]: validate(field, next) }));
  };

  const blur = (field: FieldName) => {
    setTouched((t) => ({ ...t, [field]: true }));
    setErrors((e) => ({ ...e, [field]: validate(field, values) }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors = {};
    for (const field of order) nextErrors[field] = validate(field, values);
    setErrors(nextErrors);
    setTouched(Object.fromEntries(order.map((f) => [f, true])));
    const invalid = order.filter((f) => nextErrors[f]);
    setSummary(invalid);
    if (invalid.length) {
      setSubmitted(false);
      requestAnimationFrame(() => summaryRef.current?.focus());
      return;
    }
    setSubmitted(true);
    requestAnimationFrame(() => statusRef.current?.focus());
  };

  const serviceLabel = serviceOptions.find((o) => o.value === values.service)?.label ?? "";
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(`Zapytanie: ${serviceLabel}`)}&body=${encodeURIComponent(
    `${values.message.trim()}\n\n${values.name.trim()}\ntel. ${values.phone.trim()}\n${values.email.trim()}`,
  )}`;

  const fieldProps = (field: Exclude<FieldName, "consent">) => ({
    id: `pole-${field}`,
    name: field,
    value: values[field],
    onBlur: () => blur(field),
    "aria-invalid": errors[field] ? true : undefined,
    "aria-describedby": [errors[field] ? `blad-${field}` : null, field === "message" ? "pomoc-message" : null].filter(Boolean).join(" ") || undefined,
  });

  const errorText = (field: FieldName) =>
    errors[field] ? (
      <p id={`blad-${field}`} className={styles.error}>
        {errors[field]}
      </p>
    ) : null;

  return (
    <form className={styles.form} onSubmit={onSubmit} noValidate aria-labelledby="formularz-tytul">
      <h2 id="formularz-tytul" className={styles.title}>
        Formularz zapytania
      </h2>
      <p className={styles.required}>Wszystkie pola są wymagane.</p>

      {summary.length > 0 && (
        <div ref={summaryRef} className={styles.summary} role="alert" tabIndex={-1} aria-labelledby="podsumowanie-bledow">
          <h3 id="podsumowanie-bledow">
            Popraw {summary.length} {fieldWord(summary.length)} formularza
          </h3>
          <ul>
            {summary.map((field) => (
              <li key={field}>
                <a href={`#pole-${field}`}>
                  {labels[field]}: {errors[field]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="pole-name">{labels.name}</label>
          <input {...fieldProps("name")} type="text" autoComplete="name" onChange={(e) => update("name", e.target.value)} />
          {errorText("name")}
        </div>
        <div className={styles.field}>
          <label htmlFor="pole-phone">{labels.phone}</label>
          <input {...fieldProps("phone")} type="tel" inputMode="tel" autoComplete="tel" onChange={(e) => update("phone", e.target.value)} />
          {errorText("phone")}
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="pole-email">{labels.email}</label>
          <input {...fieldProps("email")} type="email" autoComplete="email" spellCheck={false} onChange={(e) => update("email", e.target.value)} />
          {errorText("email")}
        </div>
        <div className={styles.field}>
          <label htmlFor="pole-service">Interesująca Cię usługa</label>
          <div className={styles.selectWrap}>
            <select {...fieldProps("service")} onChange={(e) => update("service", e.target.value)}>
              <option value="" disabled>
                Wybierz usługę
              </option>
              {serviceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          {errorText("service")}
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="pole-message">{labels.message}</label>
        <p id="pomoc-message" className={styles.hint}>
          Np. rodzaj budynku i jego powierzchnia, liczba pomieszczeń, obecne ogrzewanie, model urządzenia do serwisu.
        </p>
        <textarea {...fieldProps("message")} rows={6} onChange={(e) => update("message", e.target.value)} />
        {errorText("message")}
      </div>

      <div className={styles.consent}>
        <input
          id="pole-consent"
          name="consent"
          type="checkbox"
          checked={values.consent}
          onChange={(e) => update("consent", e.target.checked)}
          onBlur={() => blur("consent")}
          aria-invalid={errors.consent ? true : undefined}
          aria-describedby={errors.consent ? "blad-consent" : undefined}
        />
        <label htmlFor="pole-consent">
          Wyrażam zgodę na przetwarzanie moich danych osobowych przez CLIMARO w celu odpowiedzi na zapytanie. Szczegóły w{" "}
          <Link href="/polityka-prywatnosci">polityce prywatności</Link>.
        </label>
        {errorText("consent")}
      </div>

      <button type="submit" className={`btn btn-primary ${styles.submit}`}>
        Wyślij zapytanie
      </button>

      {submitted && (
        <div ref={statusRef} className={styles.status} role="status" tabIndex={-1}>
          <h3>Zapytanie nie zostało wysłane</h3>
          <p>
            To wersja demonstracyjna strony: formularz sprawdza dane, ale nie jest jeszcze podłączony do systemu wysyłki wiadomości. Twoje dane nigdzie nie
            trafiły.
          </p>
          <p>Aby wysłać to zapytanie, otwórz gotową wiadomość e-mail albo zadzwoń.</p>
          <div className={styles.statusActions}>
            <a href={mailto} className="btn btn-secondary btn-small">
              Otwórz wiadomość e-mail
            </a>
            <a href={site.phoneHref} className="btn btn-secondary btn-small">
              <span className="num">{site.phone}</span>
            </a>
          </div>
        </div>
      )}
    </form>
  );
}
