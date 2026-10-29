import type { ReactNode } from "react";

export function SectionHeader({
  id,
  title,
  lede,
  action,
}: {
  id?: string;
  title: string;
  lede?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        <h2 id={id}>{title}</h2>
        {lede && <p className="lede mt-4">{lede}</p>}
      </div>
      {action}
    </div>
  );
}
