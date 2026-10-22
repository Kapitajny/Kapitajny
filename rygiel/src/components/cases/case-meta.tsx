import type { CaseStudy } from "@/content/cases";
import { caseAreas, caseSectors } from "@/content/taxonomy";
import type { TitleBlockRow } from "@/components/ui/TitleBlock";

export type CaseSummary = Pick<CaseStudy, "slug" | "title" | "summary" | "area" | "sector" | "profile">;

export function caseTitleBlockRows(study: CaseSummary & Partial<Pick<CaseStudy, "duration">>): TitleBlockRow[] {
  return [
    { label: "Status", value: "Projekt demonstracyjny", wide: true },
    { label: "Obszar", value: caseAreas[study.area] },
    { label: "Branża", value: caseSectors[study.sector] },
    { label: "Profil firmy", value: study.profile, wide: true },
    ...(study.duration ? [{ label: "Harmonogram", value: study.duration, wide: true }] : []),
  ];
}
