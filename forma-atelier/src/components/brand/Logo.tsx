type Props = { className?: string; mark?: boolean };

/** Sygnet: łuk — najprostszy element architektury, powracający w realizacjach pracowni. */
export function ArchMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 28" fill="none" aria-hidden="true" className={className}>
      <path d="M1.5 27V10a8.5 8.5 0 0 1 17 0v17" stroke="currentColor" strokeWidth="1.25" />
      <path d="M6.5 27V11.5a3.5 3.5 0 0 1 7 0V27" stroke="currentColor" strokeWidth="1.25" />
      <path d="M0 27.4h20" stroke="currentColor" strokeWidth="1.25" />
    </svg>
  );
}

export function Logo({ className = "", mark = true }: Props) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {mark && <ArchMark className="h-7 w-5 shrink-0" />}
      <span className="font-serif text-[1.0625rem] leading-none font-medium tracking-[0.26em] whitespace-nowrap uppercase">
        Forma Atelier
      </span>
    </span>
  );
}
