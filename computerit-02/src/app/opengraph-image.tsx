import { ImageResponse } from "next/og";

export const alt = "ComputerIT – strony internetowe i sklepy online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Obraz udostępniania: znak monitora z logo, wordmark i złota ścieżka obwodu na grafitowym tle. */
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          color: "#fff",
          background: "#0b0b0c",
          backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          <svg width="96" height="104" viewBox="0 0 48 52">
            <rect x="2.25" y="2.25" width="43.5" height="39" rx="6.5" fill="none" stroke="#fff" strokeWidth="4.5" />
            <rect x="31.5" y="27.5" width="7.5" height="7.5" rx="1" fill="#c9a45c" />
            <rect x="5.5" y="46.25" width="37" height="5" rx="2.5" fill="#fff" />
          </svg>
          <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: -4 }}>computerit</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 600, letterSpacing: -2, lineHeight: 1.1, maxWidth: 900 }}>
            Tworzymy cyfrowe doświadczenia, które rozwijają biznes
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 28, color: "#9a9da4" }}>
            <div style={{ display: "flex", width: 120, height: 2, background: "#c9a45c" }} />
            Strony internetowe · Sklepy online
          </div>
        </div>
      </div>
    ),
    size,
  );
}
