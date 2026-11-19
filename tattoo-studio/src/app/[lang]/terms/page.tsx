import type { Metadata } from "next";
import { buildMetadata, resolveLocale } from "@/i18n/metadata";
import { LegalPageView } from "@/components/legal/LegalPageView";

export async function generateMetadata({ params }: PageProps<"/[lang]/terms">): Promise<Metadata> {
  return buildMetadata(await resolveLocale(params), "terms");
}

export default function TermsPage() {
  return <LegalPageView doc="terms" />;
}
