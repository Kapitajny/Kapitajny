import { serializeJsonLd } from "@/lib/json-ld";

/** Dane strukturalne – tylko informacje rzeczywiście obecne na stronie. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
