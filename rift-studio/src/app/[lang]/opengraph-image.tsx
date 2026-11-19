import { ImageResponse } from "next/og";
import { hasLocale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "RIFT Studio";

/** Obraz udostępniania (Open Graph) w obu językach. */
export default async function OpenGraphImage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const t = await getDictionary(hasLocale(lang) ? lang : "pl");
  const wave = Array.from({ length: 120 }, (_, i) => {
    const x = i * 10;
    const y = 315 + Math.sin(i * 0.35) * 26 * Math.sin((i / 120) * Math.PI) + Math.sin(i * 1.3) * 8 * Math.sin((i / 120) * Math.PI);
    return `${i === 0 ? "M" : "L"}${x} ${y.toFixed(1)}`;
  }).join(" ");

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#030407", color: "#e9edf3", padding: 72, position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d={wave} fill="none" stroke="#3be8ff" strokeWidth="4" />
          <path d={wave} fill="none" stroke="#8a63ff" strokeWidth="2" transform="translate(0 10)" opacity="0.6" />
        </svg>
        <div style={{ display: "flex", fontSize: 44, fontWeight: 800, letterSpacing: 2 }}>
          RIFT<span style={{ color: "#3be8ff", margin: "0 8px" }}>/</span>STUDIO
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}>{t.hero.titleTop}</div>
          <div style={{ height: 70 }} />
          <div style={{ fontSize: 96, fontWeight: 800, lineHeight: 1, color: "#3be8ff" }}>{t.hero.titleBottom}</div>
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#8c95a5" }}>{t.meta.ogAlt}</div>
      </div>
    ),
    size,
  );
}
