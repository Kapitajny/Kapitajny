import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "square" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export function BasketIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3.5 9.5h17l-1.6 10h-13.8z" />
      <path d="M8 9.5 12 3.5l4 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="m5 5 14 14M19 5 5 19" />
    </svg>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M3 8h18M3 16h18" />
    </svg>
  );
}

export function MinusIcon(props: IconProps) {
  return (
    <svg {...base(props)} width={16} height={16} viewBox="0 0 16 16">
      <path d="M3 8h10" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base(props)} width={16} height={16} viewBox="0 0 16 16">
      <path d="M3 8h10M8 3v10" />
    </svg>
  );
}

export function ArrowDownIcon(props: IconProps) {
  return (
    <svg {...base(props)} width={16} height={40} viewBox="0 0 16 40">
      <path d="M8 1v37M2 32l6 6 6-6" />
    </svg>
  );
}

export function ArrowIcon({ direction = "right", ...props }: IconProps & { direction?: "left" | "right" }) {
  return (
    <svg {...base(props)} width={28} height={16} viewBox="0 0 28 16" style={direction === "left" ? { transform: "scaleX(-1)" } : undefined}>
      <path d="M1 8h25M20 2l6 6-6 6" />
    </svg>
  );
}
