/** Model, walidacja i wysyłka wieloetapowego formularza kontaktowego (czysta logika, testowana). */
import { packageById, type PackageId } from "@/config/pricing";
import { serviceById, type ServiceId } from "@/data/services";

export type ServiceChoice = ServiceId | "unsure";

export const goals = [
  { id: "leads", label: "Pozyskanie klientów" },
  { id: "sales", label: "Zwiększenie sprzedaży" },
  { id: "awareness", label: "Rozpoznawalność marki" },
  { id: "traffic", label: "Zwiększenie ruchu na stronie" },
  { id: "other", label: "Inny cel" },
] as const;
export type GoalId = (typeof goals)[number]["id"];

/** Orientacyjny miesięczny budżet reklamowy (płacony platformom, poza opłatą za obsługę). */
export const budgets = [
  { id: "lt1500", label: "do 1 500 zł" },
  { id: "1500-3000", label: "1 500 – 3 000 zł" },
  { id: "3000-6000", label: "3 000 – 6 000 zł" },
  { id: "6000-12000", label: "6 000 – 12 000 zł" },
  { id: "gt12000", label: "powyżej 12 000 zł" },
  { id: "unknown", label: "Jeszcze nie wiem" },
] as const;
export type BudgetId = (typeof budgets)[number]["id"];

export type ContactFormData = {
  services: ServiceChoice[];
  package: PackageId | null;
  goal: GoalId | null;
  goalOther: string;
  budget: BudgetId | null;
  company: string;
  industry: string;
  website: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  /** Pole-pułapka na boty (niewidoczne dla ludzi). Wypełnione = zgłoszenie od bota. */
  website2: string;
};

export const emptyForm: ContactFormData = {
  services: [],
  package: null,
  goal: null,
  goalOther: "",
  budget: null,
  company: "",
  industry: "",
  website: "",
  name: "",
  email: "",
  phone: "",
  message: "",
  consent: false,
  website2: "",
};

export const steps = [
  { id: 1, title: "Usługa", heading: "Gdzie chcesz się reklamować?" },
  { id: 2, title: "Cel", heading: "Co reklama ma osiągnąć?" },
  { id: 3, title: "Budżet", heading: "Jaki miesięczny budżet reklamowy rozważasz?" },
  { id: 4, title: "Firma", heading: "Opowiedz krótko o firmie" },
  { id: 5, title: "Kontakt", heading: "Jak możemy się z Tobą skontaktować?" },
  { id: 6, title: "Podsumowanie", heading: "Sprawdź i wyślij" },
] as const;
export type StepId = (typeof steps)[number]["id"];

export type FieldName = keyof ContactFormData;
export type FormErrors = Partial<Record<FieldName, string>>;

export const limits = { short: 120, website: 200, message: 1500 } as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeWebsite(value: string): string {
  const v = value.trim();
  if (!v) return "";
  return /^https?:\/\//i.test(v) ? v : `https://${v}`;
}

export function isValidWebsite(value: string): boolean {
  const v = value.trim();
  if (!v) return true;
  try {
    const url = new URL(normalizeWebsite(v));
    return /\.[a-z]{2,}$/i.test(url.hostname) && !/\s/.test(v);
  } catch {
    return false;
  }
}

export function isValidPhone(value: string): boolean {
  const v = value.trim();
  if (!/^\+?[\d\s\-()]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15;
}

export function validateStep(step: StepId, d: ContactFormData): FormErrors {
  const e: FormErrors = {};
  switch (step) {
    case 1:
      if (d.services.length === 0) e.services = "Zaznacz co najmniej jedną opcję. Jeśli nie wiesz, wybierz „Nie wiem”.";
      break;
    case 2:
      if (!d.goal) e.goal = "Wybierz cel reklamy.";
      else if (d.goal === "other" && d.goalOther.trim().length < 3) e.goalOther = "Opisz krótko swój cel (min. 3 znaki).";
      break;
    case 3:
      if (!d.budget) e.budget = "Wybierz orientacyjny budżet. Możesz zaznaczyć „Jeszcze nie wiem”.";
      break;
    case 4:
      if (d.company.trim().length < 2) e.company = "Podaj nazwę firmy.";
      else if (d.company.length > limits.short) e.company = `Nazwa może mieć maks. ${limits.short} znaków.`;
      if (d.industry.trim().length < 2) e.industry = "Podaj branżę, np. „usługi remontowe” lub „sklep z odzieżą”.";
      else if (d.industry.length > limits.short) e.industry = `Branża może mieć maks. ${limits.short} znaków.`;
      if (d.website.length > limits.website || !isValidWebsite(d.website))
        e.website = "Adres strony wygląda na niepoprawny, np. firma.pl. To pole możesz zostawić puste.";
      break;
    case 5:
      if (d.name.trim().length < 2) e.name = "Podaj imię.";
      else if (d.name.length > limits.short) e.name = `Imię może mieć maks. ${limits.short} znaków.`;
      if (!d.email.trim()) e.email = "Podaj adres e-mail.";
      else if (!EMAIL_RE.test(d.email.trim())) e.email = "Adres e-mail wygląda na niepoprawny, np. jan@firma.pl.";
      if (!d.phone.trim()) e.phone = "Podaj numer telefonu.";
      else if (!isValidPhone(d.phone)) e.phone = "Numer telefonu powinien mieć 9–15 cyfr, np. 600 100 200.";
      if (d.message.length > limits.message) e.message = `Wiadomość może mieć maks. ${limits.message} znaków.`;
      break;
    case 6:
      if (!d.consent) e.consent = "Zgoda jest potrzebna, żebyśmy mogli odpowiedzieć na zgłoszenie.";
      break;
  }
  return e;
}

/** Pierwszy krok z błędem (dla zabezpieczenia przed wysłaniem niekompletnych danych). */
export function firstInvalidStep(d: ContactFormData): StepId | null {
  for (const s of steps) {
    if (Object.keys(validateStep(s.id, d)).length) return s.id;
  }
  return null;
}

export function serviceLabels(d: ContactFormData): string[] {
  return d.services.map((s) => (s === "unsure" ? "Nie wiem, która platforma będzie odpowiednia" : (serviceById(s)?.name ?? s)));
}

export function goalLabel(d: ContactFormData): string {
  if (!d.goal) return "";
  if (d.goal === "other") return `Inny cel: ${d.goalOther.trim()}`;
  return goals.find((g) => g.id === d.goal)?.label ?? "";
}

export function budgetLabel(d: ContactFormData): string {
  return budgets.find((b) => b.id === d.budget)?.label ?? "";
}

export function summaryRows(d: ContactFormData): { step: StepId; label: string; value: string }[] {
  const pkg = packageById(d.package);
  return [
    { step: 1, label: "Usługi", value: serviceLabels(d).join(", ") },
    ...(pkg ? [{ step: 1 as StepId, label: "Wybrany pakiet", value: `${pkg.name} (${pkg.platformsLabel})` }] : []),
    { step: 2, label: "Cel reklamy", value: goalLabel(d) },
    { step: 3, label: "Miesięczny budżet reklamowy", value: budgetLabel(d) },
    { step: 4, label: "Firma", value: d.company.trim() },
    { step: 4, label: "Branża", value: d.industry.trim() },
    { step: 4, label: "Strona internetowa", value: d.website.trim() ? normalizeWebsite(d.website) : "nie podano" },
    { step: 5, label: "Imię", value: d.name.trim() },
    { step: 5, label: "E-mail", value: d.email.trim() },
    { step: 5, label: "Telefon", value: d.phone.trim() },
    { step: 5, label: "Wiadomość", value: d.message.trim() || "brak" },
  ];
}

export function summaryText(d: ContactFormData): string {
  return ["Zgłoszenie PULSO", "", ...summaryRows(d).map((r) => `${r.label}: ${r.value}`)].join("\n");
}

export function buildPayload(d: ContactFormData, accessKey?: string | null): Record<string, string | boolean> {
  const payload: Record<string, string | boolean> = {
    _subject: `Nowe zgłoszenie PULSO: ${d.company.trim()}`,
    uslugi: serviceLabels(d).join(", "),
    pakiet: packageById(d.package)?.name ?? "",
    cel: goalLabel(d),
    budzet: budgetLabel(d),
    firma: d.company.trim(),
    branza: d.industry.trim(),
    strona: d.website.trim() ? normalizeWebsite(d.website) : "",
    imie: d.name.trim(),
    email: d.email.trim(),
    telefon: d.phone.trim(),
    wiadomosc: d.message.trim(),
    zgoda: d.consent,
    // Pułapka na boty: Formspree (_gotcha) i Web3Forms (botcheck) odrzucają zgłoszenia z wypełnionym polem.
    _gotcha: d.website2,
    botcheck: d.website2,
  };
  if (accessKey) payload.access_key = accessKey;
  return payload;
}

export type SubmitResult = { ok: true } | { ok: false; reason: "not-configured" | "network" | "rejected" };

export async function submitContact(
  endpoint: string | null,
  d: ContactFormData,
  accessKey?: string | null,
  fetchImpl: typeof fetch = fetch,
): Promise<SubmitResult> {
  if (!endpoint) return { ok: false, reason: "not-configured" };
  // Bot wypełnił niewidoczne pole: udajemy sukces wobec bota, ale niczego nie wysyłamy.
  if (d.website2.trim()) return { ok: true };
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetchImpl(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(buildPayload(d, accessKey)),
      signal: controller.signal,
    });
    return res.ok ? { ok: true } : { ok: false, reason: "rejected" };
  } catch {
    return { ok: false, reason: "network" };
  } finally {
    clearTimeout(timer);
  }
}

/** Dodaje wybór z przycisku CTA do formularza, nie kasując wcześniejszych odpowiedzi. */
export function applyIntent(d: ContactFormData, intent: { services?: ServiceId[]; package?: PackageId }): ContactFormData {
  let services = d.services;
  if (intent.services?.length) {
    const merged = new Set<ServiceChoice>(services.filter((s) => s !== "unsure"));
    intent.services.forEach((s) => merged.add(s));
    services = [...merged];
  }
  return { ...d, services, package: intent.package ?? d.package };
}
