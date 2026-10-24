import { calculate, type CalculatorInput } from "@/lib/pricing/calculator";
import { pricingConfig } from "@/lib/pricing/config";
import { getPackage, type ServicePackage } from "@/lib/pricing/packages";
import { calculatorToParams } from "@/lib/pricing/params";

export type OrderQuote =
  | {
      ok: true;
      pkg: ServicePackage;
      priceBasis: "calculator" | "package";
      lines: { label: string; amount: number }[];
      scope: string[];
      monthly: number;
      oneTimeFee: number;
      dueNow: number;
      calculatorQuery: string | null;
    }
  | { ok: false; reason: "unknown-package" | "individual-quote" | "invalid-config"; message: string };

/**
 * Wycena zamówienia – ta sama funkcja buduje podgląd w przeglądarce i kwoty zapisywane na serwerze.
 * Serwer zawsze liczy ją od nowa, więc zmiana kwot w przeglądarce nie wpływa na zamówienie.
 */
export function buildOrderQuote(packageId: string | null, calculator: CalculatorInput | null): OrderQuote {
  if (calculator) {
    const result = calculate(calculator);
    if (!result.ok) return { ok: false, reason: "invalid-config", message: result.errors[0] ?? "Nieprawidłowa konfiguracja." };
    if (result.requiresIndividualQuote || result.oneTimeFee === null) {
      return {
        ok: false,
        reason: "individual-quote",
        message: "Wybrany zakres wymaga indywidualnej wyceny – nie można go zamówić online.",
      };
    }
    const type = pricingConfig.businessTypes[calculator.businessType];
    return {
      ok: true,
      pkg: result.recommendedPackage,
      priceBasis: "calculator",
      lines: [...result.lines, ...result.adjustments].map(({ label, amount }) => ({ label, amount })),
      scope: [type.label, ...calculator.services.map((s) => pricingConfig.services[s].label)],
      monthly: result.monthly,
      oneTimeFee: result.oneTimeFee,
      dueNow: result.monthly + result.oneTimeFee,
      calculatorQuery: calculatorToParams(calculator).toString(),
    };
  }

  const pkg = getPackage(packageId);
  if (!pkg) return { ok: false, reason: "unknown-package", message: "Wybierz pakiet z listy." };
  if (!pkg.orderable || pkg.priceFrom === null || pkg.onboardingFee === null) {
    return {
      ok: false,
      reason: "individual-quote",
      message: `Pakiet ${pkg.name} wymaga indywidualnej wyceny – nie można go zamówić online.`,
    };
  }
  return {
    ok: true,
    pkg,
    priceBasis: "package",
    lines: [{ label: `Pakiet ${pkg.name} – cena wyjściowa`, amount: pkg.priceFrom }],
    scope: pkg.features,
    monthly: pkg.priceFrom,
    oneTimeFee: pkg.onboardingFee,
    dueNow: pkg.priceFrom + pkg.onboardingFee,
    calculatorQuery: null,
  };
}
