import Link from "next/link";

/** Logotyp koncepcji 2: „Véra” miękką kursywą, pod spodem nazwa studia drobnym, rozstrzelonym pismem. */
export function Wordmark({ className = "" }: { className?: string }) {
  return <span className={`script leading-none ${className}`}>Véra</span>;
}

export function Logo({ onNavigate, className = "" }: { onNavigate?: () => void; className?: string }) {
  return (
    <Link href="/" onClick={onNavigate} className={`inline-flex flex-col items-start ${className}`} aria-label="VÉRA Aesthetic Studio – strona główna">
      <Wordmark className="text-[2.1rem] sm:text-[2.4rem]" />
      <span aria-hidden="true" className="-mt-0.5 pl-0.5 text-[0.7rem] font-normal tracking-[0.28em] opacity-80">
        aesthetic studio
      </span>
    </Link>
  );
}
