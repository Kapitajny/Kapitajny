"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { CONTACT_TOPICS } from "@/data/contact";
import { AlertIcon, CheckIcon } from "@/components/ui/Icons";

export function ContactForm() {
  const [state, setState] = useState<{ ok: boolean; message: string } | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setBusy(true);
    setState(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), email: form.get("email"), topic: form.get("topic"), message: form.get("message"), website: form.get("website"), consent: form.get("consent") === "on" }),
      });
      const data = (await res.json()) as { error?: { message: string } };
      if (res.ok) {
        setState({ ok: true, message: "Dziękujemy! Wiadomość została wysłana – odpowiemy najszybciej, jak to możliwe." });
        (e.target as HTMLFormElement).reset();
      } else setState({ ok: false, message: data.error?.message ?? "Nie udało się wysłać wiadomości." });
    } catch {
      setState({ ok: false, message: "Brak połączenia z serwerem. Spróbuj ponownie." });
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 bg-cream p-6 ring-1 ring-line sm:grid-cols-2 sm:p-8">
      <div>
        <label htmlFor="c-name" className="label">
          Imię
        </label>
        <input id="c-name" name="name" required minLength={2} maxLength={120} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="c-email" className="label">
          E-mail
        </label>
        <input id="c-email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-topic" className="label">
          Temat
        </label>
        <select id="c-topic" name="topic" className="field">
          {CONTACT_TOPICS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="c-message" className="label">
          Wiadomość
        </label>
        <textarea id="c-message" name="message" required minLength={10} maxLength={5000} rows={6} className="field" />
      </div>
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <label className="flex gap-3 text-sm leading-relaxed sm:col-span-2">
        <input type="checkbox" name="consent" required className="mt-0.5 h-5 w-5 shrink-0 accent-forest" />
        <span>
          Potwierdzam zapoznanie się z{" "}
          <Link href="/polityka-prywatnosci" className="link text-forest">
            Polityką prywatności
          </Link>
          . Dane z formularza wykorzystamy wyłącznie do odpowiedzi na wiadomość.
        </span>
      </label>
      <div className="sm:col-span-2">
        <button type="submit" className="btn btn-primary w-full sm:w-auto" disabled={busy}>
          {busy ? "Wysyłanie…" : "Wyślij wiadomość"}
        </button>
        {state && (
          <p role="status" className={`mt-4 flex gap-2.5 text-[0.98rem] ${state.ok ? "text-success" : "text-danger"}`}>
            {state.ok ? <CheckIcon size={20} className="mt-0.5 shrink-0" /> : <AlertIcon size={20} className="mt-0.5 shrink-0" />}
            {state.message}
          </p>
        )}
      </div>
    </form>
  );
}
