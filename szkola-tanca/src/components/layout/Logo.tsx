import Link from "next/link";
import { siteConfig } from "@/config/site";

/** Znak marki: postać w ruchu narysowana jedną linią (głowa + łuk ramion i tułowia). */
export function LogoMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
      <circle cx="25.5" cy="7.5" r="3.4" fill="currentColor" />
      <path
        d="M5 15.5c6.5-3.6 13.6-4.2 18.6-.8 4.1 2.8 3.7 8.6-.6 11.7-3.6 2.6-8.5 3.3-9.2 7.6-.3 1.9.6 3.3 2.2 4.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
      <path d="M23.6 14.7c3.4-.9 7.2-2.9 10.4-6.4" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

interface LogoProps {
  tone?: "dark" | "light";
  className?: string;
}

export function Logo({ tone = "dark", className = "" }: LogoProps) {
  const light = tone === "light";
  return (
    <Link href="/" className={`group inline-flex min-h-11 items-center gap-2.5 ${className}`} aria-label={`${siteConfig.fullName} – strona główna`}>
      <LogoMark className={`h-9 w-9 shrink-0 ${light ? "text-blush" : "text-wine"}`} />
      <span className="flex flex-col leading-none">
        <span className={`text-[1.65rem] font-bold leading-none tracking-[-0.03em] [font-stretch:75%] ${light ? "text-ivory" : "text-cocoa"}`}>{siteConfig.name}</span>
        <span className={`mt-0.5 text-[0.8rem] font-medium leading-none ${light ? "text-blush" : "text-cocoa"}`}>studio tańca</span>
      </span>
    </Link>
  );
}
