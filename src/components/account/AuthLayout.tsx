import { Suspense, type ReactNode } from "react";

export function AuthLayout({ title, intro, children, footer }: { title: string; intro?: ReactNode; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="wrap grid gap-10 pb-24 pt-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <h1 className="display text-[clamp(2.8rem,1rem+6vw,6.5rem)]">{title}</h1>
        {intro && <div className="mt-6 max-w-md text-muted">{intro}</div>}
      </div>
      <div className="lg:col-span-5 lg:col-start-8 lg:pt-4">
        <Suspense fallback={<div className="h-64 border border-line" />}>{children}</Suspense>
        {footer && <div className="mt-8 space-y-2 border-t border-line pt-6 text-sm text-muted">{footer}</div>}
      </div>
    </div>
  );
}
