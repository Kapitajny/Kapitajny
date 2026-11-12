"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/layout/Logo";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const password = new FormData(e.currentTarget).get("password");
    try {
      const res = await fetch("/api/admin/login", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ password }) });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error?.message ?? "Nie udało się zalogować.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nie udało się zalogować.");
      setBusy(false);
    }
  }

  return (
    <div className="on-dark grid min-h-dvh place-items-center bg-graphite px-5 text-white">
      <form onSubmit={submit} className="w-full max-w-sm">
        <Logo />
        <h1 className="mt-10 font-display text-5xl font-extrabold uppercase">Panel obsługi</h1>
        <span className="wake mt-3 w-[90%]" aria-hidden="true" />
        <label htmlFor="password" className="field-label mt-10">
          Hasło
        </label>
        <input id="password" name="password" type="password" autoComplete="current-password" required className="field" autoFocus aria-invalid={!!error} aria-describedby={error ? "login-err" : undefined} />
        {error && (
          <p id="login-err" role="alert" className="field-error">
            {error}
          </p>
        )}
        <button type="submit" className="btn btn-primary mt-6 w-full" disabled={busy}>
          {busy ? "Logowanie…" : "Zaloguj się"}
        </button>
      </form>
    </div>
  );
}
