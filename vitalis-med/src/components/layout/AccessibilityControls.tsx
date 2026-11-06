"use client";

import { useCallback, useSyncExternalStore } from "react";
import { A11Y_KEY as KEY } from "@/lib/a11y";

/**
 * Pasek dostępności (jak w serwisach placówek medycznych): powiększenie tekstu i wysoki kontrast.
 * Ustawienia zapisywane w localStorage i nakładane jako atrybuty na <html>.
 */
const EVENT = "vm-a11y-change";

type Prefs = { size: 0 | 1 | 2; contrast: boolean };
const DEFAULT: Prefs = { size: 0, contrast: false };
let cache: Prefs | null = null;

function read(): Prefs {
  if (cache) return cache;
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) || "null");
    cache = raw && typeof raw === "object" ? { size: [0, 1, 2].includes(raw.size) ? raw.size : 0, contrast: raw.contrast === true } : DEFAULT;
  } catch {
    cache = DEFAULT;
  }
  return cache!;
}

function apply(p: Prefs) {
  const html = document.documentElement;
  if (p.size) html.dataset.textSize = String(p.size);
  else delete html.dataset.textSize;
  if (p.contrast) html.dataset.contrast = "high";
  else delete html.dataset.contrast;
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  return () => window.removeEventListener(EVENT, cb);
}

export function AccessibilityControls() {
  const prefs = useSyncExternalStore(subscribe, read, () => DEFAULT);

  const set = useCallback((next: Prefs) => {
    cache = next;
    apply(next);
    try {
      window.localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // brak dostępu do pamięci – ustawienie działa do odświeżenia strony
    }
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const sizes: { v: Prefs["size"]; label: string; cls: string }[] = [
    { v: 0, label: "Tekst standardowy", cls: "text-[0.8rem]" },
    { v: 1, label: "Tekst powiększony", cls: "text-[0.95rem]" },
    { v: 2, label: "Tekst największy", cls: "text-[1.1rem]" },
  ];

  return (
    <div className="flex items-center gap-1" role="group" aria-label="Ustawienia dostępności">
      {sizes.map((s) => (
        <button
          key={s.v}
          type="button"
          onClick={() => set({ ...prefs, size: s.v })}
          aria-pressed={prefs.size === s.v}
          aria-label={s.label}
          className={`inline-flex h-8 min-w-8 items-center justify-center rounded-full px-1.5 font-semibold leading-none transition-colors ${s.cls} ${
            prefs.size === s.v ? "bg-ink text-white" : "text-ink hover:bg-fog"
          }`}
        >
          A
        </button>
      ))}
      <button
        type="button"
        onClick={() => set({ ...prefs, contrast: !prefs.contrast })}
        aria-pressed={prefs.contrast}
        aria-label="Wysoki kontrast"
        className={`ml-1 inline-flex h-8 w-8 items-center justify-center rounded-full transition-colors ${prefs.contrast ? "bg-ink text-white" : "text-ink hover:bg-fog"}`}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path d="M12 3a9 9 0 0 1 0 18z" fill="currentColor" />
        </svg>
      </button>
    </div>
  );
}
