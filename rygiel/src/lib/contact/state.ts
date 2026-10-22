import type { FieldErrors } from "./schema";

export type ContactFormState =
  | { status: "idle" }
  | { status: "invalid"; errors: FieldErrors; message: string }
  | { status: "rejected"; message: string }
  | { status: "rate-limited"; message: string }
  | { status: "failed"; message: string }
  | { status: "demo"; submittedAt: number }
  | { status: "sent"; submittedAt: number };

export const initialContactState: ContactFormState = { status: "idle" };
