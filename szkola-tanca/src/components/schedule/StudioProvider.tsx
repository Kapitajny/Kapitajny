"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { EMPTY_FILTERS, type ScheduleFilters } from "@/lib/schedule";

/** Dane, którymi inne sekcje mogą wstępnie wypełnić formularz zapisu. */
export interface TrialPrefill {
  style?: string;
  level?: string;
  day?: string;
  message?: string;
}

interface StudioContextValue {
  filters: ScheduleFilters;
  setFilters: (filters: ScheduleFilters) => void;
  /** Ustawia filtry grafiku i przewija do niego. */
  showSchedule: (filters: Partial<ScheduleFilters>) => void;
  prefill: (TrialPrefill & { nonce: number }) | null;
  /** Wypełnia formularz zapisu i przewija do niego. */
  requestTrial: (prefill: TrialPrefill) => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

/** Przewija do sekcji i przenosi na nią fokus (ważne dla czytników ekranu i klawiatury). */
export function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ block: "start" });
  const focusTarget = target.querySelector<HTMLElement>("[data-section-focus]") ?? target;
  focusTarget.focus({ preventScroll: true });
}

export function StudioProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<ScheduleFilters>(EMPTY_FILTERS);
  const [prefill, setPrefill] = useState<StudioContextValue["prefill"]>(null);

  const showSchedule = useCallback((next: Partial<ScheduleFilters>) => {
    setFilters({ ...EMPTY_FILTERS, ...next });
    requestAnimationFrame(() => scrollToSection("grafik"));
  }, []);

  const requestTrial = useCallback((next: TrialPrefill) => {
    setPrefill({ ...next, nonce: Date.now() });
    requestAnimationFrame(() => scrollToSection("zapis"));
  }, []);

  const value = useMemo(() => ({ filters, setFilters, showSchedule, prefill, requestTrial }), [filters, showSchedule, prefill, requestTrial]);
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio(): StudioContextValue {
  const context = useContext(StudioContext);
  if (!context) throw new Error("useStudio must be used within StudioProvider");
  return context;
}
