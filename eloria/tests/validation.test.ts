import { describe, expect, it } from "vitest";
import {
  formDataToObject,
  normalizePhone,
  todayInWarsaw,
  validateConsultation,
  validateContact,
  validateDateFrom,
  validateEmail,
  validateName,
} from "@/lib/validation";

const NOW = new Date("2026-10-30T10:00:00Z");

const validConsultation = {
  category: "kosmetologia",
  service: "oczyszczanie-skory",
  firstVisit: "tak",
  days: ["pn", "sr"],
  timeOfDay: "rano",
  dateFrom: "2026-11-05",
  name: "Anna Nowak-Kowalska",
  phone: "600 100 200",
  email: "Anna@Example.com ",
  contactBy: "telefon",
  message: "",
  consent: "on",
};

describe("pola podstawowe", () => {
  it("akceptuje polskie imiona i nazwiska dwuczłonowe", () => {
    expect(validateName("Małgorzata Żółkiewska-Ćwik")).toBeUndefined();
    expect(validateName("A")).toBeDefined();
    expect(validateName("Jan 3")).toBeDefined();
    expect(validateName("   ")).toBe("Podaj imię i nazwisko.");
  });

  it("sprawdza adres e-mail", () => {
    expect(validateEmail("ewa@eloria.pl")).toBeUndefined();
    expect(validateEmail("ewa@eloria")).toBeDefined();
    expect(validateEmail("ewa eloria.pl")).toBeDefined();
  });

  it("normalizuje numery telefonów", () => {
    expect(normalizePhone("600 100 200")).toBe("+48600100200");
    expect(normalizePhone("+48 600-100-200")).toBe("+48600100200");
    expect(normalizePhone("0048600100200")).toBe("+48600100200");
    expect(normalizePhone("+44 20 7946 0958")).toBe("+442079460958");
    expect(normalizePhone("12345")).toBeNull();
  });
});

describe("data „najwcześniej od”", () => {
  it("liczy dzisiejszą datę w strefie Europe/Warsaw", () => {
    // 23:30 UTC 31 grudnia to już 1 stycznia w Warszawie.
    expect(todayInWarsaw(new Date("2026-12-31T23:30:00Z"))).toBe("2027-01-01");
  });

  it("odrzuca daty z przeszłości i zbyt odległe", () => {
    expect(validateDateFrom("2026-10-30", NOW)).toBeUndefined();
    expect(validateDateFrom("2026-10-29", NOW)).toMatch(/minęła/);
    expect(validateDateFrom("2027-11-30", NOW)).toMatch(/12 miesięcy/);
    expect(validateDateFrom("30.11.2026", NOW)).toBeDefined();
    expect(validateDateFrom("", NOW)).toBeUndefined();
  });
});

describe("formularz kontaktowy", () => {
  it("zwraca oczyszczone dane dla poprawnego formularza", () => {
    const { data, errors } = validateContact({ name: " Ewa Lis ", email: "EWA@eloria.pl", phone: "", topic: "zabieg", message: "Dzień dobry, mam pytanie.", consent: "on" });
    expect(errors).toEqual({});
    expect(data).toEqual({ name: "Ewa Lis", email: "ewa@eloria.pl", phone: null, topic: "zabieg", message: "Dzień dobry, mam pytanie." });
  });

  it("zgłasza wszystkie błędne pola naraz", () => {
    const { data, errors } = validateContact({ name: "", email: "x", phone: "12", topic: "spam", message: "krótko" });
    expect(data).toBeNull();
    expect(Object.keys(errors).sort()).toEqual(["consent", "email", "message", "name", "phone", "topic"]);
  });
});

describe("zapytanie o konsultację", () => {
  it("przyjmuje poprawne zapytanie", () => {
    const { data, errors } = validateConsultation(validConsultation, NOW);
    expect(errors).toEqual({});
    expect(data).toMatchObject({ category: "kosmetologia", service: "oczyszczanie-skory", firstVisit: true, phone: "+48600100200", email: "anna@example.com", message: null });
  });

  it("odrzuca zabieg spoza wybranego obszaru", () => {
    const { errors } = validateConsultation({ ...validConsultation, service: "zabiegi-na-twarz" }, NOW);
    expect(errors.service).toMatch(/innego obszaru/);
  });

  it("pozwala na „nie wiem” z dowolnym zabiegiem lub bez zabiegu", () => {
    expect(validateConsultation({ ...validConsultation, category: "nie-wiem", service: "zabiegi-na-twarz" }, NOW).errors).toEqual({});
    expect(validateConsultation({ ...validConsultation, category: "nie-wiem", service: "" }, NOW).errors).toEqual({});
  });

  it("wymaga zgody, telefonu i odpowiedzi o pierwszej wizycie", () => {
    const { errors } = validateConsultation({ ...validConsultation, consent: undefined, phone: "", firstVisit: "" }, NOW);
    expect(Object.keys(errors).sort()).toEqual(["consent", "firstVisit", "phone"]);
  });

  it("odrzuca nieznane dni tygodnia", () => {
    expect(validateConsultation({ ...validConsultation, days: ["pn", "nd"] }, NOW).errors.days).toBeDefined();
  });
});

describe("formDataToObject", () => {
  it("zamienia pola wielokrotne na tablice i pomija pola techniczne", () => {
    const fd = new FormData();
    fd.append("days", "pn");
    fd.append("days", "wt");
    fd.append("name", "Ewa");
    fd.append("$ACTION_ID_abc", "");
    expect(formDataToObject(fd)).toEqual({ days: ["pn", "wt"], name: "Ewa" });
  });

  it("pojedynczy dzień też jest tablicą", () => {
    const fd = new FormData();
    fd.append("days", "sb");
    expect(formDataToObject(fd)).toEqual({ days: ["sb"] });
  });
});
