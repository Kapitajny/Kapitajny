import { siteConfig } from "@/config/site";

/**
 * Pieczęć hanko — jedyne miejsce, w którym pojawia się czerwień bengara.
 * Lekko nierówna krawędź imituje odcisk tuszu pieczętnego.
 */
export function Seal({ size = 44, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <path
        d="M4.2 5.1C10 3.6 37.5 3.9 43.4 4.6c.9 7.4 1 31.6.2 38.6-6.6 1.1-32.4.9-39.1.2C3.6 36 3.5 11.4 4.2 5.1Z"
        fill="var(--color-bengara)"
      />
      <path
        d="M7.6 8.3c6.5-.7 26.4-.6 32.6-.1.5 6.2.6 25.3 0 31.7-6.8.6-25.8.6-32.4.1-.5-6.6-.6-25.4-.2-31.7Z"
        fill="none"
        stroke="var(--color-washi)"
        strokeOpacity="0.55"
        strokeWidth="0.9"
      />
      <text
        x="24"
        y="25"
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="var(--font-shippori), serif"
        fontWeight="500"
        fontSize="26"
        fill="var(--color-washi)"
      >
        {siteConfig.seal}
      </text>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <Seal size={34} />
      <span className="font-mincho text-lg font-medium tracking-[0.32em]">{siteConfig.name}</span>
    </span>
  );
}
