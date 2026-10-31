/** Logo NOVELIA ZDROWIE – znak (gałązka) + rozstrzelony napis. */
export function Logo({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const color = tone === "dark" ? "var(--color-forest)" : "var(--color-cream)";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} style={{ color }}>
      <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
        <circle cx="16" cy="16" r="15" stroke="var(--color-gold)" strokeWidth="1" />
        <path d="M16 25V9" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        <path d="M16 15c-3.8-.4-6-2.6-6.4-6 3.6.2 5.9 2.3 6.4 6Z" fill="currentColor" />
        <path d="M16 19.5c3.8-.4 6-2.6 6.4-6-3.6.2-5.9 2.3-6.4 6Z" fill="currentColor" />
        <path d="M16 23c-2.6-.3-4.1-1.8-4.4-4.1 2.5.1 4 1.6 4.4 4.1Z" fill="currentColor" opacity=".75" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-sans text-[0.82rem] font-medium tracking-[0.38em]">NOVELIA</span>
        <span className="mt-1 font-sans text-[0.6rem] font-medium tracking-[0.5em] opacity-80">ZDROWIE</span>
      </span>
    </span>
  );
}
