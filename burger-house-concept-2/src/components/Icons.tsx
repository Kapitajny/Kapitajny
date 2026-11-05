import type { SVGProps } from "react";

const base = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, focusable: false } as const;

export const Phone = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M7.2 3.5h2.6l1.3 4.1-2 1.4a12.4 12.4 0 0 0 5.9 5.9l1.4-2 4.1 1.3v2.6a2 2 0 0 1-2.2 2A16.6 16.6 0 0 1 5.2 5.7a2 2 0 0 1 2-2.2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
  </svg>
);
export const Arrow = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} className="arrow" {...p}>
    <path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
export const Info = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 11v6M12 7.5v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
export const Warn = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base} {...p}>
    <path d="M12 3.5 2.8 19.5h18.4L12 3.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    <path d="M12 10v4.5M12 17v.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
