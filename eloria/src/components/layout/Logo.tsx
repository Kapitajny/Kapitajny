import Image from "next/image";
import Link from "next/link";
import wordmark from "../../../public/brand/eloria-wordmark.png";
import wordmarkLight from "../../../public/brand/eloria-wordmark-light.png";

/** Znak słowny ÉLORIA (z logo marki) – link do strony głównej. */
export function Logo({ tone = "dark", className = "", onNavigate }: { tone?: "dark" | "light"; className?: string; onNavigate?: () => void }) {
  return (
    <Link href="/" onClick={onNavigate} className={`inline-flex shrink-0 items-center ${className}`} aria-label="ÉLORIA Aesthetic Medical Clinic – strona główna">
      <Image src={tone === "dark" ? wordmark : wordmarkLight} alt="" sizes="160px" className="h-[1.375rem] w-auto sm:h-6" preload />
    </Link>
  );
}
