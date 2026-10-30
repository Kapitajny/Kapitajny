import { ImageResponse } from "next/og";
import { brandFonts } from "@/lib/server/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** App icon: a Bodoni “V” in ivory on burgundy. */
export async function renderIcon(px: number) {
  return new ImageResponse(
    (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height: "100%", background: "#481E2C", color: "#F4EFE8", fontFamily: "Bodoni", fontSize: px * 0.74, lineHeight: 1, paddingTop: px * 0.06 }}>
        V
      </div>
    ),
    { width: px, height: px, fonts: await brandFonts() },
  );
}

export default function Icon() {
  return renderIcon(size.width);
}
