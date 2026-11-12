"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type State = { kind: "idle" | "sending" | "sent" } | { kind: "error"; message: string };

export function ContactForm() {
  const [state, setState] = useState<State>({ kind: "idle" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setState({ kind: "sending" });
    setErrors({});
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          message: form.get("message"),
          consent: form.get("consent") === "on",
          website: form.get("website"),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setState({ kind: "sent" });
        (e.target as HTMLFormElement).reset();
        return;
      }
      setErrors(data?.error?.fields ?? {});
      setState({ kind: "error", message: data?.error?.message ?? "Nie udało się wysłać wiadomości." });
    } catch {
      setState({ kind: "error", message: "Brak połączenia. Sprawdź internet i spróbuj ponownie." });
    }
  }

  if (state.kind === "sent") {
    return (
      <div className="border-t-2 border-turq pt-6" role="status">
        <p className="font-display text-4xl font-extrabold uppercase">Wiadomość wysłana</p>
        <p className="mt-2 text-white/75">Dziękujemy. Odpowiemy na podany adres e-mail.</p>
        <button type="button" onClick={() => setState({ kind: "idle" })} className="btn btn-ghost btn-sm mt-6">
          Napisz kolejną
        </button>
      </div>
    );
  }

  const err = (k: string) =>
    errors[k] ? (
      <p id={`c-${k}-err`} className="field-error">
        {errors[k]}
      </p>
    ) : null;

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="c-name" className="field-label">
            Imię
          </label>
          <input id="c-name" name="name" autoComplete="name" className="field" aria-invalid={!!errors.name} aria-describedby={errors.name ? "c-name-err" : undefined} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="c-email" className="field-label">
            E-mail
          </label>
          <input id="c-email" name="email" type="email" autoComplete="email" className="field" aria-invalid={!!errors.email} aria-describedby={errors.email ? "c-email-err" : undefined} />
          {err("email")}
        </div>
      </div>
      <div>
        <label htmlFor="c-message" className="field-label">
          Wiadomość
        </label>
        <textarea id="c-message" name="message" rows={5} className="field" aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-err" : undefined} />
        {err("message")}
      </div>
      <div className="hidden" aria-hidden="true">
        <label htmlFor="c-website">Strona www</label>
        <input id="c-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div>
        <label className="flex items-start gap-3 text-[0.95rem] text-white/80">
          <input type="checkbox" name="consent" className="check" aria-invalid={!!errors.consent} />
          <span>
            Wyrażam zgodę na przetwarzanie moich danych w celu odpowiedzi na wiadomość. Szczegóły w{" "}
            <Link href="/polityka-prywatnosci" className="link text-white">
              polityce prywatności
            </Link>
            .
          </span>
        </label>
        {err("consent")}
      </div>
      {state.kind === "error" && (
        <p role="alert" className="border-l-4 border-[#ff9a92] bg-slate px-4 py-3 text-white">
          {state.message}
        </p>
      )}
      <div>
        <button type="submit" className="btn btn-primary" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Wysyłanie…" : "Wyślij wiadomość"}
        </button>
      </div>
    </form>
  );
}
