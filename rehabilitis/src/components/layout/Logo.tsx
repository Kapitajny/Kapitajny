import Link from "next/link";
import { siteConfig } from "@/config/site";

/**
 * Znak REHABILITIS: łuk zakresu ruchu wokół punktu obrotu stawu –
 * prosty symbol odzyskiwania swobody ruchu. Wordmark pobierany z config/site.ts.
 */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path d="M4.5 24a11.5 11.5 0 0 1 23 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M16 24 22.4 13.6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="24" r="2.6" fill="currentColor" />
    </svg>
  );
}

export function Logo({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: () => void }) {
  const color = tone === "dark" ? "text-forest" : "text-paper";
  return (
    <Link href="/" onClick={onNavigate} className={`group inline-flex items-center gap-2.5 ${color}`} aria-label={`${siteConfig.name} – strona główna`}>
      <LogoMark className="h-8 w-8 shrink-0 transition-transform duration-500 group-hover:-rotate-12" />
      <span className="flex flex-col leading-none">
        <span className="font-serif text-[1.3rem] tracking-[0.12em]">{siteConfig.name}</span>
        <span className={`mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.2em] ${tone === "dark" ? "text-muted" : "text-paper/70"}`}>
          {siteConfig.descriptor}
        </span>
      </span>
    </Link>
  );
}
