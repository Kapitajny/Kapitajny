import { ogSize, renderOg } from "@/lib/server/og";

export const alt = "VÉRA Aesthetic Studio – Your beauty. Your identity.";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({ title: "Your beauty. Your identity.", kicker: "Aesthetic studio" });
}
