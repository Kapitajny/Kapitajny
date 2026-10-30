import Link from "next/link";
import { siteConfig } from "@/config/site";

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <span id={id} className="field-error">
      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" className="mt-[3px] shrink-0">
        <circle cx="7" cy="7" r="6.25" fill="none" stroke="currentColor" />
        <path d="M7 3.8v4M7 9.6v.6" stroke="currentColor" strokeWidth="1.3" />
      </svg>
      {message}
    </span>
  );
}

/** Atrybuty dostępności pola: powiązanie z podpowiedzią i komunikatem błędu. */
export function describe(name: string, error?: string, hint?: boolean) {
  const ids = [hint ? `${name}-hint` : null, error ? `${name}-error` : null].filter(Boolean).join(" ");
  return { "aria-invalid": error ? true : undefined, "aria-describedby": ids || undefined } as const;
}

interface TextFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function TextField({ name, label, hint, error, optional, className = "", ...rest }: TextFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="field-label">
        {label}
        {optional && <span className="font-normal text-taupe"> (opcjonalnie)</span>}
      </label>
      {hint && (
        <span id={`${name}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      <input id={name} name={name} className="field-input" {...describe(name, error, Boolean(hint))} {...rest} />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

interface TextAreaFieldProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
}

export function TextAreaField({ name, label, hint, error, optional, className = "", ...rest }: TextAreaFieldProps) {
  return (
    <div className={className}>
      <label htmlFor={name} className="field-label">
        {label}
        {optional && <span className="font-normal text-taupe"> (opcjonalnie)</span>}
      </label>
      {hint && (
        <span id={`${name}-hint`} className="field-hint">
          {hint}
        </span>
      )}
      <textarea id={name} name={name} className="field-input" {...describe(name, error, Boolean(hint))} {...rest} />
      <FieldError id={`${name}-error`} message={error} />
    </div>
  );
}

/** Pole-pułapka na boty: ukryte przed ludźmi i czytnikami ekranu. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="company">Firma</label>
      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function ConsentField({ error }: { error?: string }) {
  return (
    <div>
      <label className="flex cursor-pointer gap-4 text-sm leading-relaxed text-taupe">
        <input
          type="checkbox"
          name="consent"
          required
          className="field-check mt-1"
          {...describe("consent", error)}
        />
        <span>
          Wyrażam zgodę na przetwarzanie moich danych osobowych w celu odpowiedzi na zapytanie. Szczegóły w{" "}
          <Link href="/polityka-prywatnosci" className="link-quiet text-espresso" target="_blank">
            polityce prywatności
            <span className="sr-only"> (otwiera się w nowej karcie)</span>
          </Link>
          .
        </span>
      </label>
      <FieldError id="consent-error" message={error} />
    </div>
  );
}

/** Komunikat po wysłaniu formularza bez skonfigurowanej integracji – uczciwie: nic nie zostało wysłane. */
export function NotConfiguredNotice({ what }: { what: string }) {
  const { contact } = siteConfig;
  return (
    <div className="border border-espresso/20 bg-white/60 p-6 sm:p-8">
      <p className="font-serif text-2xl leading-snug text-espresso">{what} nie zostało wysłane</p>
      <p className="mt-3 text-sm text-taupe">
        Formularz nie jest jeszcze połączony ze skrzynką recepcji kliniki (wersja demonstracyjna strony). Dane z formularza nie zostały nigdzie zapisane
        ani przekazane. Skontaktuj się z nami bezpośrednio:
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={contact.phoneHref} className="btn btn-primary">
          Zadzwoń: {contact.phoneDisplay}
        </a>
        <a href={`mailto:${contact.email}`} className="btn btn-outline">
          Napisz e-mail
        </a>
      </div>
    </div>
  );
}

export function SubmitButton({ pending, label, pendingLabel }: { pending: boolean; label: string; pendingLabel: string }) {
  return (
    <button type="submit" className="btn btn-primary w-full sm:w-auto" aria-disabled={pending} disabled={pending}>
      {pending && <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border border-ivory/40 border-t-ivory" />}
      {pending ? pendingLabel : label}
    </button>
  );
}
