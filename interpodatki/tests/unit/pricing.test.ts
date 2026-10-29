import { describe, expect, it } from "vitest";
import {
  calculate,
  defaultCalculatorInput,
  documentSurcharge,
  normalizeCalculatorInput,
  type CalculatorInput,
} from "@/lib/pricing/calculator";
import { pricingConfig } from "@/lib/pricing/config";
import { packageForMonthly } from "@/lib/pricing/packages";
import { calculatorToParams, parseCalculatorParams } from "@/lib/pricing/params";
import { formatPLN } from "@/lib/format";

const input = (patch: Partial<CalculatorInput>): CalculatorInput => ({ ...defaultCalculatorInput, ...patch });

describe("kalkulator abonamentu", () => {
  it("domyślna JDG kosztuje dokładnie minimum 700 zł", () => {
    const r = calculate(defaultCalculatorInput);
    expect(r.ok).toBe(true);
    expect(r.monthly).toBe(700);
    expect(r.recommendedPackage.id).toBe("start");
    expect(r.range.min).toBe(700);
    expect(r.range.max).toBeGreaterThan(700);
  });

  it("dolicza dokumenty ponad limit stawką malejącą", () => {
    expect(documentSurcharge(0)).toBe(0);
    expect(documentSurcharge(10)).toBe(90);
    expect(documentSurcharge(80)).toBe(720);
    expect(documentSurcharge(100)).toBe(720 + 20 * 7);
    expect(documentSurcharge(300)).toBe(720 + 200 * 7 + 20 * 5);
    const r = calculate(input({ documents: 50 }));
    expect(r.monthly).toBe(700 + 30 * 9);
  });

  it("liczy spółkę z o.o. z kadrami, VAT i raportowaniem", () => {
    const r = calculate(
      input({
        businessType: "spzoo",
        legalForm: "spzoo",
        services: ["ksiegowosc", "vat", "kadry", "raportowanie"],
        documents: 80,
        employees: 10,
        scale: "mala",
      }),
    );
    // 1500 + 50×9 + 250 + (150 + 10×60) + 450 = 3400; ×1,1 = 3740
    expect(r.lines.reduce((s, l) => s + l.amount, 0)).toBe(3400);
    expect(r.monthly).toBe(3740);
    expect(r.recommendedPackage.id).toBe("pro");
    expect(r.requiresIndividualQuote).toBe(false);
  });

  it("zaznaczenie i odznaczenie usługi zmienia cenę o jej stawkę", () => {
    const base = calculate(input({ services: ["ksiegowosc"] })).monthly;
    const withVat = calculate(input({ services: ["ksiegowosc", "vat"] })).monthly;
    expect(withVat - base).toBe(pricingConfig.services.vat.monthly.jdg);
    expect(calculate(input({ services: ["ksiegowosc"] })).monthly).toBe(base);
  });

  it("pracownicy podnoszą cenę kadr i płac", () => {
    const a = calculate(input({ services: ["ksiegowosc", "kadry"], employees: 1 })).monthly;
    const b = calculate(input({ services: ["ksiegowosc", "kadry"], employees: 5 })).monthly;
    expect(b - a).toBe(4 * pricingConfig.services.kadry.perEmployee);
  });

  it("bez usług nie pokazuje ceny", () => {
    const r = calculate(input({ services: [] }));
    expect(r.ok).toBe(false);
    expect(r.monthly).toBe(0);
    expect(r.errors.length).toBeGreaterThan(0);
  });

  it("same usługi dodatkowe wyrównuje do minimum", () => {
    const r = calculate(input({ services: ["konsultacje"] }));
    expect(r.monthly).toBe(700);
    expect(r.adjustments.some((a) => a.id === "minimum")).toBe(true);
  });

  it("duże przedsiębiorstwo przekracza 10 000 zł i wymaga indywidualnej wyceny", () => {
    const r = calculate(
      input({
        businessType: "spzoo",
        legalForm: "spzoo",
        services: ["ksiegowosc", "vat", "kadry", "raportowanie", "doradztwo"],
        documents: 1200,
        employees: 60,
        scale: "duza",
        complexity: "wysoka",
      }),
    );
    expect(r.monthly).toBeGreaterThanOrEqual(10_000);
    expect(r.recommendedPackage.id).toBe("enterprise");
    expect(r.requiresIndividualQuote).toBe(true);
    expect(r.oneTimeFee).toBeNull();
  });

  it("indywidualny zakres poszerza przedział i wymaga wyceny", () => {
    const normal = calculate(input({}));
    const custom = calculate(input({ customScope: true }));
    expect(custom.range.max).toBeGreaterThan(normal.range.max);
    expect(custom.requiresIndividualQuote).toBe(true);
  });

  it("pilna obsługa dolicza 15% po mnożnikach", () => {
    const r = calculate(input({ urgent: true }));
    expect(r.monthly).toBe(810); // 700 × 1,15 = 805 → zaokrąglenie do 10 zł
  });

  it("nigdy nie zwraca kwot ujemnych ani nieprawidłowych", () => {
    const r = calculate(
      normalizeCalculatorInput({
        businessType: "<script>",
        services: ["ksiegowosc", "hack"],
        documents: -50,
        employees: Number.NaN,
        hrDocuments: "1e9",
        extraConsultationHours: -3,
      }),
    );
    expect(r.monthly).toBe(700);
    for (const line of [...r.lines, ...r.adjustments]) expect(line.amount).toBeGreaterThanOrEqual(0);
    expect(r.range.min).toBeLessThanOrEqual(r.monthly);
    expect(r.range.max).toBeGreaterThanOrEqual(r.monthly);
  });

  it("odrzuca formę prawną niepasującą do rodzaju działalności", () => {
    const n = normalizeCalculatorInput({ businessType: "jdg", legalForm: "akcyjna" });
    expect(n.legalForm).toBe("jdg");
  });

  it("przycina liczby do limitów konfiguracji", () => {
    const n = normalizeCalculatorInput({ documents: 999_999, employees: 5000 });
    expect(n.documents).toBe(pricingConfig.limits.documents.max);
    expect(n.employees).toBe(pricingConfig.limits.employees.max);
  });

  it("dobiera pakiet do kwoty", () => {
    expect(packageForMonthly(700).id).toBe("start");
    expect(packageForMonthly(1200).id).toBe("biznes");
    expect(packageForMonthly(2499).id).toBe("biznes");
    expect(packageForMonthly(5000).id).toBe("premium");
    expect(packageForMonthly(12_000).id).toBe("enterprise");
  });
});

describe("parametry URL kalkulatora", () => {
  it("zachowują konfigurację w obie strony", () => {
    const config = input({
      businessType: "ecommerce",
      legalForm: "spzoo",
      services: ["ksiegowosc", "vat", "ecommerce"],
      documents: 320,
      employees: 3,
      hrDocuments: 4,
      scale: "srednia",
      complexity: "podwyzszona",
      urgent: true,
      extraConsultationHours: 2,
    });
    const parsed = parseCalculatorParams(new URLSearchParams(calculatorToParams(config).toString()));
    expect(parsed).toEqual(config);
  });

  it("bez parametrów zwracają wartości domyślne", () => {
    expect(parseCalculatorParams(new URLSearchParams())).toEqual(defaultCalculatorInput);
  });
});

describe("formatowanie kwot", () => {
  it("grupuje tysiące", () => {
    expect(formatPLN(700)).toBe("700 zł");
    expect(formatPLN(1200)).toBe("1 200 zł");
    expect(formatPLN(12000)).toBe("12 000 zł");
  });
});
