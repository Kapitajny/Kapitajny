"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import type { FormState } from "@/lib/form-state";
import { formToObject, type Errors, type Result } from "@/lib/validation";

type Action<K extends string> = (prev: FormState<K>, fd: FormData) => Promise<FormState<K>>;

/**
 * Form with browser-side validation in front of a Server Action.
 * – Fields are checked with the same rules the server uses; focus moves to the first invalid field.
 * – A flagged field updates while being corrected; a filled-in field is checked when it loses focus.
 * – Without JavaScript the form still posts and the server renders the errors.
 */
export function useFormFlow<K extends string>(action: Action<K>, validate: (input: Record<string, unknown>) => Result<unknown, K>) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState<K>);
  const [errors, setErrors] = useState<Errors<K>>(state.status === "invalid" ? state.errors : {});
  const [seen, setSeen] = useState(state);
  const formRef = useRef<HTMLFormElement>(null);

  if (seen !== state) {
    setSeen(state);
    if (state.status === "invalid") setErrors(state.errors);
  }

  useEffect(() => {
    if (state.status === "invalid") focusFirst(formRef.current, Object.keys(state.errors));
  }, [state]);

  /** Validates the whole form, or only `fields`; returns true when they are valid. */
  const check = (fields?: K[]) => {
    if (!formRef.current) return false;
    const all = validate(formToObject(new FormData(formRef.current))).errors;
    const relevant = fields ? (Object.fromEntries(Object.entries(all).filter(([k]) => fields.includes(k as K))) as Errors<K>) : all;
    setErrors((prev) => {
      const next = { ...prev };
      for (const f of fields ?? (Object.keys(prev) as K[])) delete next[f];
      return { ...next, ...relevant };
    });
    const keys = Object.keys(relevant);
    if (keys.length) focusFirst(formRef.current, keys);
    return keys.length === 0;
  };

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!check()) return;
    const fd = new FormData(event.currentTarget);
    startTransition(() => formAction(fd));
  };

  const fieldError = (name: K) => (formRef.current ? validate(formToObject(new FormData(formRef.current))).errors[name] : undefined);

  // A flagged field updates while it is being corrected, so the message disappears as soon as it's fixed.
  const onInput = (event: React.FormEvent<HTMLFormElement>) => {
    const name = (event.target as HTMLInputElement).name as K;
    if (name && errors[name]) setErrors((prev) => ({ ...prev, [name]: fieldError(name) }));
  };

  // A filled-in field is checked when it loses focus – unless focus moves to a button: the button checks
  // the whole form anyway, and changing the layout mid-click would make the click miss its target.
  const onBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    const t = event.target as unknown as HTMLInputElement;
    const name = t.name as K;
    if (!name || t.type === "checkbox" || t.type === "radio" || !t.value.trim()) return;
    if (event.relatedTarget instanceof HTMLButtonElement) return;
    setErrors((prev) => ({ ...prev, [name]: fieldError(name) }));
  };

  const clear = (name: K) => setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  return { state, pending, errors, formRef, formAction, submit, onBlur, onInput, clear, check };
}

function focusFirst(form: HTMLFormElement | null, names: string[]) {
  const el = Array.from(form?.elements ?? []).find((x) => names.includes((x as HTMLInputElement).name)) as HTMLElement | undefined;
  el?.focus();
}
