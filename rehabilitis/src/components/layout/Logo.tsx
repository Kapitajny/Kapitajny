import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Znak REHABILITIS: łuk zakresu ruchu wokół punktu obrotu stawu. Nazwa pobierana z config/site.ts. */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <rect width="32" height="32" rx="6" fill="currentColor" />
      <path d="M7 23a9 9 0 0 1 18 0" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 23 21 15" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="23" r="2.4" fill="#dce7de" />
    </svg>
  );
}

export function Logo({ tone = "dark", onNavigate }: { tone?: "dark" | "light"; onNavigate?: () => void }) {
  const dark = tone === "dark";
  return (
    <Link href="/" onClick={onNavigate} className="inline-flex items-center gap-3" aria-label={`${siteConfig.name} – strona główna`}>
      <LogoMark className={`h-9 w-9 shrink-0 ${dark ? "text-forest" : "text-white/15"}`} />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.2rem] font-bold tracking-[0.04em] ${dark ? "text-forest" : "text-white"}`}>{siteConfig.name}</span>
        <span className={`mt-1 whitespace-nowrap text-[0.78rem] ${dark ? "text-muted" : "text-white/75"}`}>{siteConfig.descriptor}</span>
      </span>
    </Link>
  );
}
