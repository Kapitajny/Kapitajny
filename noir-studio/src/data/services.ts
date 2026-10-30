import type { ImageKey } from "@/config/images";

/** Rodzaje sesji w formularzu kontaktowym. Nazwy są w słownikach (`form.sessionTypes`). */
export const SESSION_TYPES = ["wedding", "portrait", "fashion", "commercial", "personal", "other"] as const;

export type SessionType = (typeof SESSION_TYPES)[number];

export interface Service {
  /** Klucz opisu usługi w słownikach (`services.items`). */
  id: "weddings" | "portraits" | "fashion" | "commercial" | "personal";
  session: SessionType;
  image: ImageKey;
}

export const SERVICES: Service[] = [
  { id: "weddings", session: "wedding", image: "serviceWeddings" },
  { id: "portraits", session: "portrait", image: "servicePortraits" },
  { id: "fashion", session: "fashion", image: "serviceFashion" },
  { id: "commercial", session: "commercial", image: "serviceCommercial" },
  { id: "personal", session: "personal", image: "servicePersonal" },
];
