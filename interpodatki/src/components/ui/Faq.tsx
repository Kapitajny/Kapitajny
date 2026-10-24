import { IconChevronDown } from "./Icons";

export type FaqItem = { q: string; a: string };

export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-4 text-left text-lg font-medium text-navy [&::-webkit-details-marker]:hidden">
            {item.q}
            <IconChevronDown size={20} className="shrink-0 text-muted transition-transform group-open:rotate-180" />
          </summary>
          <p className="max-w-3xl pb-5 text-muted">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
