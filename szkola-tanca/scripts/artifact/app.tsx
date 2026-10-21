import HomePage from "@/app/page";
import PrivacyPolicyPage from "@/app/polityka-prywatnosci/page";
import TermsPage from "@/app/regulamin/page";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import type { ExportPage } from "./shims/page-context";

const PAGES = { home: HomePage, privacy: PrivacyPolicyPage, terms: TermsPage } satisfies Record<ExportPage, () => React.ReactNode>;

/** Odpowiednik `app/layout.tsx` dla eksportu statycznego (bez <html>/<body>, które dodaje host). */
export function ExportApp({ page }: { page: ExportPage }) {
  const Page = PAGES[page];
  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader />
      <main id="tresc" tabIndex={-1} className="flex-1 focus:outline-none">
        <Page />
      </main>
      <SiteFooter />
    </div>
  );
}
