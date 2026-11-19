import type { NavIcon } from "@/config/site";

/** Ikony doku rysowane jedną, cienką linią — jak szkic pędzelkiem. */
export function DockIcon({ name, className = "" }: { name: NavIcon | "book"; className?: string }) {
  const common = {
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      {name === "torii" && (
        <g {...common}>
          <path d="M3 5.5c3 .9 15 .9 18 0" />
          <path d="M5 8.5h14" />
          <path d="M7 6.3V20M17 6.3V20M12 8.5v-2.4" />
        </g>
      )}
      {name === "frames" && (
        <g {...common}>
          <rect x="3.5" y="3.5" width="7" height="10" />
          <rect x="13.5" y="3.5" width="7" height="6" />
          <rect x="3.5" y="16.5" width="7" height="4" />
          <rect x="13.5" y="12.5" width="7" height="8" />
        </g>
      )}
      {name === "enso" && (
        <g {...common}>
          <path d="M16.8 5.2A8 8 0 1 0 19.6 10" strokeWidth={2} />
          <path d="M19.6 10c-.3-1.2-.9-2.4-1.6-3.3" strokeWidth={1} />
        </g>
      )}
      {name === "brush" && (
        <g {...common}>
          <path d="M19.5 3.5 10 13" />
          <path d="M10 13c-2-.4-3.8.9-4.1 3-.3 2-1.2 3.2-2.4 3.6 3.6.9 7.4-.4 8-3.6.2-1.2-.4-2.4-1.5-3Z" />
        </g>
      )}
      {name === "voice" && (
        <g {...common}>
          <path d="M4 5.5h16v10H11l-4.5 3.5v-3.5H4z" />
          <path d="M8 9.5h8M8 12h5" />
        </g>
      )}
      {name === "ruler" && (
        <g {...common}>
          <path d="m3.5 15.5 12-12 5 5-12 12z" />
          <path d="m7 12 1.8 1.8M9.5 9.5l2.6 2.6M12 7l1.8 1.8" />
        </g>
      )}
      {name === "question" && (
        <g {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M9.6 9.4a2.5 2.5 0 1 1 3.6 2.3c-.8.4-1.2 1-1.2 1.8v.6" />
          <path d="M12 16.8v.2" strokeWidth={2} />
        </g>
      )}
      {name === "book" && (
        <g {...common}>
          <path d="M6 20 18.5 7.5a2.1 2.1 0 0 0-3-3L3 17v3z" />
          <path d="m14 6 3 3" />
          <path d="M12 20h8" />
        </g>
      )}
    </svg>
  );
}

export function MenuIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M4 8h16M4 16h10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function ArrowIcon({ className = "", direction = "right" }: { className?: string; direction?: "right" | "left" | "down" }) {
  const rotate = direction === "left" ? 180 : direction === "down" ? 90 : 0;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M4 12h15M14 7l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function PlusIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function StarIcon({ filled, className = "" }: { filled: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" focusable="false">
      <path
        d="m12 3.6 2.5 5.3 5.8.7-4.3 4 1.1 5.7L12 16.5l-5.1 2.8L8 13.6l-4.3-4 5.8-.7z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
