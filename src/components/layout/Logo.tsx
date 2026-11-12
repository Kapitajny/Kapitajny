import Link from "next/link";

export function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <Link href="/" className={`font-display text-[1.6rem] font-black uppercase leading-none tracking-[0.02em] ${className}`} aria-label="MOLO Jet Club – strona główna">
      MOLO<span className="text-turq">/</span>
      {compact ? "JET" : "JET CLUB"}
    </Link>
  );
}
