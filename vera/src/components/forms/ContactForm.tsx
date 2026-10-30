"use client";

import { sendMessage } from "@/app/actions";
import { LIMITS, subjects, validateContact } from "@/lib/validation";
import { Consent, ErrorText, Honeypot, Input, NotConnected, Submit, TextArea, aria } from "./fields";
import { useFormFlow } from "./useFormFlow";

export function ContactForm() {
  const { state, pending, errors, formRef, formAction, submit, onBlur, onInput, clear } = useFormFlow(sendMessage, validateContact);

  if (state.status === "sent") {
    return (
      <div role="status" className="border-t-2 border-burgundy pt-8">
        <p className="display-md">Message sent</p>
        <p className="mt-4 max-w-md text-stone">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={submit} onBlur={onBlur} onInput={onInput} noValidate className="relative grid gap-7 sm:grid-cols-2">
      <Honeypot />
      <Input name="name" label="Full name" autoComplete="name" required maxLength={LIMITS.name} error={errors.name} />
      <Input name="email" type="email" label="E-mail" autoComplete="email" required maxLength={LIMITS.email} error={errors.email} />
      <Input name="phone" type="tel" label="Phone" optional autoComplete="tel" error={errors.phone} />
      <div>
        <label htmlFor="subject" className="label">
          Subject
        </label>
        <select id="subject" name="subject" defaultValue="" required onChange={() => clear("subject")} className="input" {...aria("subject", errors.subject)}>
          <option value="" disabled>
            Choose a subject
          </option>
          {subjects.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <ErrorText name="subject" error={errors.subject} />
      </div>
      <TextArea
        name="message"
        label="Message"
        rows={5}
        required
        maxLength={LIMITS.message}
        hint="Please don't include details about your health – we'll talk about them in person."
        error={errors.message}
        className="sm:col-span-2"
      />
      <div className="sm:col-span-2">
        <Consent error={errors.consent} onChange={() => clear("consent")} />
      </div>
      <div aria-live="polite" className="sm:col-span-2">
        {state.status === "error" && <p className="error">{state.message}</p>}
        {state.status === "not_configured" && <NotConnected what="Your message" />}
      </div>
      <div className="sm:col-span-2">
        <Submit pending={pending} label="Send message" />
      </div>
    </form>
  );
}
