import { getCategory, getTreatment, treatments } from "@/data/treatments";
import { ogSize, renderOg } from "@/lib/server/og";

export const alt = "Treatment at VÉRA Aesthetic Studio";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return treatments.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const t = getTreatment((await params).slug);
  return renderOg(t ? { title: t.name, kicker: getCategory(t.category).name } : { title: "Treatments", kicker: "VÉRA" });
}
