/** Wywołanie API z jednolitą obsługą błędów (format `{ error: { code, message, field? } }`). */
export type ApiResult<T> = { ok: true; data: T } | { ok: false; status: number; code: string; message: string; field?: string; data?: Record<string, unknown> };

export async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const response = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await response.json().catch(() => ({}));
    if (response.ok) return { ok: true, data: data as T };
    return {
      ok: false,
      status: response.status,
      code: data?.error?.code ?? "UNKNOWN",
      message: data?.error?.message ?? "Coś poszło nie tak. Spróbuj ponownie.",
      field: data?.error?.field,
      data,
    };
  } catch {
    return { ok: false, status: 0, code: "NETWORK", message: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie." };
  }
}
