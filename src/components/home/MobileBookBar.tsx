import Link from "next/link";

/** Pasek rezerwacji przyklejony do dołu ekranu na telefonach. */
export function MobileBookBar() {
  return (
    <div className="on-dark fixed inset-x-0 bottom-0 z-30 grid grid-cols-[1fr_auto] gap-2 border-t border-slate-line bg-graphite/95 px-4 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur md:hidden">
      <Link href="/rezerwacja" className="btn btn-primary">
        Zarezerwuj skuter
      </Link>
      <Link href="/#flota" className="btn btn-ghost text-white">
        Flota
      </Link>
    </div>
  );
}
