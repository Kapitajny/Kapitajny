"use client";

import { startTransition, useActionState, useEffect, useRef, useState } from "react";
import type { FormState } from "@/lib/form-state";
import { formDataToObject, type FieldErrors, type ValidationResult } from "@/lib/validation";

type Action<K extends string> = (prev: FormState<K>, formData: FormData) => Promise<FormState<K>>;

/**
 * Formularz z walidacją po stronie przeglądarki i Server Action.
 * – Przed wysłaniem pola są sprawdzane tymi samymi regułami co na serwerze.
 * – Błędy pojawiają się przy polach, a fokus trafia do pierwszego błędnego pola.
 * – Po opuszczeniu pola komunikat aktualizuje się na bieżąco (tylko dla pól już wypełnianych lub błędnych).
 * – Bez JavaScriptu formularz nadal działa (action + walidacja serwerowa).
 */
export function useValidatedForm<K extends string>(action: Action<K>, validate: (input: Record<string, unknown>) => ValidationResult<unknown, K>) {
  const [state, formAction, pending] = useActionState(action, { status: "idle" } as FormState<K>);
  // Inicjalizacja z wyniku akcji – bez JavaScriptu serwer renderuje stronę od razu z błędami.
  const [errors, setErrors] = useState<FieldErrors<K>>(state.status === "invalid" ? state.errors : {});
  const [summary, setSummary] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  // Błędy zwrócone przez serwer przejmujemy w trakcie renderowania (wzorzec „stan zależny od poprzedniej wartości”).
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
      setSummary(keys.length === 1 ? "Popraw zaznaczone pole formularza." : `Popraw ${keys.length} zaznaczone pola formularza.`);
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
    setErrors((prev) => ({ ...prev, [name]: result.errors[name] }));
  };

  /** Usuwa komunikat błędu pola po zmianie wartości (np. zaznaczeniu zgody). */
  const clearError = (name: K) => setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev));

  return { state, pending, errors, summary, formRef, formAction, onSubmit, onBlur, clearError };
}

function focusFirstInvalid(form: HTMLFormElement | null, names: string[]) {
  if (!form) return;
  const fields = Array.from(form.elements) as HTMLElement[];
  const first = fields.find((el) => names.includes((el as HTMLInputElement).name));
  first?.focus();
}
