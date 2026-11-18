/**
 * Znak PULSO: trzy paski emisji w rytmie pulsu (krótki – długi – średni), przecięte playheadem.
 * Odczytuje się jako fragment planu mediowego i jako rytm „pulsu”.
 */
export function LogoMark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
      fill="currentColor"
    >
      <rect x="2" y="5" width="13" height="5.5" rx="1.5" />
      <rect x="7" y="13.25" width="23" height="5.5" rx="1.5" />
      <rect x="2" y="21.5" width="18" height="5.5" rx="1.5" />
      <rect x="22.25" y="2" width="2.5" height="28" rx="1.25" />
    </svg>
  );
}

export function Logo({ className = "", tone = "ink" }: { className?: string; tone?: "ink" | "paper" }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${tone === "paper" ? "text-paper" : "text-ink"} ${className}`}>
      <LogoMark className="h-7 w-7 shrink-0" />
      <span
        className="text-[1.375rem] leading-none font-[820] tracking-[-0.02em]"
        style={{ fontVariationSettings: '"wdth" 125' }}
      >
        PULSO
      </span>
    </span>
  );
}
