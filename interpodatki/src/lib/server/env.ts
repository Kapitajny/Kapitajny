import "server-only";

/** Konfiguracja środowiskowa po stronie serwera. Sekrety nigdy nie trafiają do kodu przeglądarki. */
export const serverEnv = {
  paymentProvider: (process.env.PAYMENT_PROVIDER ?? "demo").trim() || "demo",
  isProduction: process.env.NODE_ENV === "production",
};
