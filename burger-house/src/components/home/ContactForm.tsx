"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";
import { AlertIcon, CheckIcon, InfoIcon } from "../Icons";

type Field = "name" | "email" | "phone" | "message" | "consent";
type Errors = Partial<Record<Field, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const phone = String(data.get("phone") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();

  if (name.length < 2) errors.name = "Wpisz imię (co najmniej 2 znaki).";
  if (!email) errors.email = "Wpisz adres e-mail.";
  else if (!EMAIL_RE.test(email)) errors.email = "Sprawdź adres e-mail – brakuje w nim „@” lub domeny.";
  const digits = phone.replace(/[^\d]/g, "");
  if (phone && (digits.length < 9 || digits.length > 13 || /[^\d\s+()-]/.test(phone)))
    errors.phone = "Wpisz numer telefonu, np. 600 123 456 lub +48 600 123 456.";
  if (message.length < 10) errors.message = "Napisz wiadomość (co najmniej 10 znaków).";
  if (!data.get("consent")) errors.consent = "Zaznacz zgodę, abyśmy mogli odpowiedzieć na wiadomość.";
  return errors;
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p className="field__error" id={id}>
      <AlertIcon width={14} height={14} />
      {message}
    </p>
  );
}

export function ContactForm() {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const successRef = useRef<HTMLDivElement>(null);

  const id = (f: Field) => `${uid}-${f}`;
  const errId = (f: Field) => `${uid}-${f}-error`;

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const found = validate(data);
    setErrors(found);
    const firstInvalid = (Object.keys(found) as Field[])[0];
    if (firstInvalid) {
      document.getElementById(id(firstInvalid))?.focus();
      return;
    }
    // Wersja demonstracyjna: brak backendu – niczego nie wysyłamy.
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setSentTo(String(data.get("name")).trim());
      requestAnimationFrame(() => successRef.current?.focus());
    }, 600);
  };

  // błędne pole sprawdzamy ponownie w trakcie pisania – komunikat znika, gdy wartość jest poprawna
  const recheck = (f: Field, form: HTMLFormElement | null) => {
    if (!errors[f] || !form) return;
    const next = validate(new FormData(form));
    setErrors((prev) => ({ ...prev, [f]: next[f] }));
  };

  if (sentTo) {
    return (
      <div className="form-success" ref={successRef} tabIndex={-1} role="status">
        <span className="form-success__icon" aria-hidden="true">
          <CheckIcon />
        </span>
        <h4 className="h3">Wiadomość przyjęta, {sentTo}</h4>
        <p>
          To formularz demonstracyjny, więc wiadomość nie trafiła na żadną skrzynkę. W wersji produkcyjnej w tym miejscu potwierdzimy wysłanie i podamy
          czas odpowiedzi.
        </p>
        <button
          type="button"
          className="btn btn--dark btn--sm"
          onClick={() => {
            setSentTo(null);
            setErrors({});
          }}
        >
          Napisz kolejną wiadomość
        </button>
      </div>
    );
  }

  const fieldProps = (f: Field) => ({
    id: id(f),
    name: f,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? errId(f) : undefined,
    onChange: (e: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => recheck(f, e.currentTarget.form),
  });

  return (
    <form className="form" noValidate onSubmit={onSubmit} aria-describedby={`${uid}-demo`}>
      <p className="demo-note" id={`${uid}-demo`}>
        <InfoIcon />
        <span>
          <strong>Formularz demonstracyjny.</strong> Strona nie ma jeszcze serwera poczty – po wysłaniu zobaczysz potwierdzenie, ale wiadomość nie
          zostanie nigdzie przekazana.
        </span>
      </p>

      <div className="form__row">
        <div className="field" data-invalid={Boolean(errors.name)}>
          <label htmlFor={id("name")}>Imię</label>
          <input type="text" autoComplete="given-name" required {...fieldProps("name")} />
          <FieldError id={errId("name")} message={errors.name} />
        </div>
        <div className="field" data-invalid={Boolean(errors.phone)}>
          <label htmlFor={id("phone")}>
            Telefon <span>(opcjonalnie)</span>
          </label>
          <input type="tel" autoComplete="tel" inputMode="tel" {...fieldProps("phone")} />
          <FieldError id={errId("phone")} message={errors.phone} />
        </div>
      </div>

      <div className="field" data-invalid={Boolean(errors.email)}>
        <label htmlFor={id("email")}>Adres e-mail</label>
        <input type="email" autoComplete="email" required {...fieldProps("email")} />
        <FieldError id={errId("email")} message={errors.email} />
      </div>

      <div className="field" data-invalid={Boolean(errors.message)}>
        <label htmlFor={id("message")}>Wiadomość</label>
        <textarea required rows={5} {...fieldProps("message")} />
        <FieldError id={errId("message")} message={errors.message} />
      </div>

      <div>
        <label className="check" data-invalid={Boolean(errors.consent)}>
          <input type="checkbox" value="yes" {...fieldProps("consent")} />
          <span>
            Wyrażam zgodę na przetwarzanie moich danych w celu odpowiedzi na wiadomość, zgodnie z{" "}
            <Link href="/polityka-prywatnosci">polityką prywatności</Link>.
          </span>
        </label>
        <FieldError id={errId("consent")} message={errors.consent} />
      </div>

      <div>
        <button type="submit" className="btn" disabled={submitting} aria-busy={submitting}>
          {submitting ? "Wysyłanie…" : "Wyślij wiadomość"}
        </button>
      </div>
    </form>
  );
}
