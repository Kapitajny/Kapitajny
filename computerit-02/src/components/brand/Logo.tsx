/**
 * Znak ComputerIT odtworzony z logo: monitor z zaokrąglonymi narożnikami, kwadracik w prawym dolnym
 * rogu ekranu i podstawka. Wordmark „computerit” złożony krojem Inter Tight (jak w logo).
 */

export function LogoMark({ className = "", accent = false }: { className?: string; accent?: boolean }) {
  return (
    <svg viewBox="0 0 48 52" className={className} aria-hidden="true" focusable="false">
      <rect x="2.25" y="2.25" width="43.5" height="39" rx="6.5" fill="none" stroke="currentColor" strokeWidth="4.5" />
      <rect x="31.5" y="27.5" width="7.5" height="7.5" rx="1" fill={accent ? "var(--color-gold)" : "currentColor"} />
      <rect x="5.5" y="46.25" width="37" height="5" rx="2.5" fill="currentColor" />
    </svg>
  );
}

export function Logo({ className = "", accent = false }: { className?: string; accent?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-[0.55em] ${className}`}>
      <LogoMark className="h-[1.3em] w-auto shrink-0" accent={accent} />
      <span className="text-[1.15em] leading-none font-bold tracking-[-0.045em]">computerit</span>
    </span>
  );
}
