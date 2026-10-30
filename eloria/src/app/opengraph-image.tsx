import { ogSize, renderOgImage } from "@/lib/server/og";

export const alt = "ÉLORIA Aesthetic Medical Clinic – Piękno w harmonii z Tobą.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOgImage({ title: "Piękno w harmonii z Tobą.", kicker: "Medycyna estetyczna i kosmetologia" });
}
