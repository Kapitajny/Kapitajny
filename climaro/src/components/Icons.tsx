// Ikony rysowane jedną kreską 1,5 px na siatce 24 px. Dekoracyjne – ukryte przed czytnikami ekranu.
type IconProps = { className?: string };

const base = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "square" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
};

export function PhoneIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M8.5 3.5H5a1.5 1.5 0 0 0-1.5 1.6C4 13 11 20 18.9 20.5a1.5 1.5 0 0 0 1.6-1.5v-3.5l-4-1.5-2 2.2a12 12 0 0 1-5.7-5.7L11 8.5z" />
    </svg>
  );
}

export function MailIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 5.5h17v13h-17z" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </svg>
  );
}

export function PinIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" />
      <path d="M12 12.3a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8z" />
    </svg>
  );
}

export function AreaIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 6.5 9 4l6 2.5 5.5-2.5v13.5L15 20l-6-2.5-5.5 2.5z" />
      <path d="M9 4v13.5M15 6.5V20" />
    </svg>
  );
}

export function MenuIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h17" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
    </svg>
  );
}

export function ChevronIcon({ className }: IconProps) {
  return (
    <svg {...base} width={16} height={16} className={className}>
      <path d="m9 5 7 7-7 7" />
    </svg>
  );
}

export function CheckIcon({ className }: IconProps) {
  return (
    <svg {...base} width={16} height={16} className={className}>
      <path d="m4.5 12.5 5 5 10-11" />
    </svg>
  );
}

/* Ikony sekcji zaufania – większe (32 px), ta sama kreska 1,5 px. */
const large = { ...base, width: 32, height: 32 };

export function CertificateIcon({ className }: IconProps) {
  return (
    <svg {...large} className={className}>
      <path d="M4.5 3.5h15v12h-15z" />
      <path d="M8 7.5h8M8 10.5h5" />
      <path d="m9.5 15.5-1.5 5 3-1.5 3 1.5-1.5-5" />
    </svg>
  );
}

export function ShieldIcon({ className }: IconProps) {
  return (
    <svg {...large} className={className}>
      <path d="M12 3 4.5 6v5.5c0 4.6 3.1 8.3 7.5 9.5 4.4-1.2 7.5-4.9 7.5-9.5V6z" />
      <path d="m8.5 12 2.5 2.5 4.5-5" />
    </svg>
  );
}

export function DocumentIcon({ className }: IconProps) {
  return (
    <svg {...large} className={className}>
      <path d="M6 3.5h8.5l3.5 3.5v13.5H6z" />
      <path d="M14.5 3.5V7H18" />
      <path d="M9 11.5h6M9 14.5h6M9 17.5h3.5" />
    </svg>
  );
}

export function WrenchIcon({ className }: IconProps) {
  return (
    <svg {...large} className={className}>
      <path d="M14.5 4a4.5 4.5 0 0 0-4.2 6.1L4 16.4 7.6 20l6.3-6.3A4.5 4.5 0 0 0 20 9.5l-2.9 2.9-2.8-.7-.7-2.8L16.5 6A4.5 4.5 0 0 0 14.5 4z" />
    </svg>
  );
}
