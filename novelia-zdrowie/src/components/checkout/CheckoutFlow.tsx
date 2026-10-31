"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { formatPrice } from "@/lib/format";
import { DIGITAL_CONSENT_TEXT, isValidEmail, normalizeEmail, validateCheckout } from "@/lib/validation";
import { useCart } from "@/components/cart/CartProvider";
import { AlertIcon, ArrowLeftIcon, FileIcon, LockIcon, TrashIcon } from "@/components/ui/Icons";

const ATTEMPT_KEY = "novelia-checkout-attempt";

/** Klucz idempotencji próby płatności – ta sama treść zamówienia = ta sama próba (np. po powrocie ze Stripe). */
function attemptKey(fingerprint: string): string {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(ATTEMPT_KEY) || "null") as { fp: string; key: string } | null;
    if (saved?.fp === fingerprint) return saved.key;
    const key = crypto.randomUUID();
    window.sessionStorage.setItem(ATTEMPT_KEY, JSON.stringify({ fp: fingerprint, key }));
    return key;
  } catch {
    return crypto.randomUUID();
  }
}

function resetAttempt() {
  try {
    window.sessionStorage.removeItem(ATTEMPT_KEY);
  } catch {
    /* brak dostępu do sessionStorage */
  }
}

type FieldErrors = Partial<Record<"email" | "emailConfirm" | "name" | "acceptTerms" | "digitalConsent" | "items", string>>;

export function CheckoutFlow() {
  const cart = useCart();
  const [email, setEmail] = useState("");
  const [emailConfirm, setEmailConfirm] = useState("");
  const [name, setName] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [digitalConsent, setDigitalConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!cart.hydrated) {
    return <div className="min-h-[50vh]" aria-busy="true" />;
  }

  if (cart.items.length === 0) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="text-3xl">Twój koszyk jest pusty</h2>
        <p className="mt-4 text-muted">Dodaj publikację, aby złożyć zamówienie.</p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/sklep/zdrowiej-kazdego-dnia" className="btn btn-primary">
            Zdrowiej każdego dnia – 39,99 zł
          </Link>
          <Link href="/sklep" className="btn btn-outline">
            Przejdź do sklepu
          </Link>
        </div>
      </div>
    );
  }

  const unavailable = cart.items.filter((p) => cart.available[p.slug] === false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setFormError(null);
    const fingerprint = JSON.stringify([cart.items.map((p) => p.slug), normalizeEmail(email), name.trim()]);
    const payload = {
      items: cart.items.map((p) => p.slug),
      email,
      emailConfirm,
      name,
      acceptTerms,
      digitalConsent,
      idempotencyKey: attemptKey(fingerprint),
    };
    const result = validateCheckout(payload);
    if (!result.ok) {
      setErrors(result.field ? { [result.field]: result.message } : {});
      if (!result.field) setFormError(result.message);
      document.getElementById(`pole-${result.field}`)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = (await response.json().catch(() => ({}))) as { url?: string; error?: { code: string; message: string; field?: string } };
      if (response.ok && data.url) {
        window.location.assign(data.url);
        return;
      }
      if (data.error?.code === "ATTEMPT_CLOSED" || data.error?.code === "PAYLOAD_MISMATCH") resetAttempt();
      if (data.error?.field) setErrors({ [data.error.field]: data.error.message });
      setFormError(data.error?.message ?? "Nie udało się rozpocząć płatności. Spróbuj ponownie.");
    } catch {
      setFormError("Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie.");
    }
    setSubmitting(false);
  }

  const emailHint = email && !isValidEmail(normalizeEmail(email)) ? "Sprawdź adres – wygląda na niepełny." : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-12 lg:grid-cols-12 lg:gap-16">
      <div className="lg:col-span-7">
        <section aria-labelledby="koszyk-pozycje">
          <h2 id="koszyk-pozycje" className="text-2xl sm:text-3xl">
            Twoje publikacje
          </h2>
          <ul className="mt-6 divide-y divide-line border-y border-line">
            {cart.items.map((p) => (
              <li key={p.slug} className="flex gap-4 py-5 sm:gap-6">
                <Image src={p.cover.src} alt="" width={84} height={134} className="h-[134px] w-[84px] shrink-0 object-cover book-shadow" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <Link href={`/sklep/${p.slug}`} className="font-serif text-xl leading-snug text-forest hover:underline">
                    {p.title}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{p.subtitle}</p>
                  <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted">
                    <FileIcon size={16} /> E-book PDF · 1 licencja osobista
                  </p>
                  {cart.available[p.slug] === false && <p className="mt-2 text-sm text-danger">Ta publikacja nie jest jeszcze dostępna – usuń ją z koszyka.</p>}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="font-medium">{formatPrice(p.price)}</span>
                    <button type="button" onClick={() => cart.remove(p.slug)} className="inline-flex min-h-11 items-center gap-1.5 px-2 text-sm text-muted hover:text-danger" aria-label={`Usuń „${p.title}” z koszyka`}>
                      <TrashIcon size={16} /> Usuń
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <Link href="/sklep" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm text-forest hover:underline">
            <ArrowLeftIcon size={16} /> Dodaj kolejne publikacje
          </Link>
        </section>

        <section aria-labelledby="dane-zamowienia" className="mt-12">
          <h2 id="dane-zamowienia" className="text-2xl sm:text-3xl">
            Dane do zamówienia
          </h2>
          <p className="mt-2 text-muted">Na podany adres wyślemy link do pobrania i potwierdzenie zamówienia.</p>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="pole-email" className="label">
                Adres e-mail <span className="text-danger">*</span>
              </label>
              <input id="pole-email" type="email" inputMode="email" autoComplete="email" required className="field" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} aria-describedby="pole-email-opis" />
              <p id="pole-email-opis" className={`mt-1.5 text-sm ${errors.email || emailHint ? "text-danger" : "text-muted"}`}>
                {errors.email ?? emailHint ?? "Sprawdź dokładnie – to jedyny kanał dostarczenia pliku."}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pole-emailConfirm" className="label">
                Powtórz adres e-mail <span className="text-danger">*</span>
              </label>
              <input id="pole-emailConfirm" type="email" inputMode="email" autoComplete="email" required className="field" value={emailConfirm} onChange={(e) => setEmailConfirm(e.target.value)} onPaste={(e) => e.preventDefault()} aria-invalid={!!errors.emailConfirm} aria-describedby="pole-emailConfirm-opis" />
              <p id="pole-emailConfirm-opis" className="mt-1.5 text-sm text-danger">
                {errors.emailConfirm}
              </p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="pole-name" className="label">
                Imię i nazwisko <span className="font-normal text-muted">(opcjonalnie)</span>
              </label>
              <input id="pole-name" type="text" autoComplete="name" className="field" value={name} onChange={(e) => setName(e.target.value)} aria-invalid={!!errors.name} maxLength={120} />
              {errors.name && <p className="mt-1.5 text-sm text-danger">{errors.name}</p>}
            </div>
          </div>

          <fieldset className="mt-8 space-y-4">
            <legend className="sr-only">Zgody</legend>
            <label className="flex cursor-pointer gap-3.5 text-[0.95rem] leading-relaxed">
              <input id="pole-acceptTerms" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-forest" checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} aria-invalid={!!errors.acceptTerms} />
              <span>
                <span className="text-danger">* </span>Akceptuję{" "}
                <Link href="/regulamin" target="_blank" className="link text-forest">
                  Regulamin sklepu
                </Link>{" "}
                oraz{" "}
                <Link href="/regulamin-tresci-cyfrowych" target="_blank" className="link text-forest">
                  Regulamin sprzedaży treści cyfrowych
                </Link>
                . Potwierdzam zapoznanie się z{" "}
                <Link href="/polityka-prywatnosci" target="_blank" className="link text-forest">
                  Polityką prywatności
                </Link>
                .
                {errors.acceptTerms && <span className="mt-1 block text-sm text-danger">{errors.acceptTerms}</span>}
              </span>
            </label>
            <label className="flex cursor-pointer gap-3.5 text-[0.95rem] leading-relaxed">
              <input id="pole-digitalConsent" type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-forest" checked={digitalConsent} onChange={(e) => setDigitalConsent(e.target.checked)} aria-invalid={!!errors.digitalConsent} />
              <span>
                <span className="text-danger">* </span>
                {DIGITAL_CONSENT_TEXT}
                {errors.digitalConsent && <span className="mt-1 block text-sm text-danger">{errors.digitalConsent}</span>}
              </span>
            </label>
          </fieldset>
        </section>
      </div>

      <aside className="lg:col-span-5">
        <div className="bg-cream p-6 ring-1 ring-line sm:p-8 lg:sticky lg:top-28">
          <h2 className="text-2xl">Podsumowanie</h2>
          <dl className="mt-6 space-y-3 text-[0.98rem]">
            {cart.items.map((p) => (
              <div key={p.slug} className="flex justify-between gap-4">
                <dt className="text-muted">{p.title}</dt>
                <dd className="shrink-0">{formatPrice(p.price)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Dostawa (plik PDF)</dt>
              <dd>0,00 zł</dd>
            </div>
            <div className="flex items-baseline justify-between gap-4 border-t border-line pt-4">
              <dt className="font-medium">Do zapłaty</dt>
              <dd className="font-serif text-3xl text-forest">{formatPrice(cart.total)}</dd>
            </div>
          </dl>
          <p className="mt-1 text-xs text-muted">Ceny brutto.</p>

          {(formError || unavailable.length > 0) && (
            <div role="alert" className="mt-6 flex gap-3 border border-danger/30 bg-danger/5 p-4 text-sm leading-relaxed text-danger">
              <AlertIcon size={18} className="mt-0.5 shrink-0" />
              <p>{formError ?? "Usuń z koszyka publikacje, które nie są jeszcze dostępne."}</p>
            </div>
          )}

          <button type="submit" className="btn btn-primary mt-6 w-full" disabled={submitting || unavailable.length > 0} aria-busy={submitting}>
            {submitting ? "Przekierowuję do płatności…" : "Zamawiam i płacę"}
          </button>
          <p className="mt-4 flex gap-2.5 text-sm leading-relaxed text-muted">
            <LockIcon size={18} className="mt-0.5 shrink-0 text-olive" />
            Płatność na bezpiecznej stronie operatora Stripe. Po potwierdzeniu płatności wrócisz do sklepu, gdzie pobierzesz plik, a link otrzymasz także e-mailem.
          </p>
          <p className="mt-3 text-xs text-muted">
            <Link href="/platnosci" className="link">
              Metody płatności
            </Link>{" "}
            ·{" "}
            <Link href="/dostawa" className="link">
              Dostawa produktów cyfrowych
            </Link>
          </p>
        </div>
      </aside>
    </form>
  );
}
