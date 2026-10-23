"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useId, useState } from "react";
import { postJson } from "@/lib/api-client";
import { validateEmail, validateName, validatePassword } from "@/lib/validation";

type Mode = "login" | "register" | "forgot" | "reset";
type Status = { kind: "idle" | "sending" } | { kind: "error"; message: string; field?: string } | { kind: "done"; message: string };

const SUBMIT_LABEL: Record<Mode, string> = {
  login: "Zaloguj się",
  register: "Załóż konto",
  forgot: "Wyślij link",
  reset: "Ustaw nowe hasło",
};

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const params = useSearchParams();
  const id = useId();
  const [values, setValues] = useState({ firstName: "", email: "", password: "", acceptTerms: false });
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const token = params.get("token") ?? "";

  const set = (key: keyof typeof values, value: string | boolean) => setValues((v) => ({ ...v, [key]: value }));
  const fieldError = (field: string) => (status.kind === "error" && status.field === field ? status.message : undefined);

  const localError = (): { field: string; message: string } | null => {
    if (mode === "register") {
      const e = validateName(values.firstName, "imię");
      if (e) return { field: "firstName", message: e };
    }
    if (mode !== "reset") {
      const e = validateEmail(values.email);
      if (e) return { field: "email", message: e };
    }
    if (mode === "login" && !values.password) return { field: "password", message: "Podaj hasło." };
    if (mode === "register" || mode === "reset") {
      const e = validatePassword(values.password);
      if (e) return { field: "password", message: e };
    }
    if (mode === "register" && !values.acceptTerms) return { field: "acceptTerms", message: "Zaakceptuj regulamin, aby założyć konto." };
    return null;
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const error = localError();
    if (error) {
      setStatus({ kind: "error", ...error });
      document.getElementById(`${id}-${error.field}`)?.focus();
      return;
    }
    setStatus({ kind: "sending" });
    const body =
      mode === "register"
        ? { firstName: values.firstName, email: values.email, password: values.password, acceptTerms: values.acceptTerms }
        : mode === "login"
          ? { email: values.email, password: values.password }
          : mode === "forgot"
            ? { email: values.email }
            : { token, password: values.password };
    const result = await postJson<{ message?: string }>(`/api/auth/${mode}`, body);
    if (!result.ok) {
      setStatus({ kind: "error", message: result.message, field: result.field });
      return;
    }
    if (mode === "login" || mode === "register") {
      const next = params.get("next");
      router.push(next && next.startsWith("/") && !next.startsWith("//") ? next : "/konto");
      router.refresh();
      return;
    }
    setStatus({ kind: "done", message: result.data.message ?? "Gotowe." });
  };

  if (mode === "reset" && !token) {
    return (
      <p className="text-muted">
        Ten link jest niepełny.{" "}
        <Link href="/odzyskiwanie-hasla" className="link text-paper">
          Poproś o nowy link
        </Link>
        .
      </p>
    );
  }

  if (status.kind === "done") {
    return (
      <div role="status">
        <p className="text-lg">{status.message}</p>
        <Link href="/logowanie" className="btn btn-light mt-8">
          Przejdź do logowania
        </Link>
      </div>
    );
  }

  const input = (field: "firstName" | "email" | "password", label: string, props: React.InputHTMLAttributes<HTMLInputElement>, hint?: string) => {
    const error = fieldError(field);
    return (
      <div>
        <label htmlFor={`${id}-${field}`} className="field-label">
          {label}
        </label>
        <input
          id={`${id}-${field}`}
          className="field"
          value={values[field]}
          onChange={(e) => set(field, e.target.value)}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-${field}-error` : hint ? `${id}-${field}-hint` : undefined}
          {...props}
        />
        {error ? (
          <p id={`${id}-${field}-error`} className="field-error">
            {error}
          </p>
        ) : (
          hint && (
            <p id={`${id}-${field}-hint`} className="field-hint">
              {hint}
            </p>
          )
        )}
      </div>
    );
  };

  const generalError = status.kind === "error" && !status.field ? status.message : null;

  return (
    <form onSubmit={submit} noValidate className="grid gap-5">
      {mode === "register" && input("firstName", "Imię", { autoComplete: "given-name" })}
      {mode !== "reset" && input("email", "E-mail", { type: "email", autoComplete: "email" })}
      {mode !== "forgot" &&
        input(
          "password",
          mode === "reset" ? "Nowe hasło" : "Hasło",
          { type: "password", autoComplete: mode === "login" ? "current-password" : "new-password" },
          mode === "login" ? undefined : "Co najmniej 10 znaków, w tym litera i cyfra.",
        )}
      {mode === "register" && (
        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-muted">
            <input
              id={`${id}-acceptTerms`}
              type="checkbox"
              className="check"
              checked={values.acceptTerms}
              onChange={(e) => set("acceptTerms", e.target.checked)}
              aria-invalid={Boolean(fieldError("acceptTerms"))}
            />
            <span>
              Akceptuję{" "}
              <Link href="/regulamin" className="link text-paper">
                regulamin
              </Link>{" "}
              i{" "}
              <Link href="/polityka-prywatnosci" className="link text-paper">
                politykę prywatności
              </Link>
              .
            </span>
          </label>
          {fieldError("acceptTerms") && <p className="field-error">{fieldError("acceptTerms")}</p>}
        </div>
      )}
      {generalError && (
        <p role="alert" className="text-sm text-danger">
          {generalError}
        </p>
      )}
      <button type="submit" className="btn btn-light btn-block" disabled={status.kind === "sending"}>
        {status.kind === "sending" ? "Chwileczkę…" : SUBMIT_LABEL[mode]}
      </button>
    </form>
  );
}
