import "server-only";
import type { PaymentMethod, PaymentScenario } from "@/lib/payments";

/**
 * Interfejs operatora płatności. Wersja demo implementuje go bez połączenia sieciowego.
 *
 * Integracja produkcyjna (np. w środowisku sandbox operatora) powinna:
 * 1. tworzyć transakcję po stronie serwera z kwotą wyliczoną na serwerze (nigdy z przeglądarki),
 * 2. zwracać `redirectUrl` do strony operatora – dane kart obsługuje wyłącznie operator,
 * 3. oznaczać zamówienie jako opłacone dopiero po zweryfikowanym (podpisanym) powiadomieniu webhook,
 * 4. przechowywać klucze API i sekrety webhooków wyłącznie w zmiennych środowiskowych serwera.
 */
export type CreatePaymentInput = {
  orderId: string;
  amount: number;
  description: string;
  method: PaymentMethod;
  /** Tylko tryb demo: wybrany przez użytkownika scenariusz testowy. */
  scenario: PaymentScenario;
};

export type PaymentOutcome =
  | { status: "succeeded"; reference: string; message: string }
  | { status: "failed"; reference: string; message: string }
  | { status: "redirect"; reference: string; redirectUrl: string };

export interface PaymentProvider {
  readonly id: string;
  readonly isDemo: boolean;
  createPayment(input: CreatePaymentInput): Promise<PaymentOutcome>;
}
