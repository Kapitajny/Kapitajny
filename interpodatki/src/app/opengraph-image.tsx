import { ImageResponse } from "next/og";

export const alt = "InterPodatki – biuro rachunkowe (projekt demonstracyjny)";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Domyślny font ImageResponse obejmuje tylko podstawowy alfabet łaciński – tekst dobrano bez polskich znaków.
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#10243A",
          color: "#ffffff",
          padding: 80,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <div style={{ width: 72, height: 72, borderRadius: 16, background: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", color: "#10243A", fontSize: 40, fontWeight: 700 }}>
            iP
          </div>
          <div style={{ fontSize: 48 }}>InterPodatki</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 72, lineHeight: 1.05 }}>Biuro rachunkowe</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, width: 220 }}>
            <div style={{ height: 2, background: "#C7A66A" }} />
            <div style={{ height: 2, background: "#C7A66A" }} />
          </div>
          <div style={{ fontSize: 32, color: "#B7C4D4" }}>Projekt demonstracyjny</div>
        </div>
      </div>
    ),
    size,
  );
}
