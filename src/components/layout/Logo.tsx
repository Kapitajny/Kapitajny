import Link from "next/link";

/**
 * Znak NOIR COFFEE: okrąg przecięty łukiem – jednocześnie ziarno kawy
 * i księżyc w nowiu (noir). Wordmark w kroju szeryfowym.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <circle cx="16" cy="16" r="14.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 1.75a14.25 14.25 0 0 1 0 28.5c-4.6-3.4-6.6-8.3-6.6-14.25S11.4 5.15 16 1.75Z" fill="currentColor" />
    </svg>
  );
}

export function Logo({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: () => void }) {
  const color = tone === "dark" ? "text-roast" : "text-paper";
  return (
    <Link href="/" onClick={onNavigate} className={`group inline-flex items-center gap-3 ${color}`} aria-label="NOIR COFFEE – strona główna">
      <LogoMark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[20deg]" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.45rem] tracking-[0.08em]">NOIR</span>
        <span className="mt-1 text-[0.58rem] font-semibold tracking-[0.42em] opacity-70">COFFEE · GDAŃSK</span>
      </span>
    </Link>
  );
}
