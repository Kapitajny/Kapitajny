"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import type { FormState } from "@/lib/form-state";
import { formDataToObject, type FieldErrors, type ValidationResult } from "@/lib/validation";

type Action<K extends string> = (prev: FormState<K>, formData: FormData) => Promise<FormState<K>>;

/**
 * A form validated in the browser and submitted to a Server Action.
 * – Before sending, fields are checked with the same rules as on the server.
 * – Errors appear next to the fields and focus moves to the first invalid one.
 * – Leaving a field refreshes its message (only for fields already filled in or invalid).
 * – Without JavaScript the form still works (action + server validation).
 */
export function useValidatedForm<K extends string>(action: Action<K>, validate: (input: Record<string, unknown>) => ValidationResult<unknown, K>) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState<K>);
  // Initialised from the action result – without JavaScript the server renders the page with errors.
  const [errors, setErrors] = useState<FieldErrors<K>>(state.status === "invalid" ? state.errors : {});
  const [summary, setSummary] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const pointerDown = useRef(false);

  useEffect(() => {
    const down = () => (pointerDown.current = true);
    const up = () => (pointerDown.current = false);
    window.addEventListener("pointerdown", down, true);
    window.addEventListener("pointerup", up, true);
    window.addEventListener("pointercancel", up, true);
    return () => {
      window.removeEventListener("pointerdown", down, true);
      window.removeEventListener("pointerup", up, true);
      window.removeEventListener("pointercancel", up, true);
    };
  }, []);

  // Server-side errors are adopted during render (state derived from the previous value).
  const [handledState, setHandledState] = useState(state);
  if (handledState !== state) {
    setHandledState(state);
    if (state.status === "invalid") setErrors(state.errors);
  }

  useEffect(() => {
    if (state.status === "invalid") focusFirstInvalid(formRef.current, Object.keys(state.errors));
    if (state.status === "sent") formRef.current?.reset();
  }, [state]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const result = validate(formDataToObject(formData));
    const keys = Object.keys(result.errors);
    setErrors(result.errors);
    if (keys.length) {
      setSummary(keys.length === 1 ? "Popraw zaznaczone pole formularza." : `Popraw zaznaczone pola formularza (${keys.length}).`);
      focusFirstInvalid(event.currentTarget, keys);
      return;
    }
    setSummary("");
    startTransition(() => formAction(formData));
  };

  const onBlur = (event: React.FocusEvent<HTMLFormElement>) => {
    const target = event.target as unknown as HTMLInputElement;
    const name = target.name as K;
    if (!name || !formRef.current) return;
    const hasValue = target.type === "checkbox" || target.type === "radio" ? false : Boolean(target.value.trim());
    if (!hasValue && !errors[name]) return;
    const result = validate(formDataToObject(new FormData(formRef.current)));
    const apply = () => setErrors((prev) => ({ ...prev, [name]: result.errors[name] }));
    // Pole traci fokus już przy wciśnięciu przycisku myszy w innym miejscu. Pokazanie lub ukrycie komunikatu w tej chwili
    // przesuwa układ pod kursorem i kliknięcie (np. w zgodę) chybia – dlatego czekamy na koniec kliknięcia.
    if (pointerDown.current) window.addEventListener("pointerup", () => setTimeout(apply, 0), { once: true });
    else apply();
  };

  /** Clears a field's error once its value changes (e.g. the consent box is ticked). */
  const clearError = (name: K) => setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  return { state, pending, errors, summary, formRef, formAction, onSubmit, onBlur, clearError };
}

function focusFirstInvalid(form: HTMLFormElement | null, names: string[]) {
  if (!form) return;
  const fields = Array.from(form.elements) as HTMLElement[];
  const first = fields.find((el) => names.includes((el as HTMLInputElement).name));
  first?.focus();
}
