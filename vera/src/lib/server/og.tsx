import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

const font = (pkg: string, file: string) => readFile(join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file));

export async function brandFonts() {
  const [b, bx, bi, bix, s, sx] = await Promise.all([
    font("bodoni-moda", "bodoni-moda-latin-400-normal.woff"),
    font("bodoni-moda", "bodoni-moda-latin-ext-400-normal.woff"),
    font("bodoni-moda", "bodoni-moda-latin-400-italic.woff"),
    font("bodoni-moda", "bodoni-moda-latin-ext-400-italic.woff"),
    font("instrument-sans", "instrument-sans-latin-500-normal.woff"),
    font("instrument-sans", "instrument-sans-latin-ext-500-normal.woff"),
  ]);
  return [
    { name: "Bodoni", data: b, weight: 400 as const, style: "normal" as const },
    { name: "Bodoni", data: bx, weight: 400 as const, style: "normal" as const },
    { name: "Bodoni", data: bi, weight: 400 as const, style: "italic" as const },
    { name: "Bodoni", data: bix, weight: 400 as const, style: "italic" as const },
    { name: "Instrument", data: s, weight: 500 as const, style: "normal" as const },
    { name: "Instrument", data: sx, weight: 500 as const, style: "normal" as const },
  ];
}

/** Open Graph image: burgundy field, logotype, title in Bodoni. */
export async function renderOg({ title, kicker }: { title: string; kicker: string }) {
  return new ImageResponse(
    (
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: "100%", height: "100%", background: "#481E2C", color: "#F4EFE8", padding: "64px 72px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontFamily: "Bodoni", fontSize: 44, letterSpacing: 2 }}>VÉRA</div>
          <div style={{ fontFamily: "Instrument", fontSize: 18, letterSpacing: 4, color: "#C9A9AA", textTransform: "uppercase" }}>{kicker}</div>
        </div>
        <div style={{ display: "flex", fontFamily: "Bodoni", fontStyle: "italic", fontSize: title.length > 28 ? 86 : 110, lineHeight: 0.95, letterSpacing: -2 }}>{title}</div>
        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Instrument", fontSize: 20, color: "#C9A9AA" }}>
          <span>VÉRA Aesthetic Studio, Kraków</span>
          <span>Your beauty. Your identity.</span>
        </div>
      </div>
    ),
    { ...ogSize, fonts: await brandFonts() },
  );
}
