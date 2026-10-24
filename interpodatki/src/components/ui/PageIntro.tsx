import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

export function PageIntro({
  crumbs,
  title,
  lede,
  children,
  aside,
}: {
  crumbs: Crumb[];
  title: string;
  lede?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <section className="border-b border-line bg-mist">
      <div className="shell grid gap-10 py-10 sm:py-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-end lg:gap-16">
        <div>
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-6 max-w-3xl">{title}</h1>
          {lede && <p className="lede mt-5">{lede}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {aside}
      </div>
    </section>
  );
}
