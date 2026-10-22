import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Rygiel – obsługa IT i cyberbezpieczeństwo dla małych i średnich firm";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const [bold, regular] = await Promise.all([
    readFile(join(process.cwd(), "assets/fonts/Archivo-Expanded-Bold.ttf")),
    readFile(join(process.cwd(), "assets/fonts/Archivo-Regular.ttf")),
  ]);

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#16181c", color: "#eeebe3", padding: 72, fontFamily: "Archivo" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", position: "relative", width: 60, height: 56 }}>
              <div style={{ position: "absolute", left: 6, top: 4, width: 7, height: 48, background: "#eeebe3" }} />
              <div style={{ position: "absolute", left: 32, top: 4, width: 7, height: 48, background: "#eeebe3" }} />
              <div style={{ position: "absolute", left: 6, top: 23, width: 50, height: 10, background: "#3050ff" }} />
            </div>
            <span style={{ fontFamily: "Archivo Expanded", fontSize: 44, letterSpacing: -1.5 }}>rygiel</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <span style={{ fontFamily: "Archivo Expanded", fontSize: 58, lineHeight: 1.05, letterSpacing: -1.5, maxWidth: 900 }}>
              {"Administrujemy, zabezpieczamy i\u00A0odtwarzamy IT małych i\u00A0średnich firm."}
            </span>
            <span style={{ fontSize: 26, color: "#a3a7ae" }}>Obsługa IT · Cyberbezpieczeństwo · Chmura i&nbsp;kopie zapasowe</span>
          </div>
          <span style={{ fontSize: 20, color: "#878c94" }}>Projekt demonstracyjny ComputerIT</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 14, width: 150 }}>
          {[0, 1, 2, 3].map((index) => (
            <div key={index} style={{ height: 52, background: index === 3 ? "#272a30" : "#3050ff", border: "1px solid #565b64" }} />
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Archivo Expanded", data: bold, weight: 700, style: "normal" },
        { name: "Archivo", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
