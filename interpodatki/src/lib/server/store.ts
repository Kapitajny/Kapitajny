import "server-only";

/**
 * Magazyn demonstracyjny w pamięci procesu serwera.
 *
 * - dane znikają po restarcie serwera i wygasają po `TTL_MS`,
 * - nic nie jest zapisywane na dysku ani w przeglądarce,
 * - w wdrożeniu produkcyjnym należy go zastąpić bazą danych z kontrolą dostępu (patrz README).
 */
const TTL_MS = 6 * 60 * 60 * 1000;
const MAX_ENTRIES = 2000;

type Entry<T> = { value: T; expiresAt: number };

export class MemoryCollection<T> {
  private readonly items = new Map<string, Entry<T>>();

  set(id: string, value: T): T {
    this.prune();
    if (this.items.size >= MAX_ENTRIES) {
      const oldest = this.items.keys().next().value;
      if (oldest !== undefined) this.items.delete(oldest);
    }
    this.items.set(id, { value, expiresAt: Date.now() + TTL_MS });
    return value;
  }

  get(id: string): T | undefined {
    const entry = this.items.get(id);
    if (!entry) return undefined;
    if (entry.expiresAt < Date.now()) {
      this.items.delete(id);
      return undefined;
    }
    return entry.value;
  }

  filter(predicate: (value: T) => boolean): T[] {
    this.prune();
    return [...this.items.values()].map((e) => e.value).filter(predicate);
  }

  private prune() {
    const now = Date.now();
    for (const [id, entry] of this.items) if (entry.expiresAt < now) this.items.delete(id);
  }
}

// Wspólna instancja przetrwa przeładowania modułów w trybie deweloperskim.
const globalStore = globalThis as typeof globalThis & { __interpodatkiStore?: Map<string, MemoryCollection<unknown>> };
globalStore.__interpodatkiStore ??= new Map();

export function collection<T>(name: string): MemoryCollection<T> {
  const map = globalStore.__interpodatkiStore!;
  if (!map.has(name)) map.set(name, new MemoryCollection<T>());
  return map.get(name) as MemoryCollection<T>;
}

export function publicNumber(prefix: string): string {
  const year = new Date().getFullYear();
  const random = crypto.getRandomValues(new Uint32Array(1))[0].toString(36).toUpperCase().padStart(7, "0").slice(-7);
  return `${prefix}-${year}-${random}`;
}

/** Maskuje adres e-mail – w magazynie demo nie trzymamy pełnych danych kontaktowych dłużej niż to konieczne. */
export function maskEmail(email: string): string {
  const [user, domain] = email.split("@");
  if (!domain) return "***";
  return `${user.slice(0, 1)}***@${domain}`;
}
