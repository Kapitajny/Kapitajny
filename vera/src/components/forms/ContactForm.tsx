"use client";

import { sendContactMessage } from "@/app/actions";
import { contactTopics, LIMITS, validateContact } from "@/lib/validation";
import { ConsentField, FieldError, Honeypot, NotConfiguredNotice, SubmitButton, TextAreaField, TextField, describe } from "./fields";
import { useValidatedForm } from "./useValidatedForm";

export function ContactForm() {
  const { state, pending, errors, summary, formRef, formAction, onSubmit, onBlur, clearError } = useValidatedForm(sendContactMessage, validateContact);

  if (state.status === "sent") {
    return (
      <div role="status" className="border-t border-black pt-8">
        <p className="font-serif text-4xl leading-tight text-burgundy">Message sent</p>
        <p className="mt-4 max-w-md text-stone">{state.message}</p>
      </div>
    );
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={onSubmit} onBlur={onBlur} noValidate className="relative space-y-9" aria-describedby="contact-status">
      <Honeypot />
      <div className="grid gap-9 sm:grid-cols-2 sm:gap-8">
        <TextField name="name" label="Full name" autoComplete="name" required maxLength={LIMITS.name} error={errors.name} />
        <TextField name="email" type="email" label="E-mail" autoComplete="email" inputMode="email" required maxLength={LIMITS.email} error={errors.email} />
      </div>
      <div className="grid gap-9 sm:grid-cols-2 sm:gap-8">
        <TextField name="phone" type="tel" label="Phone" optional autoComplete="tel" inputMode="tel" error={errors.phone} />
        <div>
          <label htmlFor="topic" className="field-label">
            Topic
          </label>
          <select id="topic" name="topic" defaultValue="" required className="field-input" onChange={() => clearError("topic")} {...describe("topic", errors.topic)}>
            <option value="" disabled>
              Choose a topic
            </option>
            {contactTopics.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <FieldError id="topic-error" message={errors.topic} />
        </div>
      </div>
      <TextAreaField
        name="message"
        label="Message"
        hint="Please don't describe health details here – we will talk about them at the consultation."
        required
        maxLength={LIMITS.message}
        rows={5}
        error={errors.message}
      />
      <div onChange={() => clearError("consent")}>
        <ConsentField error={errors.consent} />
      </div>

      <div id="contact-status" aria-live="polite" className="space-y-4">
        {summary && <p className="text-sm text-danger">{summary}</p>}
        {state.status === "error" && <p className="text-sm text-danger">{state.message}</p>}
        {state.status === "not_configured" && <NotConfiguredNotice what="Your message" />}
      </div>

      <SubmitButton pending={pending} label="Send message" pendingLabel="Sending…" />
    </form>
  );
}
