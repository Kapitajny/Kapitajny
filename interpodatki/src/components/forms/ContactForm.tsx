"use client";

import Link from "next/link";
import { useState } from "react";
import { Notice } from "@/components/ui/Notice";
import { postJson } from "@/lib/api-client";
import { CONTACT_TOPICS, emptyContact, validateContact, type ContactField, type ContactFormValues } from "@/lib/validation/contact";
import { hasErrors, type FieldErrors } from "@/lib/validation/fields";
import { CheckboxField, ErrorSummary, Honeypot, SelectField, TextField, TextareaField } from "./Fields";

const LABELS: Record<ContactField, string> = {
  name: "Imię",
  email: "Adres e-mail",
  phone: "Telefon",
  topic: "Temat",
  message: "Wiadomość",
  consent: "Zgoda",
};

export function ContactForm() {
  const [values, setValues] = useState<ContactFormValues>(emptyContact);
  const [errors, setErrors] = useState<FieldErrors<ContactField>>({});
  const [honeypot, setHoneypot] = useState("");
  const [startedAt] = useState(() => Date.now());
  const [status, setStatus] = useState<"idle" | "sending" | "error" | "done">("idle");
  const [message, setMessage] = useState("");
  const [number, setNumber] = useState("");

  const set = <K extends ContactField>(key: K, value: ContactFormValues[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const found = validateContact(values);
    if (hasErrors(found)) {
      setErrors(found);
      requestAnimationFrame(() => document.getElementById("error-summary")?.focus());
      return;
    }
    setStatus("sending");
    const res = await postJson<{ number: string }>("/api/demo/inquiries", {
      kind: "kontakt",
      values,
      website: honeypot,
      startedAt,
    });
    if (res.ok) {
      setNumber(res.data.number);
      setStatus("done");
      return;
    }
    setStatus("error");
    setMessage(res.message);
    if (res.errors) setErrors(res.errors as FieldErrors<ContactField>);
  }

  if (status === "done") {
    return (
      <div className="space-y-4" role="status">
        <Notice tone="success" title="Wiadomość zapisana w trybie demonstracyjnym">
          Numer zgłoszenia: <strong className="num">{number}</strong>. Wiadomość <strong>nie została wysłana</strong> e-mailem
          – formularz nie jest połączony z pocztą. Treść przechowujemy tymczasowo w pamięci serwera demo.
        </Notice>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => {
              setValues(emptyContact);
              setStatus("idle");
            }}
          >
            Napisz kolejną wiadomość
          </button>
          <Link href="/panel-demo" className="btn btn-dark">
            Zobacz w panelu demo
          </Link>
        </div>
      </div>
    );
  }

  const visible = Object.fromEntries(Object.entries(errors).filter(([, v]) => v));

  return (
    <form noValidate onSubmit={onSubmit} className="relative space-y-6" aria-label="Formularz kontaktowy">
      {Object.keys(visible).length > 0 && <ErrorSummary errors={visible} labels={LABELS} />}
      <Honeypot value={honeypot} onChange={setHoneypot} />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField id="name" label={LABELS.name} autoComplete="given-name" value={values.name} onChange={(e) => set("name", e.target.value)} error={errors.name} />
        <TextField id="email" label={LABELS.email} type="email" autoComplete="email" value={values.email} onChange={(e) => set("email", e.target.value)} error={errors.email} />
        <TextField id="phone" label={LABELS.phone} optional type="tel" autoComplete="tel" value={values.phone} onChange={(e) => set("phone", e.target.value)} error={errors.phone} />
        <SelectField
          id="topic"
          label={LABELS.topic}
          options={CONTACT_TOPICS}
          value={values.topic}
          onChange={(e) => set("topic", e.target.value as ContactFormValues["topic"])}
          error={errors.topic}
        />
      </div>
      <TextareaField
        id="message"
        label={LABELS.message}
        rows={6}
        maxLength={2000}
        value={values.message}
        onChange={(e) => set("message", e.target.value)}
        error={errors.message}
        hint={`${values.message.length}/2000 znaków`}
      />
      <CheckboxField
        id="consent"
        checked={values.consent}
        onChange={(c) => set("consent", c)}
        error={errors.consent}
        label={
          <>
            Wyrażam zgodę na przetwarzanie danych w celu odpowiedzi na wiadomość. Zapoznałem(-am) się z{" "}
            <Link href="/polityka-prywatnosci" className="link" target="_blank">
              polityką prywatności (demo)
            </Link>
            .
          </>
        }
      />
      {status === "error" && (
        <Notice tone="error" title="Nie udało się zapisać wiadomości" role="alert">
          {message}
        </Notice>
      )}
      <button type="submit" className="btn btn-primary" disabled={status === "sending"} aria-busy={status === "sending"}>
        {status === "sending" && <span className="spinner" aria-hidden="true" />}
        {status === "sending" ? "Zapisywanie…" : "Wyślij wiadomość (demo)"}
      </button>
    </form>
  );
}
