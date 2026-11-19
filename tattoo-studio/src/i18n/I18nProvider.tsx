"use client";

import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { LOCALE_COOKIE, LOCALE_STORAGE_KEY, localizedPath, routeFromPath, type Locale, type RouteKey } from "./config";
import { DICTIONARIES, type Dictionary } from "./dictionaries";
import { pageTitle } from "./meta";

interface I18nContextValue {
  lang: Locale;
  t: Dictionary;
  route: RouteKey;
  setLang: (next: Locale) => void;
}

const I18nContext = createContext<I18nContextValue | null>(null);

/** Zapamiętanie wyboru: cookie (dla przekierowania przy kolejnej wizycie) i localStorage. */
function rememberLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; samesite=lax`;
  try {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  } catch {
    // brak dostępu do localStorage — cookie wystarczy
  }
}

/**
 * Kotwica przewijania: element z atrybutem `id` najbliżej górnej krawędzi widoku.
 * Teksty w innym języku mają inną długość, więc treść powyżej zmienia wysokość —
 * po przełączeniu przywracamy dokładną pozycję tego elementu.
 */
function findScrollAnchor(): { el: Element; top: number } | null {
  let best: { el: Element; top: number } | null = null;
  for (const el of document.querySelectorAll("main [id], footer [id]")) {
    const rect = el.getBoundingClientRect();
    if (rect.height === 0) continue;
    const contains = rect.top <= 0 && rect.bottom > 0;
    const visible = rect.top >= 0 && rect.top < window.innerHeight;
    if (!contains && !visible) continue;
    // Preferuj elementy widoczne najbliżej góry; w drugiej kolejności najmniejszy element obejmujący górną krawędź.
    const score = visible ? rect.top : window.innerHeight + rect.height;
    const bestScore = best ? (best.top >= 0 ? best.top : window.innerHeight + best.el.getBoundingClientRect().height) : Infinity;
    if (score < bestScore) best = { el, top: rect.top };
  }
  return best;
}

/**
 * Język strony. Przełączenie działa w miejscu: zmienia treści, <html lang>, tytuł i adres
 * (history.replaceState), bez przeładowania — formularz i pozycja przewinięcia zostają nietknięte.
 */
export function I18nProvider({ initialLang, children }: { initialLang: Locale; children: ReactNode }) {
  const [lang, setLangState] = useState<Locale>(initialLang);
  const pathname = usePathname();
  const route: RouteKey = routeFromPath(pathname ?? "/")?.route ?? "home";
  const [announcement, setAnnouncement] = useState("");
  const anchor = useRef<{ el: Element; top: number } | null>(null);

  // Po zmianie języka przywróć pozycję kotwicy — użytkownik zostaje dokładnie w tym samym miejscu.
  useLayoutEffect(() => {
    const saved = anchor.current;
    anchor.current = null;
    if (!saved || !saved.el.isConnected) return;
    const delta = saved.el.getBoundingClientRect().top - saved.top;
    if (Math.abs(delta) > 0.5) window.scrollTo({ top: window.scrollY + delta, behavior: "instant" });
  }, [lang]);

  // Nowa strona (nawigacja) przychodzi z własnym językiem z serwera.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronizacja z językiem nowej trasy
    setLangState(initialLang);
  }, [initialLang]);

  const setLang = useCallback(
    (next: Locale) => {
      rememberLocale(next);
      if (next === lang) return;
      anchor.current = findScrollAnchor();
      setLangState(next);
      document.documentElement.lang = next;
      document.title = pageTitle(DICTIONARIES[next], route);
      const target = localizedPath(route, next) + window.location.search + window.location.hash;
      window.history.replaceState(window.history.state, "", target);
      setAnnouncement(DICTIONARIES[next].common.language.changed);
    },
    [lang, route],
  );

  const value = useMemo(() => ({ lang, t: DICTIONARIES[lang], route, setLang }), [lang, route, setLang]);

  return (
    <I18nContext.Provider value={value}>
      {children}
      <p className="sr-only" role="status" aria-live="polite">
        {announcement}
      </p>
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const context = useContext(I18nContext);
  if (!context) throw new Error("useI18n must be used within I18nProvider");
  return context;
}
