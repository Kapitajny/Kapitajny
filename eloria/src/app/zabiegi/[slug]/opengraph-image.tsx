import { getCategory, getService, services } from "@/data/services";
import { ogSize, renderOgImage } from "@/lib/server/og";

export const alt = "Zabieg w ÉLORIA Aesthetic Medical Clinic";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return renderOgImage({ title: "Zabiegi", kicker: "ÉLORIA" });
  return renderOgImage({ title: service.name, kicker: getCategory(service.category).name });
}
