import Link from "next/link";
import { site } from "@/config/site";

export function aria(name: string, error?: string, hint?: boolean) {
  const ids = [hint ? `${name}-hint` : null, error ? `${name}-error` : null].filter(Boolean).join(" ");
  return { "aria-invalid": error ? true : undefined, "aria-describedby": ids || undefined } as const;
}

export function ErrorText({ name, error }: { name: string; error?: string }) {
  return error ? (
    <span id={`${name}-error`} className="error">
      {error}
    </span>
  ) : null;
}

type Common = { name: string; label: string; hint?: string; error?: string; optional?: boolean; className?: string };

function Label({ name, label, optional }: { name: string; label: string; optional?: boolean }) {
  return (
    <label htmlFor={name} className="label">
      {label}
      {optional && <span className="font-normal text-stone"> (optional)</span>}
    </label>
  );
}

export function Input({ name, label, hint, error, optional, className = "", ...rest }: Common & Omit<React.InputHTMLAttributes<HTMLInputElement>, "name">) {
  return (
    <div className={className}>
      <Label name={name} label={label} optional={optional} />
      {hint && (
        <span id={`${name}-hint`} className="hint">
          {hint}
        </span>
      )}
      <input id={name} name={name} className="input" {...aria(name, error, Boolean(hint))} {...rest} />
      <ErrorText name={name} error={error} />
    </div>
  );
}

export function TextArea({ name, label, hint, error, optional, className = "", ...rest }: Common & Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name">) {
  return (
    <div className={className}>
      <Label name={name} label={label} optional={optional} />
      {hint && (
        <span id={`${name}-hint`} className="hint">
          {hint}
        </span>
      )}
      <textarea id={name} name={name} className="input" {...aria(name, error, Boolean(hint))} {...rest} />
      <ErrorText name={name} error={error} />
    </div>
  );
}

export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
      <label htmlFor="website">Website</label>
      <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function Consent({ error, onChange }: { error?: string; onChange?: () => void }) {
  return (
    <div>
      <label className="flex cursor-pointer gap-3 text-sm text-stone">
        <input type="checkbox" name="consent" required onChange={onChange} className="check" {...aria("consent", error)} />
        <span>
          I agree to VÉRA processing my personal data to respond to this request. See the{" "}
          <Link href="/privacy" target="_blank" className="underline-draw text-black">
            privacy policy<span className="sr-only"> (opens in a new tab)</span>
          </Link>
          .
        </span>
      </label>
      <ErrorText name="consent" error={error} />
    </div>
  );
}

/** Shown when the form isn't connected to the studio yet – states plainly that nothing was sent. */
export function NotConnected({ what }: { what: string }) {
  return (
    <div className="border-l-2 border-burgundy bg-white/60 p-6">
      <p className="font-display text-2xl leading-tight">{what} was not sent</p>
      <p className="mt-2 text-sm text-stone">
        This demo form isn&apos;t connected to the studio&apos;s inbox yet, so nothing you entered has been stored or passed on. Please contact us
        directly:
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={site.contact.phoneHref} className="cta cta-burgundy">
          Call {site.contact.phone}
        </a>
        <a href={`mailto:${site.contact.email}`} className="cta cta-line">
          E-mail us
        </a>
      </div>
    </div>
  );
}

export function Submit({ pending, label, pendingLabel = "Sending…" }: { pending: boolean; label: string; pendingLabel?: string }) {
  return (
    <button type="submit" disabled={pending} className="cta cta-burgundy w-full sm:w-auto">
      {pending && <span aria-hidden="true" className="size-3.5 animate-spin rounded-full border border-ivory/40 border-t-ivory" />}
      {pending ? pendingLabel : label}
    </button>
  );
}
