import type { FaqItem } from "@/data/faq";
import { PlusIcon } from "@/components/ui/Icons";
import { TextWithPending } from "@/components/ui/Pending";
import { OpenDetailsFromHash } from "./OpenDetailsFromHash";

/** Lista pytań na natywnych <details> – działa z klawiatury i bez JavaScriptu. */
export function FaqList({ items, headingLevel = 3 }: { items: FaqItem[]; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="border-t border-line">
      <OpenDetailsFromHash />
      {items.map((item) => (
        <details key={item.id} id={`faq-${item.id}`} className="faq-item border-b border-line">
          <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-6 py-4 text-left hover:text-brand">
            <Heading className="text-h3 font-bold tracking-normal text-ink">{item.question}</Heading>
            <PlusIcon size={24} className="faq-icon shrink-0 text-brand" />
          </summary>
          <div className="max-w-prose space-y-3 pb-6">
            {item.answer.map((paragraph, i) => (
              <p key={i}>
                <TextWithPending text={paragraph} />
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}
