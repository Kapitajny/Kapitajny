import Link from "next/link";

/** VÉRA logotype – set in Bodoni Moda; the light version is used over burgundy and black. */
export function Logo({ light = false, onNavigate }: { light?: boolean; onNavigate?: () => void }) {
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="VÉRA Aesthetic Studio – home"
      className={`group inline-flex items-baseline gap-3 transition-colors duration-300 ${light ? "text-ivory" : "text-black"}`}
    >
      <span className="font-display text-[1.75rem] font-medium leading-none tracking-[0.04em]">VÉRA</span>
      <span className={`kicker hidden transition-colors duration-300 sm:inline ${light ? "text-rose-light" : "text-rose-deep"}`}>Aesthetic studio</span>
    </Link>
  );
}
