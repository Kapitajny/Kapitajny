"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";

export interface ApiResult<T> {
  ok: boolean;
  status: number;
  data: T | null;
  error: { code: string; message: string; fields?: Record<string, string>; field?: string } | null;
}

const UnauthorizedContext = createContext<() => void>(() => {});
export const UnauthorizedProvider = UnauthorizedContext.Provider;

/** Wywołanie API panelu z obsługą wygasłej sesji. */
export function useApi() {
  const onUnauthorized = useContext(UnauthorizedContext);
  return useCallback(
    async <T,>(path: string, init?: RequestInit & { json?: unknown }): Promise<ApiResult<T>> => {
      try {
        const res = await fetch(path, {
          ...init,
          headers: init?.json !== undefined ? { "content-type": "application/json", ...init?.headers } : init?.headers,
          body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body,
          cache: "no-store",
        });
        const body = await res.json().catch(() => null);
        if (res.status === 401) onUnauthorized();
        return { ok: res.ok, status: res.status, data: res.ok ? (body as T) : null, error: res.ok ? null : (body?.error ?? { code: "error", message: "Coś poszło nie tak." }) };
      } catch {
        return { ok: false, status: 0, data: null, error: { code: "network", message: "Brak połączenia z serwerem." } };
      }
    },
    [onUnauthorized],
  );
}

export function PanelHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        <h1 className="font-display text-5xl font-extrabold uppercase leading-none">{title}</h1>
        {description && <p className="mt-2 max-w-2xl text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Notice({ tone = "info", children }: { tone?: "info" | "error" | "success" | "warn"; children: ReactNode }) {
  const styles = {
    info: "border-graphite bg-sand",
    error: "border-danger bg-[#fdecea] text-[#7a1a14]",
    success: "border-success bg-[#e6f4ec] text-[#14462f]",
    warn: "border-warn bg-[#fdf3dd] text-[#5c3c00]",
  }[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`border-l-4 px-4 py-3 ${styles}`}>
      {children}
    </div>
  );
}

export function Field({ id, label, hint, error, children, className = "" }: { id: string; label: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      {children}
      {hint && !error && <p className="mt-1 text-sm text-muted">{hint}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

/** Krótki komunikat po zapisie, znika po kilku sekundach. */
export function useFlash() {
  const [flash, setFlash] = useState<{ tone: "success" | "error"; text: string } | null>(null);
  const show = useCallback((tone: "success" | "error", text: string) => {
    setFlash({ tone, text });
    window.setTimeout(() => setFlash((f) => (f?.text === text ? null : f)), 4000);
  }, []);
  const node = flash ? <Notice tone={flash.tone}>{flash.text}</Notice> : null;
  return [node, show] as const;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "warn" | "success" | "danger" | "info" }) {
  const styles = {
    neutral: "bg-[#eef1f3] text-graphite",
    warn: "bg-[#fdf3dd] text-[#5c3c00]",
    success: "bg-[#e6f4ec] text-[#14462f]",
    danger: "bg-[#fdecea] text-[#7a1a14]",
    info: "bg-[#ddf3f4] text-[#00474d]",
  }[tone];
  return <span className={`inline-block whitespace-nowrap px-2 py-0.5 text-sm font-semibold ${styles}`}>{children}</span>;
}
