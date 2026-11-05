/** Ikony rysowane jedną grubą kreską – ten sam ciężar co krój nagłówków. Zawsze dekoracyjne (aria-hidden). */
type P = { className?: string };
const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.4,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export const IconPhone = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 3.5h3.2l1.6 4.3-2.2 1.5a11 11 0 0 0 7.1 7.1l1.5-2.2 4.3 1.6V19a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 3.4 5.2 1.6 1.6 0 0 1 5 3.5Z" />
  </svg>
);
export const IconPin = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 21s-7-6.6-7-12a7 7 0 0 1 14 0c0 5.4-7 12-7 12Z" />
    <circle cx="12" cy="9" r="2.6" />
  </svg>
);
export const IconArrow = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);
export const IconChevron = ({ className, dir = "right" }: P & { dir?: "left" | "right" }) => (
  <svg {...base} className={className} style={dir === "left" ? { transform: "scaleX(-1)" } : undefined}>
    <path d="m9 5 7 7-7 7" />
  </svg>
);
export const IconClose = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M6 6l12 12M18 6 6 18" />
  </svg>
);
export const IconExpand = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" />
  </svg>
);
/** Papryczka – skala ostrości. */
export const IconChili = ({ className }: P) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M14.5 6.2c2.6.4 4.6 2.6 4.3 5.6-.4 4.6-6.3 9.4-13.3 9.9-1 .1-1.2-1.2-.3-1.5 4.6-1.8 6.4-5.1 6.9-8.9.3-2.6 1.1-5.4 2.4-5.1Z" fill="currentColor" />
    <path d="M14.8 6.3c.1-1.6.9-3 2.4-3.6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
export const IconInstagram = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.8" />
    <circle cx="17.2" cy="6.8" r=".6" fill="currentColor" />
  </svg>
);
export const IconTiktok = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14 3.5v11.2a3.8 3.8 0 1 1-3.8-3.8M14 3.5c.4 2.8 2.4 4.6 5.5 4.8" />
  </svg>
);
export const IconFacebook = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M14.5 20.5v-7.3h2.6l.4-3h-3V8.4c0-.9.3-1.5 1.6-1.5h1.5V4.2a20 20 0 0 0-2.3-.1c-2.3 0-3.9 1.4-3.9 4v2.1H8.8v3h2.6v7.3" />
  </svg>
);
