import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

/** Grafika Open Graph w stylistyce marki: monogram z logo, tytuł w Cormorant Garamond. */
export async function renderOgImage({ title, kicker }: { title: string; kicker: string }) {
  const [cormorant, cormorantExt, manrope, manropeExt, monogram] = await Promise.all([
    font("cormorant-garamond", "cormorant-garamond-latin-300-normal.woff"),
    font("cormorant-garamond", "cormorant-garamond-latin-ext-300-normal.woff"),
    font("manrope", "manrope-latin-500-normal.woff"),
    font("manrope", "manrope-latin-ext-500-normal.woff"),
    readFile(join(process.cwd(), "public", "brand", "eloria-monogram.png")),
  ]);
  const monogramSrc = `data:image/png;base64,${monogram.toString("base64")}`;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#F5F0E9", padding: "64px 80px", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 330,
            height: 480,
            border: "1.5px solid #B69B87",
            borderTopLeftRadius: 165,
            borderTopRightRadius: 165,
            flexShrink: 0,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={monogramSrc} width={200} height={250} alt="" />
        </div>
        <div style={{ display: "flex", flexDirection: "column", marginLeft: 80, flex: 1 }}>
          <div style={{ fontFamily: "Manrope", fontSize: 24, color: "#76604F" }}>{kicker}</div>
          <div style={{ fontFamily: "Cormorant", fontSize: title.length > 40 ? 64 : 80, lineHeight: 1.02, color: "#403630", marginTop: 24 }}>{title}</div>
          <div style={{ fontFamily: "Manrope", fontSize: 22, color: "#655850", marginTop: 40 }}>ÉLORIA Aesthetic Medical Clinic, Warszawa</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Cormorant", data: cormorant, weight: 300, style: "normal" },
        { name: "Cormorant", data: cormorantExt, weight: 300, style: "normal" },
        { name: "Manrope", data: manrope, weight: 500, style: "normal" },
        { name: "Manrope", data: manropeExt, weight: 500, style: "normal" },
      ],
    },
  );
}
