"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import { Alert, Check } from "@/components/ui/Icons";
import { validateNewsletter, type FieldErrors, type NewsletterValues } from "@/lib/validation";

export function Newsletter() {
  const ids = useId();
  const [values, setValues] = useState<NewsletterValues>({ email: "", consent: false });
  const [errors, setErrors] = useState<FieldErrors<keyof NewsletterValues>>({});
  const [done, setDone] = useState(false);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const nextErrors = validateNewsletter(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      document.getElementById(nextErrors.email ? `${ids}-email` : `${ids}-consent`)?.focus();
      return;
    }
    // Tryb demonstracyjny: brak integracji z systemem mailingowym – adres nie jest nigdzie zapisywany.
    setDone(true);
    setValues({ email: "", consent: false });
  };

  return (
    <section aria-labelledby="newsletter-title" className="py-16 md:py-20">
      <div className="container-x grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        <div className="lg:col-span-5">
          <h2 id="newsletter-title" className="h3 text-[2.2rem] text-wine">
            Wiadomości ze studia
          </h2>
          <p className="mt-3 prose-measure">Raz w miesiącu: nowe grupy, warsztaty i wydarzenia. Bez spamu – wypisać się można w każdej chwili.</p>
        </div>

        <div className="lg:col-span-7" aria-live="polite">
          {done ? (
            <div className="flex items-start gap-4 rounded-[1.5rem] bg-blush p-6">
              <Check size={22} className="mt-0.5 shrink-0 text-wine" />
              <div>
                <p className="font-semibold">Adres jest poprawny – dziękujemy!</p>
                <p className="mt-1">
                  To formularz demonstracyjny bez połączenia z systemem mailingowym, więc <strong>nie zapisaliśmy Twojego adresu</strong> i nie
                  wyślemy żadnych wiadomości.
                </p>
                <button type="button" className="link mt-3 font-semibold" onClick={() => setDone(false)}>
                  Wróć do formularza
                </button>
              </div>
            </div>
          ) : (
            <form noValidate onSubmit={onSubmit}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <div className="flex-1">
                  <label htmlFor={`${ids}-email`} className="field-label">
                    Adres e-mail
                  </label>
                  <input
                    id={`${ids}-email`}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    className="field-input"
                    value={values.email}
                    onChange={(event) => setValues({ ...values, email: event.target.value })}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? `${ids}-email-error` : undefined}
                  />
                  {errors.email && (
                    <p id={`${ids}-email-error`} className="field-error">
                      <Alert size={16} className="mt-0.5 shrink-0" />
                      {errors.email}
                    </p>
                  )}
                </div>
                <button type="submit" className="btn btn-primary sm:mt-[1.85rem]">
                  Zapisz się (demo)
                </button>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <input
                  id={`${ids}-consent`}
                  type="checkbox"
                  className="checkbox"
                  checked={values.consent}
                  onChange={(event) => setValues({ ...values, consent: event.target.checked })}
                  aria-invalid={errors.consent ? true : undefined}
                  aria-describedby={errors.consent ? `${ids}-consent-error` : undefined}
                />
                <label htmlFor={`${ids}-consent`} className="text-sm leading-relaxed">
                  Chcę otrzymywać newsletter studia na podany adres e-mail. Szczegóły przetwarzania danych opisuje{" "}
                  <Link href="/polityka-prywatnosci" className="link">
                    polityka prywatności
                  </Link>
                  . Formularz jest demonstracyjny – adres nie jest nigdzie wysyłany.
                </label>
              </div>
              {errors.consent && (
                <p id={`${ids}-consent-error`} className="field-error">
                  <Alert size={16} className="mt-0.5 shrink-0" />
                  {errors.consent}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
