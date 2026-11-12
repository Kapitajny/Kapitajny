"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { Jetski } from "@/lib/rental";
import { Logo } from "@/components/layout/Logo";
import { BlocksView } from "./BlocksView";
import { BookingsView } from "./BookingsView";
import { CalendarView } from "./CalendarView";
import { CustomersView } from "./CustomersView";
import { Dashboard } from "./Dashboard";
import { FleetView } from "./FleetView";
import { HoursView } from "./HoursView";
import { PricesView } from "./PricesView";
import { SettingsView } from "./SettingsView";
import { UnauthorizedProvider, useApi } from "./ui";

const TABS = [
  { id: "pulpit", label: "Pulpit" },
  { id: "rezerwacje", label: "Rezerwacje" },
  { id: "kalendarz", label: "Kalendarz" },
  { id: "flota", label: "Flota" },
  { id: "ceny", label: "Ceny i kaucje" },
  { id: "klienci", label: "Klienci" },
  { id: "blokady", label: "Blokady terminów" },
  { id: "godziny", label: "Godziny otwarcia" },
  { id: "ustawienia", label: "Ustawienia" },
] as const;
export type TabId = (typeof TABS)[number]["id"];

export function AdminApp() {
  const router = useRouter();
  const [tab, setTab] = useState<TabId>("pulpit");
  const [expired, setExpired] = useState(false);
  const onUnauthorized = useCallback(() => setExpired(true), []);

  useEffect(() => {
    const read = () => {
      const id = window.location.hash.slice(1) as TabId;
      if (TABS.some((t) => t.id === id)) setTab(id);
    };
    read();
    window.addEventListener("hashchange", read);
    return () => window.removeEventListener("hashchange", read);
  }, []);

  const go = (id: TabId) => {
    setTab(id);
    history.replaceState(null, "", `#${id}`);
    window.scrollTo({ top: 0 });
  };

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <UnauthorizedProvider value={onUnauthorized}>
      <div className="min-h-dvh bg-[#f7f8f9] lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="on-dark bg-graphite text-white lg:sticky lg:top-0 lg:h-dvh">
          <div className="flex items-center justify-between gap-4 px-5 py-5">
            <Logo compact />
            <span className="text-sm text-white/60">Panel</span>
          </div>
          <nav aria-label="Sekcje panelu" className="scrollbar-none overflow-x-auto px-3 pb-3 lg:overflow-visible">
            <ul className="flex gap-1 lg:flex-col">
              {TABS.map((t) => (
                <li key={t.id}>
                  <button
                    type="button"
                    onClick={() => go(t.id)}
                    aria-current={tab === t.id ? "page" : undefined}
                    className={`w-full whitespace-nowrap px-3 py-2.5 text-left font-semibold transition-colors ${tab === t.id ? "bg-white text-graphite" : "text-white/80 hover:bg-slate hover:text-white"}`}
                  >
                    {t.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden gap-2 px-5 py-6 lg:grid">
            <Link href="/" className="link text-white/75" target="_blank">
              Zobacz stronę
            </Link>
            <button type="button" onClick={logout} className="link text-left text-white/75">
              Wyloguj się
            </button>
          </div>
        </aside>
        <main className="on-light min-w-0 px-5 py-8 md:px-10 md:py-10">
          {expired && (
            <div className="mb-6 flex flex-wrap items-center gap-4 border-l-4 border-danger bg-[#fdecea] px-4 py-3" role="alert">
              <span>Sesja wygasła. Zaloguj się ponownie, żeby zapisać zmiany.</span>
              <button type="button" className="btn btn-sm" onClick={() => router.refresh()}>
                Zaloguj ponownie
              </button>
            </div>
          )}
          <Views tab={tab} go={go} />
          <div className="mt-12 flex gap-6 border-t border-line pt-6 lg:hidden">
            <Link href="/" className="link">
              Zobacz stronę
            </Link>
            <button type="button" onClick={logout} className="link">
              Wyloguj się
            </button>
          </div>
        </main>
      </div>
    </UnauthorizedProvider>
  );
}

function Views({ tab, go }: { tab: TabId; go: (t: TabId) => void }) {
  const api = useApi();
  const [jetskis, setJetskis] = useState<Jetski[] | null>(null);
  const reload = useCallback(async () => {
    const r = await api<{ jetskis: Jetski[] }>("/api/admin/jetskis");
    if (r.data) setJetskis(r.data.jetskis);
  }, [api]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- pierwsze pobranie danych floty
    void reload();
  }, [reload]);

  if (!jetskis) return <p className="text-muted">Ładowanie…</p>;
  switch (tab) {
    case "pulpit":
      return <Dashboard jetskis={jetskis} go={go} />;
    case "rezerwacje":
      return <BookingsView />;
    case "kalendarz":
      return <CalendarView jetskis={jetskis} />;
    case "flota":
      return <FleetView jetskis={jetskis} reload={reload} />;
    case "ceny":
      return <PricesView jetskis={jetskis} reload={reload} />;
    case "klienci":
      return <CustomersView />;
    case "blokady":
      return <BlocksView jetskis={jetskis} />;
    case "godziny":
      return <HoursView />;
    case "ustawienia":
      return <SettingsView />;
  }
}
