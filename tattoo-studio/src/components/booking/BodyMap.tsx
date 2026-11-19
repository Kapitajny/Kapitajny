"use client";

import type { PlacementId, SideId } from "@/config/booking";
import { useI18n } from "@/i18n/I18nProvider";

type Zone = "neck" | "chest" | "torso" | "upperArm" | "forearm" | "hand" | "thigh" | "calf";

const PLACEMENT_ZONES: Record<PlacementId, Zone[]> = {
  arm: ["upperArm", "forearm"],
  forearm: ["forearm"],
  "upper-arm": ["upperArm"],
  "full-sleeve": ["upperArm", "forearm"],
  chest: ["chest"],
  back: ["torso"],
  neck: ["neck"],
  leg: ["thigh", "calf"],
  thigh: ["thigh"],
  calf: ["calf"],
  hand: ["hand"],
  other: [],
};

/** Kształty stref w widoku z przodu. „r” = prawa strona ciała (po lewej stronie rysunku). */
const SHAPES: Record<Zone, { r?: string; l?: string; center?: string }> = {
  neck: { center: "M54 33h12v10H54z" },
  chest: { center: "M41 45c6-3 32-3 38 0l1 24H40z" },
  torso: { center: "M41 45c6-3 32-3 38 0l2 64H39z" },
  upperArm: { r: "M28 47c4-4 10-4 12 0l-2 34h-11z", l: "M80 47c2-4 8-4 12 0l1 34H82z" },
  forearm: { r: "M27 83h11l-2 34h-10z", l: "M82 83h11l1 34H84z" },
  hand: { r: "M25 120h11l-1 14c-3 3-8 3-11 0z", l: "M84 120h11l1 14c-3 3-8 3-11 0z" },
  thigh: { r: "M40 112h19l-2 50H43z", l: "M61 112h19l-3 50H63z" },
  calf: { r: "M43 166h14l-2 50H46z", l: "M63 166h14l-3 50H65z" },
};

export function BodyMap({
  placement,
  side,
  caption = true,
  tone = "light",
}: {
  placement: PlacementId | "";
  side: SideId | "";
  caption?: boolean;
  tone?: "light" | "dark";
}) {
  const { t } = useI18n();
  const ink = tone === "dark" ? "var(--color-washi)" : "var(--color-sumi)";
  const active = new Set(placement ? PLACEMENT_ZONES[placement] : []);
  const showRight = side === "right" || side === "both" || side === "not-sure" || side === "";
  const showLeft = side === "left" || side === "both" || side === "not-sure" || side === "";
  const tentative = side === "not-sure" || side === "";

  return (
    <figure className="flex flex-col items-center">
      <svg viewBox="0 0 120 232" className="h-auto w-full max-w-[12rem]" aria-hidden="true">
        {/* sylwetka */}
        <g fill={ink} fillOpacity="0.07" stroke={ink} strokeOpacity="0.35" strokeWidth="0.8">
          <circle cx="60" cy="19" r="12" />
          {Object.entries(SHAPES).map(([zone, shape]) =>
            zone === "chest" ? null : (
              <g key={zone}>
                {shape.center && <path d={shape.center} />}
                {shape.r && <path d={shape.r} />}
                {shape.l && <path d={shape.l} />}
              </g>
            ),
          )}
        </g>
        {/* zaznaczenie */}
        <g fill={ink} stroke={ink} strokeWidth="0.8">
          {[...active].map((zone) => {
            const shape = SHAPES[zone];
            const style = { fillOpacity: tentative && !shape.center ? 0.45 : 0.9 };
            return (
              <g key={zone} style={style}>
                {shape.center && <path d={shape.center} strokeDasharray={zone === "torso" ? "3 2" : undefined} fillOpacity={zone === "torso" ? 0.35 : 0.9} />}
                {shape.r && showRight && <path d={shape.r} />}
                {shape.l && showLeft && <path d={shape.l} />}
              </g>
            );
          })}
        </g>
      </svg>
      {caption && (
        <figcaption className="mt-3 text-center font-gothic text-2xs leading-relaxed text-nezumi">
          {t.booking.bodyMap.caption}
          {placement === "back" && <span className="block">{t.booking.bodyMap.back}</span>}
        </figcaption>
      )}
    </figure>
  );
}
