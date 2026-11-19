/**
 * Dokumenty prawne jako dane. W tekście:
 *  - {{companyName}}, {{companyAddress}}, {{nip}}, {{regon}}, {{email}}, {{phone}}, {{studio}} — dane z `config/site.ts`
 *    (puste pola pokazują oznaczenie „do uzupełnienia”),
 *  - {{link:privacy}}, {{link:terms}} — link do drugiego dokumentu,
 *  - [[…]] — miejsce do uzupełnienia przez studio.
 */
export type LegalBlock = { p: string } | { ul: string[] } | { ol: string[] };

export interface LegalDocument {
  sections: { heading: string; blocks: LegalBlock[] }[];
}

export interface LegalContent {
  tokenLabels: Record<"companyName" | "companyAddress" | "nip" | "regon" | "email" | "phone", string>;
  terms: LegalDocument;
  privacy: LegalDocument;
}
