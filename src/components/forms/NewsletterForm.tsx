"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { postJson } from "@/lib/api-client";
import { validateEmail } from "@/lib/validation";

type State = { kind: "idle" } | { kind: "sending" } | { kind: "done"; message: string } | { kind: "error"; message: string; field?: string } | { kind: "unavailable"; message: string };

export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<State>({ kind: "idle" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    if (emailError) return setState({ kind: "error", message: emailError, field: "email" });
    if (!consent) return setState({ kind: "error", message: "Zaznacz zgodę na otrzymywanie newslettera.", field: "consent" });
    setState({ kind: "sending" });
    const result = await postJson<{ message: string }>("/api/newsletter", { email, consent: true });
    if (result.ok) {
      setState({ kind: "done", message: result.data.message });
      setEmail("");
      setConsent(false);
    } else if (result.code === "NEWSLETTER_NOT_CONFIGURED") {
      setState({ kind: "unavailable", message: result.message });
    } else {
      setState({ kind: "error", message: result.message, field: result.field });
    }
  };

  const emailInvalid = state.kind === "error" && state.field === "email";
  const consentInvalid = state.kind === "error" && state.field === "consent";

  return (
    <form onSubmit={submit} noValidate className="w-full max-w-xl">
      <label htmlFor={`${id}-email`} className="field-label">
        Adres e-mail
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          autoComplete="email"
          className="field"
          placeholder="ty@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={emailInvalid}
          aria-describedby={`${id}-status`}
        />
        <button type="submit" className="btn btn-light shrink-0" disabled={state.kind === "sending"}>
          {state.kind === "sending" ? "Zapisywanie…" : "Zapisz się"}
        </button>
      </div>
      <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm text-muted">
        <input type="checkbox" className="check" checked={consent} onChange={(e) => setConsent(e.target.checked)} aria-invalid={consentInvalid} />
        <span>
          Chcę dostawać e-maile o nowych dropach. Mogę wypisać się w każdej chwili. Administratorem danych jest sprzedawca – szczegóły w{" "}
          <Link href="/polityka-prywatnosci" className="link text-paper">
            polityce prywatności
          </Link>
          .
        </span>
      </label>
      <p id={`${id}-status`} role="status" className="mt-4 min-h-6 text-sm">
        {state.kind === "done" && <span className="text-paper">{state.message}</span>}
        {state.kind === "error" && <span className="text-danger">{state.message}</span>}
        {state.kind === "unavailable" && <span className="text-paper">{state.message}</span>}
      </p>
    </form>
  );
}
