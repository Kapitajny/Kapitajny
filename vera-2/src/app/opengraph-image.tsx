import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "VÉRA Aesthetic Studio – Twoje piękno. Twoja tożsamość.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

export default async function OpengraphImage() {
  const [italic, italicExt, jost, jostExt, photo] = await Promise.all([
    font("fraunces", "fraunces-latin-300-italic.woff"),
    font("fraunces", "fraunces-latin-ext-300-italic.woff"),
    font("jost", "jost-latin-400-normal.woff"),
    font("jost", "jost-latin-ext-400-normal.woff"),
    readFile(join(process.cwd(), "public", "images", "vera", "hero-portrait.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#E9DDD4", alignItems: "center", padding: "0 80px", gap: 70 }}>
        <img src={photoSrc} width={330} height={460} alt="" style={{ borderRadius: "50%", objectFit: "cover", objectPosition: "68% 18%" }} />
        <div style={{ display: "flex", flexDirection: "column", color: "#481E2C" }}>
          <div style={{ fontFamily: "Fraunces", fontStyle: "italic", fontSize: 64 }}>Véra</div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Fraunces", fontStyle: "italic", fontSize: 76, lineHeight: 1.02, marginTop: 30 }}>
            <span>Twoje piękno.</span>
            <span>Twoja tożsamość.</span>
          </div>
          <div style={{ fontFamily: "Jost", fontSize: 24, color: "#7D5A5C", marginTop: 34, letterSpacing: 2 }}>medycyna estetyczna i pielęgnacja skóry</div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fraunces", data: italic, weight: 300, style: "italic" },
        { name: "Fraunces", data: italicExt, weight: 300, style: "italic" },
        { name: "Jost", data: jost, weight: 400, style: "normal" },
        { name: "Jost", data: jostExt, weight: 400, style: "normal" },
      ],
    },
  );
}
