import { useId } from "react";

/**
 * Flagi języków jako SVG (emoji flag nie wyświetlają się w Windows).
 * Polski – flaga Polski, angielski – flaga Wielkiej Brytanii.
 */
export function Flag({ country, className = "" }: { country: "pl" | "gb"; className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  if (country === "pl") {
    return (
      <svg className={className} viewBox="0 0 21 14" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
        <rect width="21" height="7" fill="#FFFFFF" />
        <rect y="7" width="21" height="7" fill="#DC143C" />
      </svg>
    );
  }

  return (
    <svg className={className} viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <clipPath id={`${id}-s`}>
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id={`${id}-t`}>
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath={`url(#${id}-s)`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath={`url(#${id}-t)`} stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}
