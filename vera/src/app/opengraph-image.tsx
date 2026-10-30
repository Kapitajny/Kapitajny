import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "VÉRA Aesthetic Studio – Twoje piękno. Twoja tożsamość.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

export default async function OpengraphImage() {
  const [cormorant, cormorantExt, cormorantMedium, manrope, manropeExt, photo] = await Promise.all([
    font("cormorant-garamond", "cormorant-garamond-latin-300-normal.woff"),
    font("cormorant-garamond", "cormorant-garamond-latin-ext-300-normal.woff"),
    font("cormorant-garamond", "cormorant-garamond-latin-500-normal.woff"),
    font("manrope", "manrope-latin-500-normal.woff"),
    font("manrope", "manrope-latin-ext-500-normal.woff"),
    readFile(join(process.cwd(), "public", "images", "vera", "hero-portrait.jpg")),
  ]);
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#481E2C" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "56px 64px" }}>
          <div style={{ fontFamily: "Cormorant", fontWeight: 500, fontSize: 44, letterSpacing: 9, color: "#F4EFE8" }}>VÉRA</div>
          <div style={{ display: "flex", flexDirection: "column", fontFamily: "Cormorant", fontWeight: 300, fontSize: 84, lineHeight: 0.95, color: "#F4EFE8" }}>
            <span>Twoje piękno.</span>
            <span style={{ paddingLeft: 70 }}>Twoja tożsamość.</span>
          </div>
          <div style={{ fontFamily: "Manrope", fontSize: 22, color: "#C9A9A9" }}>Medycyna estetyczna i profesjonalna pielęgnacja skóry</div>
        </div>
        <img src={photoSrc} width={420} height={630} alt="" style={{ objectFit: "cover", objectPosition: "65% 25%" }} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Cormorant", data: cormorant, weight: 300, style: "normal" },
        { name: "Cormorant", data: cormorantExt, weight: 300, style: "normal" },
        { name: "Cormorant", data: cormorantMedium, weight: 500, style: "normal" },
        { name: "Manrope", data: manrope, weight: 500, style: "normal" },
        { name: "Manrope", data: manropeExt, weight: 500, style: "normal" },
      ],
    },
  );
}
