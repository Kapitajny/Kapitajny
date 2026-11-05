export type FaqItem = { q: string; a: string };

/** Pytania i odpowiedzi na natywnych <details> – działają bez JavaScriptu i z klawiatury. */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group reveal">
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.075rem] font-semibold tracking-[-0.015em] [&::-webkit-details-marker]:hidden">
            {item.q}
            <span className="relative size-4 shrink-0" aria-hidden="true">
              <span className="absolute top-1/2 left-0 h-[1.5px] w-4 -translate-y-1/2 bg-ink" />
              <span className="absolute top-0 left-1/2 h-4 w-[1.5px] -translate-x-1/2 bg-ink transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="max-w-3xl pb-6 text-steel">{item.a}</p>
        </details>
      ))}
    </div>
  );
}

export function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({ "@type": "Question", name: item.q, acceptedAnswer: { "@type": "Answer", text: item.a } })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
