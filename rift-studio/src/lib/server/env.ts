import "server-only";

/** Konfiguracja serwera z ENV (patrz `.env.example`). Wartości czytane leniwie, w czasie żądania. */
export const env = {
  siteUrl: () => (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),

  /** `supabase`, gdy podano URL i klucz serwisowy; w przeciwnym razie lokalny SQLite. */
  storeKind: (): "supabase" | "sqlite" => {
    const forced = process.env.BOOKING_STORE;
    if (forced === "sqlite" || forced === "supabase") return forced;
    return process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY ? "supabase" : "sqlite";
  },
  sqlitePath: () => process.env.BOOKINGS_DB_PATH ?? "./data/bookings.db",
  supabase: () => ({ url: (process.env.SUPABASE_URL ?? "").replace(/\/$/, ""), key: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "" }),

  resendKey: () => process.env.RESEND_API_KEY ?? "",
  mailFrom: () => process.env.MAIL_FROM ?? "RIFT Studio <rezerwacje@riftstudio.pl>",
  studioEmail: () => process.env.STUDIO_NOTIFY_EMAIL ?? "",

  adminPassword: () => process.env.ADMIN_PASSWORD ?? "",
  adminSecret: () => process.env.ADMIN_SESSION_SECRET ?? "",
};
