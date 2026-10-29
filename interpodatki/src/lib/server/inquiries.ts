import "server-only";
import { collection, maskEmail, publicNumber } from "./store";

export type InquiryKind = "wycena" | "kontakt";

export type StoredInquiry = {
  id: string;
  number: string;
  kind: InquiryKind;
  createdAt: string;
  sessionId: string;
  name: string;
  emailMasked: string;
  summary: string;
};

const inquiries = collection<StoredInquiry>("inquiries");

/**
 * Zapisuje zgłoszenie w magazynie demonstracyjnym. Nie wysyła e-maili ani nie przekazuje danych dalej.
 * Przechowujemy tylko imię, zamaskowany e-mail i krótkie podsumowanie.
 */
export function saveInquiry(args: { kind: InquiryKind; sessionId: string; name: string; email: string; summary: string }) {
  const inquiry: StoredInquiry = {
    id: crypto.randomUUID(),
    number: publicNumber(args.kind === "wycena" ? "DEMO-WYC" : "DEMO-KON"),
    kind: args.kind,
    createdAt: new Date().toISOString(),
    sessionId: args.sessionId,
    name: args.name,
    emailMasked: maskEmail(args.email),
    summary: args.summary.slice(0, 200),
  };
  inquiries.set(inquiry.id, inquiry);
  return inquiry;
}

export function listInquiriesForSession(sessionId: string | null): StoredInquiry[] {
  if (!sessionId) return [];
  return inquiries.filter((i) => i.sessionId === sessionId).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
