"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import styles from "./forms.module.css";

type Errors = Partial<Record<"name" | "email" | "subject" | "message" | "consent", string>>;

const subjects = ["Pytanie o produkt", "Zamówienie i dostawa", "Współpraca", "Inny temat"];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function validate(data: FormData): Errors {
  const errors: Errors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  if (name.length < 3) errors.name = "Wpisz imię i nazwisko.";
  if (!EMAIL.test(email)) errors.email = "Wpisz poprawny adres e-mail, np. jan@example.com.";
  if (!data.get("subject")) errors.subject = "Wybierz temat wiadomości.";
  if (message.length < 10) errors.message = "Napisz wiadomość, co najmniej 10 znaków.";
  if (!data.get("consent")) errors.consent = "Zaznacz zgodę, żebyśmy mogli odpowiedzieć na wiadomość.";
  return errors;
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(new FormData(event.currentTarget));
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    // Wersja demonstracyjna: formularz niczego nie wysyła. Tu podłącza się skrzynkę lub API.
    setSent(true);
  };

  if (sent) {
    return (
      <div className={styles.done} role="status">
        <h3>Formularz działa w trybie demonstracyjnym.</h3>
        <p>
          Dane przeszły walidację, ale wiadomość nie została nigdzie wysłana ani zapisana. W gotowym sklepie w tym
          miejscu pojawi się potwierdzenie wysyłki.
        </p>
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => {
            setSent(false);
            setErrors({});
          }}
        >
          Wróć do formularza
        </button>
      </div>
    );
  }

  const describe = (field: keyof Errors) => (errors[field] ? `contact-${field}-error` : undefined);

  return (
    <form ref={formRef} className={styles.form} onSubmit={onSubmit} noValidate aria-label="Formularz kontaktowy">
      <div className={styles.row}>
        <div className="field">
          <label htmlFor="contact-name">Imię i nazwisko</label>
          <input
            id="contact-name"
            name="name"
            className="input"
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describe("name")}
          />
          {errors.name ? (
            <p id="contact-name-error" className="field-error">
              {errors.name}
            </p>
          ) : null}
        </div>
        <div className="field">
          <label htmlFor="contact-email">Adres e-mail</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            className="input"
            autoComplete="email"
            inputMode="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describe("email")}
          />
          {errors.email ? (
            <p id="contact-email-error" className="field-error">
              {errors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-subject">Temat wiadomości</label>
        <select
          id="contact-subject"
          name="subject"
          className="select"
          defaultValue=""
          required
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={describe("subject")}
        >
          <option value="" disabled>
            Wybierz temat
          </option>
          {subjects.map((subject) => (
            <option key={subject}>{subject}</option>
          ))}
        </select>
        {errors.subject ? (
          <p id="contact-subject-error" className="field-error">
            {errors.subject}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label htmlFor="contact-message">Treść wiadomości</label>
        <textarea
          id="contact-message"
          name="message"
          className="textarea"
          rows={5}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describe("message")}
        />
        {errors.message ? (
          <p id="contact-message-error" className="field-error">
            {errors.message}
          </p>
        ) : null}
      </div>

      <div className="field">
        <label className="check">
          <input type="checkbox" name="consent" required aria-invalid={Boolean(errors.consent)} aria-describedby={describe("consent")} />
          <span>
            Zgadzam się na przetwarzanie moich danych w celu odpowiedzi na wiadomość. Zasady opisuje{" "}
            <Link href="/polityka-prywatnosci" className="text-link">
              polityka prywatności
            </Link>
            .
          </span>
        </label>
        {errors.consent ? (
          <p id="contact-consent-error" className="field-error">
            {errors.consent}
          </p>
        ) : null}
      </div>

      <div className={styles.submit}>
        <button type="submit" className="btn">
          Wyślij wiadomość
        </button>
        <p className="demo-note">Wersja demonstracyjna: wiadomość nie zostanie wysłana.</p>
      </div>
    </form>
  );
}
