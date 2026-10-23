/** Dane strukturalne schema.org. Znak `<` jest kodowany, żeby treść nie mogła zamknąć znacznika <script>. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
