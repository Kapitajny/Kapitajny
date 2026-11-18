import type { CSSProperties } from "react";
import type { ServiceId } from "@/data/services";

/** Kolory kanałów w planie (pełny pasek) i ich kontury o kontraście >= 3:1. */
const channelVars: Record<ServiceId, { color: string; line: string }> = {
  meta: { color: "var(--color-meta)", line: "var(--color-meta)" },
  google: { color: "var(--color-google)", line: "var(--color-google-line)" },
  youtube: { color: "var(--color-youtube)", line: "var(--color-youtube)" },
  tiktok: { color: "var(--color-tiktok)", line: "var(--color-tiktok-line)" },
};

export function channelStyle(id: ServiceId): CSSProperties {
  const v = channelVars[id];
  return { "--flight-color": v.color, "--flight-line": v.line } as CSSProperties;
}

export function channelColor(id: ServiceId): string {
  return channelVars[id].color;
}
