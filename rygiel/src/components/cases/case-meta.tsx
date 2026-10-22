import { caseAreas, caseSectors, type CaseStudy } from "@/content/cases";
import type { TitleBlockRow } from "@/components/ui/TitleBlock";

export function caseTitleBlockRows(study: CaseStudy): TitleBlockRow[] {
  return [
    { label: "Status", value: "Projekt demonstracyjny", wide: true },
    { label: "Obszar", value: caseAreas[study.area] },
    { label: "Branża", value: caseSectors[study.sector] },
    { label: "Profil firmy", value: study.profile, wide: true },
    { label: "Harmonogram", value: study.duration, wide: true },
  ];
}
