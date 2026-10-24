/**
 * Formularz kontaktowy – tematy, pola i walidacja wspólna dla przeglądarki i serwera.
 */

export const CONTACT_TOPICS = [
  { id: "handel", label: "Współpraca handlowa, zamówienia hurtowe", department: "Dział Zbytu", b2b: true },
  { id: "gastronomia", label: "Zaopatrzenie gastronomii, szkoły lub stołówki", department: "Dział Zbytu", b2b: true },
  { id: "eksport", label: "Sieci handlowe i eksport", department: "Dział Handlu i Eksportu", b2b: true },
  { id: "skup", label: "Skup żywca – jestem hodowcą", department: "Dział Skupu Żywca", b2b: false },
  { id: "praca", label: "Praca i rekrutacja", department: "Sekretariat", b2b: false },
  { id: "sklepy", label: "Sklepy firmowe i produkty", department: "Sekretariat", b2b: false },
  { id: "inne", label: "Inna sprawa", department: "Sekretariat", b2b: false },
] as const;

export type ContactTopicId = (typeof CONTACT_TOPICS)[number]["id"];

export const BUSINESS_TYPES = ["Hurtownia lub dystrybutor", "Sklep spożywczy lub mięsny", "Restauracja lub hotel", "Szkoła, stołówka, catering", "Sieć handlowa", "Inna działalność"] as const;

export const INTERESTS = ["Mięso", "Wędliny", "Wyroby garmażeryjne"] as const;

export interface ContactPayload {
  topic: ContactTopicId;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  // Pola wariantu B2B
  company: string;
  nip: string;
  businessType: string;
  region: string;
  interests: string[];
  /** Pułapka na boty – pole niewidoczne dla ludzi, musi pozostać puste. */
  website: string;
}

export type ContactErrors = Partial<Record<keyof ContactPayload, string>>;

export const LIMITS = { name: 120, email: 160, phone: 30, message: 4000, company: 160, region: 120 } as const;

export function isB2BTopic(topic: string): boolean {
  return CONTACT_TOPICS.some((t) => t.id === topic && t.b2b);
}

export function getTopic(topic: string) {
  return CONTACT_TOPICS.find((t) => t.id === topic);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Poprawność numeru NIP (10 cyfr z sumą kontrolną). Dopuszcza myślniki i spacje. */
export function isValidNip(value: string): boolean {
  const digits = value.replace(/[\s-]/g, "");
  if (!/^\d{10}$/.test(digits)) return false;
  const weights = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = weights.reduce((acc, w, i) => acc + w * Number(digits[i]), 0);
  return sum % 11 === Number(digits[9]);
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Normalizuje dane z niezaufanego źródła (JSON z przeglądarki). */
export function parseContactPayload(input: unknown): ContactPayload {
  const raw = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const interests = Array.isArray(raw.interests) ? raw.interests.filter((i): i is string => typeof i === "string" && (INTERESTS as readonly string[]).includes(i)) : [];
  return {
    topic: str(raw.topic) as ContactTopicId,
    name: str(raw.name),
    email: str(raw.email).toLowerCase(),
    phone: str(raw.phone),
    message: str(raw.message),
    consent: raw.consent === true,
    company: str(raw.company),
    nip: str(raw.nip),
    businessType: str(raw.businessType),
    region: str(raw.region),
    interests,
    website: str(raw.website),
  };
}

export function validateContact(data: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  if (!getTopic(data.topic)) errors.topic = "Wybierz temat wiadomości.";

  if (!data.name) errors.name = "Podaj imię i nazwisko.";
  else if (data.name.length > LIMITS.name) errors.name = `Maksymalnie ${LIMITS.name} znaków.`;

  if (!data.email) errors.email = "Podaj adres e-mail, abyśmy mogli odpowiedzieć.";
  else if (data.email.length > LIMITS.email || !EMAIL_RE.test(data.email)) errors.email = "Sprawdź adres e-mail – np. jan@firma.pl.";

  if (data.phone && !/^\+?[\d\s()-]{7,}$/.test(data.phone)) errors.phone = "Numer może zawierać cyfry, spacje i znak +.";
  else if (data.phone.length > LIMITS.phone) errors.phone = "Numer jest za długi.";

  if (data.message.length < 10) errors.message = "Napisz kilka słów o sprawie (min. 10 znaków).";
  else if (data.message.length > LIMITS.message) errors.message = `Maksymalnie ${LIMITS.message} znaków.`;

  if (isB2BTopic(data.topic)) {
    if (!data.company) errors.company = "Podaj nazwę firmy lub instytucji.";
    else if (data.company.length > LIMITS.company) errors.company = `Maksymalnie ${LIMITS.company} znaków.`;
    if (data.nip && !isValidNip(data.nip)) errors.nip = "NIP powinien mieć 10 cyfr z poprawną sumą kontrolną.";
    if (!(BUSINESS_TYPES as readonly string[]).includes(data.businessType)) errors.businessType = "Wybierz rodzaj działalności.";
    if (data.region.length > LIMITS.region) errors.region = `Maksymalnie ${LIMITS.region} znaków.`;
  }

  if (!data.consent) errors.consent = "Zaznacz zgodę, abyśmy mogli odpowiedzieć na wiadomość.";
  return errors;
}

export const CONSENT_TEXT =
  "Wyrażam zgodę na przetwarzanie podanych danych przez Zakład Mięsny „Wierzejki” J.M. Zdanowscy Sp.j. w celu odpowiedzi na wiadomość.";
