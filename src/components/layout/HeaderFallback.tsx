import Link from "next/link";
import { Logo } from "./Logo";

/** Statyczna wersja nagłówka wyświetlana, zanim wczyta się wersja interaktywna. */
export function HeaderFallback() {
  return (
    <header className="fixed inset-x-0 top-0 z-40 bg-gradient-to-b from-graphite/70 to-transparent text-white">
      <div className="wrap flex h-[4.5rem] items-center justify-between gap-6">
        <Logo />
        <Link href="/rezerwacja" className="btn btn-light btn-sm hidden sm:inline-flex">
          Zarezerwuj
        </Link>
      </div>
    </header>
  );
}
