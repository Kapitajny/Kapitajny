"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { CONTACT_TOPICS } from "@/lib/contact";
import { postJson } from "@/lib/api-client";
import { validateEmail, validateName } from "@/lib/validation";

type Status = { kind: "idle" | "sending" } | { kind: "error"; message: string; field?: string } | { kind: "done"; message: string } | { kind: "unavailable"; message: string };

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="field-error">
      {message}
    </p>
  );
}

export function ContactForm() {
  const id = useId();
  const [v, setV] = useState({ name: "", email: "", topic: "", orderNumber: "", message: "", consent: false });
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const set = (key: keyof typeof v, value: string | boolean) => setV((s) => ({ ...s, [key]: value }));
  const err = (field: string) => (status.kind === "error" && status.field === field ? status.message : undefined);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const local =
      (validateName(v.name, "imię") && { field: "name", message: validateName(v.name, "imię")! }) ||
      (validateEmail(v.email) && { field: "email", message: validateEmail(v.email)! }) ||
      (!v.topic && { field: "topic", message: "Wybierz temat wiadomości." }) ||
      (v.message.trim().length < 10 && { field: "message", message: "Wiadomość powinna mieć co najmniej 10 znaków." }) ||
      (!v.consent && { field: "consent", message: "Zaznacz zgodę na przetwarzanie danych w celu odpowiedzi." }) ||
      null;
    if (local) {
      setStatus({ kind: "error", ...local });
      document.getElementById(`${id}-${local.field}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    const result = await postJson<{ message: string }>("/api/contact", v);
    if (result.ok) {
      setStatus({ kind: "done", message: result.data.message });
      setV({ name: "", email: "", topic: "", orderNumber: "", message: "", consent: false });
    } else if (result.code === "CONTACT_NOT_CONFIGURED") {
      setStatus({ kind: "unavailable", message: result.message });
    } else {
      setStatus({ kind: "error", message: result.message, field: result.field });
    }
  };

  const describe = (field: string) => (err(field) ? `${id}-${field}-error` : undefined);

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-name`} className="field-label">
            Imię
          </label>
          <input id={`${id}-name`} className="field" autoComplete="given-name" value={v.name} onChange={(e) => set("name", e.target.value)} aria-invalid={Boolean(err("name"))} aria-describedby={describe("name")} />
          <FieldError id={`${id}-name-error`} message={err("name")} />
        </div>
        <div>
          <label htmlFor={`${id}-email`} className="field-label">
            E-mail
          </label>
          <input id={`${id}-email`} type="email" className="field" autoComplete="email" value={v.email} onChange={(e) => set("email", e.target.value)} aria-invalid={Boolean(err("email"))} aria-describedby={describe("email")} />
          <FieldError id={`${id}-email-error`} message={err("email")} />
        </div>
        <div>
          <label htmlFor={`${id}-topic`} className="field-label">
            Temat
          </label>
          <select id={`${id}-topic`} className="field" value={v.topic} onChange={(e) => set("topic", e.target.value)} aria-invalid={Boolean(err("topic"))} aria-describedby={describe("topic")}>
            <option value="">Wybierz…</option>
            {CONTACT_TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <FieldError id={`${id}-topic-error`} message={err("topic")} />
        </div>
        <div>
          <label htmlFor={`${id}-order`} className="field-label">
            Numer zamówienia (opcjonalnie)
          </label>
          <input id={`${id}-order`} className="field" placeholder="KP-XXXXXX" maxLength={20} value={v.orderNumber} onChange={(e) => set("orderNumber", e.target.value)} />
        </div>
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="field-label">
          Wiadomość
        </label>
        <textarea id={`${id}-message`} className="field min-h-40" maxLength={3000} value={v.message} onChange={(e) => set("message", e.target.value)} aria-invalid={Boolean(err("message"))} aria-describedby={describe("message")} />
        <FieldError id={`${id}-message-error`} message={err("message")} />
      </div>
      <div>
        <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
          <input id={`${id}-consent`} type="checkbox" className="check" checked={v.consent} onChange={(e) => set("consent", e.target.checked)} aria-invalid={Boolean(err("consent"))} />
          <span>
            Zgadzam się na przetwarzanie moich danych w celu odpowiedzi na wiadomość (
            <Link href="/polityka-prywatnosci" className="link text-paper">
              polityka prywatności
            </Link>
            ).
          </span>
        </label>
        <FieldError id={`${id}-consent-error`} message={err("consent")} />
      </div>
      <p role="status" className="min-h-6 text-sm">
        {status.kind === "done" && status.message}
        {status.kind === "unavailable" && status.message}
        {status.kind === "error" && !status.field && <span className="text-danger">{status.message}</span>}
      </p>
      <button type="submit" className="btn btn-light justify-self-start" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Wysyłanie…" : "Wyślij wiadomość"}
      </button>
    </form>
  );
}
