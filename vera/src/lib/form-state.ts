import type { Errors } from "./validation";

/** Outcome of a form submission, shared by Server Actions and form components. */
export type FormState<K extends string> =
  | { status: "idle" }
  | { status: "invalid"; errors: Errors<K> }
  | { status: "sent"; message: string }
  | { status: "not_configured" }
  | { status: "error"; message: string };
