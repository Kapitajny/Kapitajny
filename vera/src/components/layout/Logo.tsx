import Link from "next/link";

/** VÉRA wordmark. The acute accent is drawn as a short rose stroke – the brand's one graphic mark. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-flex items-baseline font-serif font-medium leading-none tracking-[0.2em] ${className}`}>
      V<span className="relative">E<span aria-hidden="true" className="absolute left-[0.12em] top-[0.06em] h-[0.075em] w-[0.38em] -rotate-[28deg] bg-current" /></span>RA
    </span>
  );
}

export function Logo({ onNavigate, className = "" }: { onNavigate?: () => void; className?: string }) {
  return (
    <Link href="/" onClick={onNavigate} className={`group inline-flex flex-col items-start gap-1.5 ${className}`} aria-label="VÉRA Aesthetic Studio – home">
      <Wordmark className="text-[1.75rem] sm:text-[2rem]" />
      <span aria-hidden="true" className="pl-[0.1em] text-[0.625rem] font-medium tracking-[0.32em] opacity-80">
        AESTHETIC STUDIO
      </span>
    </Link>
  );
}
