import { ImageResponse } from "next/og";

export const alt = "ComputerIT – projektowanie stron internetowych i sklepów online";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          background: "linear-gradient(180deg, #0a2264 0%, #1951ba 58%, #78abec 82%, #f2f5fa 100%)",
        }}
      >
        <div style={{ display: "flex", fontSize: 30, opacity: 0.85 }}>Strony internetowe i sklepy online</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 128, fontWeight: 700, letterSpacing: 4 }}>
            {"COMPUTERIT".split("").map((letter, i) => (
              <span key={i}>{letter}</span>
            ))}
          </div>
          <div style={{ display: "flex", height: 2, marginTop: 28, background: "rgba(255,255,255,0.6)" }} />
        </div>
        <div style={{ display: "flex", height: 40 }} />
      </div>
    ),
    size,
  );
}
