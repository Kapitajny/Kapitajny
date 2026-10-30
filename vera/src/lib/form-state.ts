import type { FieldErrors } from "./validation";

/** Result of a form submission – shared by Server Actions and the form components. */
export type FormState<K extends string> =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors<K> }
  | { status: "sent"; message: string }
  | { status: "not_configured" }
  | { status: "error"; message: string };
