import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const base = { viewBox: "0 0 24 24", fill: "none", "aria-hidden": true, focusable: false } as const;

export function PhoneIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path
        d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1L6.6 10.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function ArrowIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}

export function PinIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 22s7-6.6 7-12.2A7 7 0 0 0 5 9.8C5 15.4 12 22 12 22Z" fill="currentColor" />
      <circle cx="12" cy="9.6" r="2.6" fill="#000" />
    </svg>
  );
}

export function ChiliIcon(p: P) {
  return (
    <svg {...base} viewBox="0 0 16 16" {...p}>
      <path d="M10.6 2.2c.9-.1 1.6.3 1.9 1 2.2.8 2.5 3.6.9 6.3-1.7 2.9-5.4 5.4-9.7 4.6-.6-.1-.7-.9-.1-1.1 3-1.2 4.6-3.2 5.3-5.6.4-1.5 1.1-2.6 2.2-3.1-.4-.5-.7-1-1.3-1.3.2-.4.5-.7.8-.8Z" fill="currentColor" />
    </svg>
  );
}

export function InfoIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 10.5V17M12 7v.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" />
    </svg>
  );
}

export function CheckIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="m4.5 12.5 4.8 4.8L19.5 7" stroke="currentColor" strokeWidth="2.8" strokeLinecap="square" />
    </svg>
  );
}

export function AlertIcon(p: P) {
  return (
    <svg {...base} {...p}>
      <path d="M12 3 2 20.5h20L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="miter" />
      <path d="M12 9.5v5.5M12 17.2v.6" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  );
}
