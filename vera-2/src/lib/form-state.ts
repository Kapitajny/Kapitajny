import type { FieldErrors } from "./validation";

/** Wynik wysłania formularza – wspólny dla Server Actions i komponentów formularzy. */
export type FormState<K extends string> =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors<K> }
  | { status: "sent"; message: string }
  | { status: "not_configured" }
  | { status: "error"; message: string };
