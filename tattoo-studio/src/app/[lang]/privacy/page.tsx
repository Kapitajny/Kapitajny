import type { Metadata } from "next";
import { buildMetadata, resolveLocale } from "@/i18n/metadata";
import { LegalPageView } from "@/components/legal/LegalPageView";

export async function generateMetadata({ params }: PageProps<"/[lang]/privacy">): Promise<Metadata> {
  return buildMetadata(await resolveLocale(params), "privacy");
}

export default function PrivacyPage() {
  return <LegalPageView doc="privacy" />;
}
