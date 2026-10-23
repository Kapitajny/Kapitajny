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
          <summary className="group flex min-h-16 cursor-pointer items-center justify-between gap-6 py-5 text-left">
            <Heading className="text-h4 type-plain group-hover:text-brand-deep">{item.question}</Heading>
            <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mint text-brand group-hover:bg-mint-strong">
              <PlusIcon size={20} className="faq-icon" />
            </span>
          </summary>
          <div className="max-w-prose space-y-3 pb-7">
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
