import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { IMAGE_DIR, IMAGES } from "@/config/images";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} – gabinet rehabilitacji i fizjoterapii`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = await readFile(join(process.cwd(), "public/images/brand/logo-znak-bialy.png"))
  .then((data) => `data:image/png;base64,${data.toString("base64")}`)
  .catch(() => null);

const photo = await readFile(join(process.cwd(), "public", IMAGE_DIR, IMAGES.hero.file))
  .then((data) => `data:image/jpeg;base64,${data.toString("base64")}`)
  .catch(() => null);

/** Obraz udostępniania (Open Graph): nazwa gabinetu, hasło i zdjęcie z sekcji hero. */
export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: "#faf9f6" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: photo ? 700 : 1200, padding: 72, background: "#23483d" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 34, fontWeight: 700, color: "#ffffff" }}>
            {logo && <img src={logo} alt="" width={72} height={72} />}
            {siteConfig.name}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 64, lineHeight: 1.1, color: "#faf9f6" }}>Odzyskaj swobodę ruchu.</div>
            <div style={{ fontSize: 64, lineHeight: 1.1, color: "#dce7de" }}>Zadbaj o siebie.</div>
          </div>
          <div style={{ display: "flex", fontSize: 28, color: "#dce7de" }}>Gabinet fizjoterapii i rehabilitacji{siteConfig.city ? ` w ${siteConfig.city}` : ""}</div>
        </div>
        {photo && (
          <img src={photo} alt="" width={500} height={630} style={{ objectFit: "cover", width: 500, height: 630 }} />
        )}
      </div>
    ),
    size,
  );
}
