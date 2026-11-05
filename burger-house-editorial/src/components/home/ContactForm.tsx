"use client";

import Link from "next/link";
import { useId, useRef, useState, type FormEvent } from "react";

type Field = "name" | "email" | "phone" | "message" | "consent";
type Errors = Partial<Record<Field, string>>;
const ORDER: Field[] = ["name", "email", "phone", "message", "consent"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(d: FormData): Errors {
  const e: Errors = {};
  const v = (k: string) => String(d.get(k) ?? "").trim();
  if (v("name").length < 2) e.name = "Wpisz imię (co najmniej 2 znaki).";
  if (!v("email")) e.email = "Wpisz adres e-mail.";
  else if (!EMAIL_RE.test(v("email"))) e.email = "Sprawdź adres e-mail – brakuje w nim „@” lub domeny.";
  const ph = v("phone");
  const digits = ph.replace(/\D/g, "");
  if (ph && (digits.length < 9 || digits.length > 13 || /[^\d\s+()-]/.test(ph))) e.phone = "Wpisz numer, np. 600 123 456 lub +48 600 123 456.";
  if (v("message").length < 10) e.message = "Napisz wiadomość (co najmniej 10 znaków).";
  if (!d.get("consent")) e.consent = "Zaznacz zgodę, abyśmy mogli odpowiedzieć.";
  return e;
}

function Err({ id, msg }: { id: string; msg?: string }) {
  return msg ? (
    <p className="err" id={id}>
      {msg}
    </p>
  ) : null;
}

export function ContactForm() {
  const uid = useId();
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const doneRef = useRef<HTMLDivElement>(null);
  const id = (f: Field) => `${uid}-${f}`;
  const eid = (f: Field) => `${uid}-${f}-err`;

  const onSubmit = (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const d = new FormData(ev.currentTarget);
    const found = validate(d);
    setErrors(found);
    const first = ORDER.find((f) => found[f]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      setSent(String(d.get("name")).trim());
      requestAnimationFrame(() => doneRef.current?.focus());
    }, 600);
  };

  const recheck = (f: Field, form: HTMLFormElement | null) => {
    if (!errors[f] || !form) return;
    const next = validate(new FormData(form));
    setErrors((p) => ({ ...p, [f]: next[f] }));
  };

  const props = (f: Field) => ({
    id: id(f),
    name: f,
    "aria-invalid": errors[f] ? true : undefined,
    "aria-describedby": errors[f] ? eid(f) : undefined,
    onChange: (e: { currentTarget: HTMLInputElement | HTMLTextAreaElement }) => recheck(f, e.currentTarget.form),
  });

  if (sent) {
    return (
      <div className="done" ref={doneRef} tabIndex={-1} role="status">
        <h3 className="title">Dziękujemy, {sent}. Wiadomość przyjęta.</h3>
        <p>To formularz demonstracyjny, więc wiadomość nie została nigdzie wysłana. W wersji produkcyjnej tutaj pojawi się potwierdzenie i czas odpowiedzi.</p>
        <button type="button" className="btn btn--line" onClick={() => { setSent(null); setErrors({}); }}>
          Napisz kolejną wiadomość
        </button>
      </div>
    );
  }

  return (
    <form className="form" noValidate onSubmit={onSubmit} aria-describedby={`${uid}-demo`}>
      <p className="notice" id={`${uid}-demo`}>
        Formularz demonstracyjny. Strona nie ma jeszcze serwera poczty: po wysłaniu zobaczysz potwierdzenie, ale wiadomość nie zostanie przekazana.
      </p>
      <div className="form__row">
        <div className="field" data-invalid={!!errors.name}>
          <label htmlFor={id("name")}>Imię</label>
          <input type="text" autoComplete="given-name" required {...props("name")} />
          <Err id={eid("name")} msg={errors.name} />
        </div>
        <div className="field" data-invalid={!!errors.email}>
          <label htmlFor={id("email")}>Adres e-mail</label>
          <input type="email" autoComplete="email" required {...props("email")} />
          <Err id={eid("email")} msg={errors.email} />
        </div>
      </div>
      <div className="field" data-invalid={!!errors.phone}>
        <label htmlFor={id("phone")}>
          Telefon <span>(opcjonalnie)</span>
        </label>
        <input type="tel" autoComplete="tel" inputMode="tel" {...props("phone")} />
        <Err id={eid("phone")} msg={errors.phone} />
      </div>
      <div className="field" data-invalid={!!errors.message}>
        <label htmlFor={id("message")}>Wiadomość</label>
        <textarea rows={4} required {...props("message")} />
        <Err id={eid("message")} msg={errors.message} />
      </div>
      <div>
        <label className="consent" data-invalid={!!errors.consent}>
          <input type="checkbox" value="yes" {...props("consent")} />
          <span>
            Zgadzam się na przetwarzanie moich danych w celu odpowiedzi na wiadomość, zgodnie z <Link href="/polityka-prywatnosci">polityką prywatności</Link>.
          </span>
        </label>
        <Err id={eid("consent")} msg={errors.consent} />
      </div>
      <div>
        <button type="submit" className="btn" disabled={busy} aria-busy={busy}>
          {busy ? "Wysyłanie…" : "Wyślij wiadomość"}
        </button>
      </div>
    </form>
  );
}
