type IconProps = { className?: string };

const base = { viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round" } as const;

export const ArrowRight = ({ className = "arrow" }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M3 8h10M9 4l4 4-4 4" />
  </svg>
);

export const ArrowUpRight = ({ className = "arrow" }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="M5 11 11 5M6 5h5v5" />
  </svg>
);

export const Check = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <path d="m3.5 8.5 3 3 6-7" />
  </svg>
);

export const Alert = ({ className }: IconProps) => (
  <svg {...base} className={className} aria-hidden="true">
    <circle cx="8" cy="8" r="6.25" />
    <path d="M8 4.75v3.75M8 10.9v.1" />
  </svg>
);
