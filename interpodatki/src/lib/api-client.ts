/** Wywołanie API demonstracyjnego z jednolitą obsługą błędów sieci i odpowiedzi. */
export type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; status: number; message: string; errors?: Record<string, string> };

export async function postJson<T>(url: string, body: unknown): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      return {
        ok: false,
        status: res.status,
        message: json?.message ?? "Serwer zwrócił nieoczekiwaną odpowiedź. Spróbuj ponownie.",
        errors: json?.errors,
      };
    }
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, status: 0, message: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie." };
  }
}

export async function getJson<T>(url: string): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json().catch(() => null);
    if (!res.ok || !json?.ok) {
      return { ok: false, status: res.status, message: json?.message ?? "Nie udało się pobrać danych." };
    }
    return { ok: true, data: json as T };
  } catch {
    return { ok: false, status: 0, message: "Brak połączenia z serwerem. Sprawdź internet i spróbuj ponownie." };
  }
}
