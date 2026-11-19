import type { SVGProps } from "react";

/** Własny zestaw ikon: siatka 24 px, kontur 1.5 px, ścięte zakończenia, kolor = currentColor. */
type P = SVGProps<SVGSVGElement> & { size?: number };

const base = ({ size = 20, ...rest }: P) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "butt" as const,
  strokeLinejoin: "miter" as const,
  "aria-hidden": true,
  focusable: false,
  ...rest,
});

export const PlayIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M7 4.5v15l12-7.5z" fill="currentColor" stroke="none" />
  </svg>
);
export const PauseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z" fill="currentColor" stroke="none" />
  </svg>
);
export const PrevIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M18 5v14L8 12zM6 5v14" />
  </svg>
);
export const NextIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6 5v14l10-7zM18 5v14" />
  </svg>
);
export const VolumeIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9a4 4 0 0 1 0 6M18 6.5a7.5 7.5 0 0 1 0 11" />
  </svg>
);
export const MuteIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4 9.5h3.5L12 5.5v13l-4.5-4H4zM15.5 9.5l5 5M20.5 9.5l-5 5" />
  </svg>
);
export const MenuIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 7.5h17M3.5 12h17M3.5 16.5h11" />
  </svg>
);
export const CloseIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M5.5 5.5l13 13M18.5 5.5l-13 13" />
  </svg>
);
export const CheckIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M4.5 12.5l4.5 4.5 10.5-10.5" />
  </svg>
);
export const PlusIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
export const PhoneIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M6.5 3.5h3l1.5 4.5-2 1.5a11 11 0 0 0 5.5 5.5l1.5-2 4.5 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z" />
  </svg>
);
export const MailIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3.5 5.5h17v13h-17zM3.5 6l8.5 7 8.5-7" />
  </svg>
);
export const PinIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-6.2-6.5-11.5a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z" />
    <circle cx="12" cy="9.5" r="2.25" />
  </svg>
);
export const ClockIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);
export const InfoIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v6M12 7.5v1.5" />
  </svg>
);
export const ArrowUpIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M12 19.5V5M6 11l6-6 6 6" />
  </svg>
);
export const ChevronIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M9 5.5l6.5 6.5L9 18.5" />
  </svg>
);
export const WaveIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M3 12h2.5M7 8v8M10 5v14M13 9v6M16 7v10M19 10.5v3M21 12h0" />
  </svg>
);

export const InstagramIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <path d="M17.2 6.8h.01" strokeWidth="2.2" strokeLinecap="round" />
  </svg>
);
export const YoutubeIcon = (p: P) => (
  <svg {...base(p)}>
    <rect x="2.5" y="5.5" width="19" height="13" rx="3.5" />
    <path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor" stroke="none" />
  </svg>
);
export const TiktokIcon = (p: P) => (
  <svg {...base(p)}>
    <path d="M13.5 3.5v11.25a3.25 3.25 0 1 1-3.25-3.25M13.5 3.5c.4 2.6 2.3 4.4 5 4.6" />
  </svg>
);
export const SpotifyIcon = (p: P) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M7.5 9.5c3-1 6.5-.7 9 .8M8 12.5c2.5-.7 5.2-.4 7.2.8M8.6 15.3c1.9-.5 3.9-.3 5.5.6" />
  </svg>
);

export const socialIcons = { instagram: InstagramIcon, youtube: YoutubeIcon, tiktok: TiktokIcon, spotify: SpotifyIcon };
