"use client";

import Link from "next/link";
import { useState } from "react";
import { validateEmail } from "@/lib/validation";
import { AlertIcon, CheckIcon, InfoIcon } from "@/components/ui/Icons";

type Status = { kind: "idle" } | { kind: "loading" } | { kind: "success" | "info" | "error"; message: string };

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [fieldError, setFieldError] = useState<{ email?: string; consent?: string }>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const emailError = validateEmail(email);
    const consentError = consent ? undefined : "Zaznacz zgodę, aby zapisać się do newslettera.";
    setFieldError({ email: emailError ?? undefined, consent: consentError });
    if (emailError || consentError) {
      setStatus({ kind: "idle" });
      return;
    }

    setStatus({ kind: "loading" });
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok) {
        setStatus({ kind: "success", message: data.message ?? "Dziękujemy za zapis!" });
        setEmail("");
        setConsent(false);
      } else if (data?.error?.code === "NEWSLETTER_NOT_CONFIGURED") {
        setStatus({ kind: "info", message: data.error.message });
      } else {
        setStatus({ kind: "error", message: data?.error?.message ?? "Nie udało się zapisać adresu. Spróbuj ponownie." });
      }
    } catch {
      setStatus({ kind: "error", message: "Brak połączenia. Sprawdź internet i spróbuj ponownie." });
    }
  };

  return (
    <section aria-labelledby="newsletter-title" className="bg-sand py-20 lg:py-28">
      <div className="container-x grid gap-10 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-6">
          <p className="eyebrow">Newsletter</p>
          <h2 id="newsletter-title" className="mt-5 text-[clamp(2.2rem,1.4rem+3vw,4rem)]">
            Zostań na jeszcze <em className="italic text-latte">jedną kawę.</em>
          </h2>
          <p className="mt-5 max-w-md text-muted">Kawy sezonowe, nowości w menu i otwarcia lokali. Piszemy rzadko i tylko wtedy, gdy mamy coś dobrego.</p>
        </div>

        <form onSubmit={submit} noValidate className="lg:col-span-5 lg:col-start-8">
          <label htmlFor="newsletter-email" className="field-label">
            Adres e-mail
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="newsletter-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="twoj@email.pl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={fieldError.email ? true : undefined}
              aria-describedby={fieldError.email ? "newsletter-email-error" : undefined}
              className="field-input flex-1"
            />
            <button type="submit" className="btn btn-primary" disabled={status.kind === "loading"}>
              {status.kind === "loading" ? "Zapisywanie…" : "Zapisz się"}
            </button>
          </div>
          {fieldError.email && (
            <p id="newsletter-email-error" className="mt-2 text-sm text-danger">
              {fieldError.email}
            </p>
          )}

          <label className="mt-4 flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-espresso">
            <input
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              aria-invalid={fieldError.consent ? true : undefined}
              aria-describedby={fieldError.consent ? "newsletter-consent-error" : undefined}
              className="mt-1 h-4 w-4 shrink-0 accent-roast"
            />
            <span>
              Chcę otrzymywać newsletter NOIR COFFEE na podany adres e-mail. Zgodę mogę wycofać w każdej chwili. Szczegóły w{" "}
              <Link href="/polityka-prywatnosci" className="link-quiet">
                polityce prywatności
              </Link>
              .
            </span>
          </label>
          {fieldError.consent && (
            <p id="newsletter-consent-error" className="mt-2 text-sm text-danger">
              {fieldError.consent}
            </p>
          )}

          <div aria-live="polite" className="min-h-6">
            {(status.kind === "success" || status.kind === "info" || status.kind === "error") && (
              <p
                role={status.kind === "error" ? "alert" : "status"}
                className={`mt-5 flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${
                  status.kind === "success" ? "bg-paper text-success" : status.kind === "error" ? "bg-paper text-danger" : "bg-paper text-espresso"
                }`}
              >
                {status.kind === "success" ? <CheckIcon size={18} /> : status.kind === "error" ? <AlertIcon size={18} /> : <InfoIcon size={18} />}
                <span>{status.message}</span>
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
