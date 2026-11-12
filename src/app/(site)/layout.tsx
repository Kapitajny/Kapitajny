import { Suspense } from "react";
import { HeaderFallback } from "@/components/layout/HeaderFallback";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";

export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Suspense fallback={<HeaderFallback />}>
        <SiteHeader />
      </Suspense>
      <main id="tresc" className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </>
  );
}
