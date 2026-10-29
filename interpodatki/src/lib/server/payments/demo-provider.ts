import "server-only";
import { publicNumber } from "../store";
import type { CreatePaymentInput, PaymentOutcome, PaymentProvider } from "./provider";

/**
 * Operator demonstracyjny: nie wykonuje żadnych połączeń, nie przetwarza danych kart
 * i nie pobiera środków. Wynik zależy wyłącznie od wybranego scenariusza testowego.
 */
export const demoPaymentProvider: PaymentProvider = {
  id: "demo",
  isDemo: true,
  async createPayment({ scenario }: CreatePaymentInput): Promise<PaymentOutcome> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const reference = publicNumber("DEMO-PAY");
    switch (scenario) {
      case "success":
        return {
          status: "succeeded",
          reference,
          message: "Demonstracyjna transakcja zakończona powodzeniem. Nie pobrano żadnych środków.",
        };
      case "declined":
        return {
          status: "failed",
          reference,
          message: "Symulowana odmowa autoryzacji. W prawdziwym procesie poprosilibyśmy o inną metodę płatności.",
        };
      default:
        return {
          status: "failed",
          reference,
          message: "Symulowany błąd operatora. Spróbuj ponownie lub wybierz inną metodę.",
        };
    }
  },
};
