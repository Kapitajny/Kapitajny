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

/** Accessibility attributes linking a field to its hint and error message. */
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
        {optional && <span className="font-normal text-stone"> (optional)</span>}
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
        {optional && <span className="font-normal text-stone"> (optional)</span>}
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

/** Honeypot for bots: hidden from people and screen readers. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label htmlFor="company">Company</label>
      <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function ConsentField({ error }: { error?: string }) {
  return (
    <div>
      <label className="flex cursor-pointer gap-4 text-sm leading-relaxed text-stone">
        <input type="checkbox" name="consent" required className="checkbox" {...describe("consent", error)} />
        <span>
          I agree to VÉRA Aesthetic Studio processing my personal data to answer my enquiry. Details in the{" "}
          <Link href="/privacy-policy" className="text-black underline underline-offset-[3px]" target="_blank">
            privacy policy
            <span className="sr-only"> (opens in a new tab)</span>
          </Link>
          .
        </span>
      </label>
      <FieldError id="consent-error" message={error} />
    </div>
  );
}

/** Shown when no form integration is configured – honestly: nothing has been sent. */
export function NotConfiguredNotice({ what }: { what: string }) {
  const { contact } = siteConfig;
  return (
    <div role="alert" className="border-l-2 border-burgundy bg-white/60 p-6 sm:p-8">
      <p className="font-serif text-2xl leading-snug text-burgundy">{what} has not been sent</p>
      <p className="mt-3 text-sm text-stone">
        This demonstration site is not yet connected to the studio&apos;s inbox, so the details you entered were not stored or passed on. Please contact the
        studio directly:
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a href={contact.phoneHref} className="btn btn-primary">
          Call {contact.phone}
        </a>
        <a href={`mailto:${contact.email}`} className="btn btn-outline">
          Write an e-mail
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
