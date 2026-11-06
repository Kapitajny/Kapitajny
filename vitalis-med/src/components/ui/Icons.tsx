import type { ReactNode, SVGProps } from "react";

/** Zestaw ikon liniowych (24×24, obrys 1.6) rysowanych dla strony – spójna grubość i styl. */
const paths = {
  ambulance: (
    <>
      <path d="M2.5 16.5V7.2c0-.66.54-1.2 1.2-1.2h9.6c.66 0 1.2.54 1.2 1.2v9.3" />
      <path d="M14.5 9h3.6c.4 0 .77.2 1 .52l2.2 3.1c.13.2.2.43.2.67v3.21h-1.9" />
      <path d="M4.4 16.5H2.5M15.6 16.5H9.4" />
      <circle cx="7" cy="17" r="1.9" />
      <circle cx="17.6" cy="17" r="1.9" />
      <path d="M8.5 8.3v4.4M6.3 10.5h4.4" />
    </>
  ),
  stretcher: (
    <>
      <path d="M3 10.5h15.5a2.5 2.5 0 0 1 2.5 2.5v.5H3z" />
      <path d="M5.5 13.5 8 18M18.5 13.5 16 18M8 18h8" />
      <circle cx="6.5" cy="7.6" r="1.8" />
      <circle cx="8" cy="19.4" r=".9" />
      <circle cx="16" cy="19.4" r=".9" />
    </>
  ),
  hospital: (
    <>
      <path d="M4 21V5.5c0-.55.45-1 1-1h8c.55 0 1 .45 1 1V21" />
      <path d="M14 10h5c.55 0 1 .45 1 1v10M2.5 21h19" />
      <path d="M9 7.5v4M7 9.5h4M8 21v-4.5h2V21M17 14h.01M17 17.5h.01" />
    </>
  ),
  bed: (
    <>
      <path d="M2.5 7v12M2.5 15.5h19V19M21.5 15.5v-3a2.5 2.5 0 0 0-2.5-2.5h-8.5v5.5" />
      <circle cx="6.5" cy="11.8" r="2" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15.5" rx="1.4" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M12 12.5v5M9.5 15h5" />
    </>
  ),
  event: (
    <>
      <path d="M3 20.5 12 4l9 16.5z" />
      <path d="M9.5 20.5 12 15.5l2.5 5M12 4V2.5" />
      <path d="M2 20.5h20" />
    </>
  ),
  building: (
    <>
      <rect x="4.5" y="3" width="15" height="18" rx="1" />
      <path d="M8.5 7h1.5M14 7h1.5M8.5 11h1.5M14 11h1.5M8.5 15h1.5M14 15h1.5M10.5 21v-2.5h3V21" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9s-1.2 6.5-3.6 9c-2.4-2.5-3.6-5.5-3.6-9S9.6 5.5 12 3z" />
    </>
  ),
  pulse: <path d="M2.5 12.5h4.2l2.1-5 3.6 10 2.4-6.2 1.5 1.2h5.2" />,
  stethoscope: (
    <>
      <path d="M5.5 3.5H4.3v5a4.2 4.2 0 0 0 8.4 0v-5h-1.2" />
      <path d="M8.5 12.7v1.8a5 5 0 0 0 10 0V12" />
      <circle cx="18.5" cy="10" r="2" />
    </>
  ),
  cross: (
    <>
      <path d="M9.2 3.5h5.6v5.7h5.7v5.6h-5.7v5.7H9.2v-5.7H3.5V9.2h5.7z" />
    </>
  ),
  steering: (
    <>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M3.3 10.5c2.8-.9 5.7-1.3 8.7-1.3s5.9.4 8.7 1.3M10.2 13.6 6.8 20M13.8 13.6l3.4 6.4" />
    </>
  ),
  headset: (
    <>
      <path d="M4 14v-2a8 8 0 0 1 16 0v2" />
      <rect x="3" y="13.5" width="4" height="6" rx="1.2" />
      <rect x="17" y="13.5" width="4" height="6" rx="1.2" />
      <path d="M19 19.5c0 1.1-1.3 2-3 2h-2.5" />
    </>
  ),
  clipboard: (
    <>
      <rect x="5" y="4.5" width="14" height="17" rx="1.4" />
      <path d="M9 4.5V3.6c0-.33.27-.6.6-.6h4.8c.33 0 .6.27.6.6v.9M9 4.5h6" />
      <path d="m8.8 12.5 2.2 2.2 4.2-4.4M9 18h6" />
    </>
  ),
  shield: (
    <>
      <path d="M12 2.8 4.5 5.6v5.6c0 4.6 3.1 8.6 7.5 10 4.4-1.4 7.5-5.4 7.5-10V5.6z" />
      <path d="m8.8 12 2.2 2.2 4.3-4.4" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.3 2" />
    </>
  ),
  phone: (
    <path d="M8.3 3.5H5.2c-.9 0-1.7.8-1.6 1.7C4.4 13 11 19.6 18.8 20.4c.9.1 1.7-.7 1.7-1.6v-3.1c0-.6-.4-1.1-1-1.2l-3.3-.8c-.4-.1-.9 0-1.2.4l-1.3 1.6a12.6 12.6 0 0 1-5.4-5.4L9.9 9c.3-.3.5-.8.4-1.2l-.8-3.3c-.1-.6-.6-1-1.2-1z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="1.4" />
      <path d="m3.5 6 8.5 7 8.5-7" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </>
  ),
  check: <path d="m5 12.5 4.5 4.5L19 7.5" />,
  arrowRight: <path d="M4.5 12h15M14 6.5l5.5 5.5-5.5 5.5" />,
  arrowUpRight: <path d="M7 17 17 7M8.5 7H17v8.5" />,
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.5M12 7.6v.1" />
    </>
  ),
  alert: (
    <>
      <path d="M10.3 4.2 2.6 17.6c-.75 1.3.2 2.9 1.7 2.9h15.4c1.5 0 2.45-1.6 1.7-2.9L13.7 4.2a1.95 1.95 0 0 0-3.4 0z" />
      <path d="M12 9.5v4.5M12 17v.1" />
    </>
  ),
  menu: <path d="M3.5 7h17M3.5 12h17M3.5 17h17" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  document: (
    <>
      <path d="M14 3H6.5c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h11c.55 0 1-.45 1-1V7.5z" />
      <path d="M14 3v4.5h4.5M9 12h6M9 15.5h6" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M2.8 20c.5-3.4 3.1-5.6 6.2-5.6s5.7 2.2 6.2 5.6" />
      <path d="M15.5 4.9a3.2 3.2 0 0 1 0 6.2M17.6 14.6c2 .7 3.3 2.6 3.6 5.4" />
    </>
  ),
  card: (
    <>
      <rect x="2.5" y="5.5" width="19" height="13" rx="1.4" />
      <path d="M2.5 9.5h19M6 15h4" />
    </>
  ),
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof paths;

export function Icon({ name, size = 24, strokeWidth = 1.6, ...props }: { name: IconName; size?: number; strokeWidth?: number } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
