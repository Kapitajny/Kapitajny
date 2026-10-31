/** Walidacja formularza kontaktowego — wspólna dla przeglądarki i serwera. */

export const propertyTypes = ["Apartament", "Dom jednorodzinny", "Inna przestrzeń"] as const;

export const scopes = [
  { value: "koncepcja", label: "Projekt koncepcyjny" },
  { value: "kompleksowy", label: "Projekt kompleksowy" },
  { value: "pod-klucz", label: "Projekt pod klucz" },
  { value: "konsultacja", label: "Konsultacja architektoniczna" },
  { value: "nie-wiem", label: "Jeszcze nie wiem" },
] as const;

export type ContactData = {
  name: string;
  email: string;
  phone: string;
  propertyType: string;
  area: string;
  scope: string;
  message: string;
  consent: boolean;
  website?: string; // pole-pułapka na boty, niewidoczne dla ludzi
};

export type ContactErrors = Partial<Record<keyof ContactData, string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateField(field: keyof ContactData, d: ContactData): string | undefined {
  switch (field) {
    case "name":
      if (!d.name.trim()) return "Podaj imię i nazwisko.";
      if (d.name.trim().length < 3) return "Imię i nazwisko powinno mieć co najmniej 3 znaki.";
      return;
    case "email":
      if (!d.email.trim()) return "Podaj adres e-mail, abyśmy mogli odpowiedzieć.";
      if (!EMAIL.test(d.email.trim())) return "Sprawdź adres e-mail — powinien wyglądać jak imie@domena.pl.";
      return;
    case "phone": {
      if (!d.phone.trim()) return;
      const digits = d.phone.replace(/[\s()-]/g, "");
      if (!/^\+?\d{9,15}$/.test(digits)) return "Wpisz numer telefonu z 9–15 cyfr, np. +48 600 000 000.";
      return;
    }
    case "propertyType":
      if (!propertyTypes.includes(d.propertyType as (typeof propertyTypes)[number])) return "Wybierz rodzaj nieruchomości.";
      return;
    case "area": {
      if (!d.area.trim()) return "Podaj przybliżony metraż.";
      const n = Number(d.area.replace(",", "."));
      if (!Number.isFinite(n) || n < 10 || n > 5000) return "Metraż powinien mieścić się w zakresie 10–5000 m².";
      return;
    }
    case "scope":
      if (!scopes.some((s) => s.value === d.scope)) return "Wybierz zakres współpracy.";
      return;
    case "message":
      if (d.message.trim().length < 30) return "Opisz projekt w kilku zdaniach (co najmniej 30 znaków).";
      if (d.message.length > 3000) return "Opis może mieć maksymalnie 3000 znaków.";
      return;
    case "consent":
      if (!d.consent) return "Zgoda jest potrzebna, abyśmy mogli odpowiedzieć na zapytanie.";
      return;
  }
}

export const fields: (keyof ContactData)[] = ["name", "email", "phone", "propertyType", "area", "scope", "message", "consent"];

export function validate(d: ContactData): ContactErrors {
  const errors: ContactErrors = {};
  for (const f of fields) {
    const e = validateField(f, d);
    if (e) errors[f] = e;
  }
  return errors;
}

export function parseContact(input: unknown): ContactData {
  const o = (input && typeof input === "object" ? input : {}) as Record<string, unknown>;
  const s = (k: string) => (typeof o[k] === "string" ? (o[k] as string).slice(0, 4000) : "");
  return {
    name: s("name"),
    email: s("email"),
    phone: s("phone"),
    propertyType: s("propertyType"),
    area: s("area"),
    scope: s("scope"),
    message: s("message"),
    consent: o.consent === true,
    website: s("website"),
  };
}
