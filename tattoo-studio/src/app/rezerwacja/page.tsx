import type { Metadata } from "next";
import { connection } from "next/server";
import { PLACEMENT_OPTIONS, SIZE_OPTIONS, STYLE_OPTIONS } from "@/config/booking";
import { siteConfig } from "@/config/site";
import type { BookingData } from "@/lib/booking/schema";
import { isDeliveryConfigured } from "@/lib/server/env";
import { BookingPageView } from "@/components/booking/BookingPageView";

export const metadata: Metadata = {
  title: "Book your tattoo",
  description: `Opowiedz nam o swoim pomyśle na tatuaż. Formularz konsultacji studia ${siteConfig.name} w Warszawie: styl, miejsce, rozmiar, budżet i zdjęcia inspiracji.`,
  alternates: { canonical: "/rezerwacja" },
};

/** Wstępne wypełnienie z kalkulatora cen (?size=…&placement=…&style=…) — tylko znane wartości. */
function prefillFrom(params: Record<string, string | string[] | undefined>): Partial<BookingData> {
  const one = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const prefill: Partial<BookingData> = {};
  const size = SIZE_OPTIONS.find((o) => o.id === one("size"));
  const placement = PLACEMENT_OPTIONS.find((o) => o.id === one("placement"));
  const style = STYLE_OPTIONS.find((o) => o.id === one("style"));
  if (size) prefill.size = size.id;
  if (placement) prefill.placement = placement.id;
  if (style) prefill.styles = [style.id];
  return prefill;
}

export default async function BookingPage({ searchParams }: PageProps<"/rezerwacja">) {
  // Konfiguracja odbioru zgłoszeń jest czytana przy każdym żądaniu (zmienne środowiskowe serwera).
  await connection();
  const prefill = prefillFrom(await searchParams);
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : null;
  return (
    <BookingPageView prefill={prefill} deliveryConfigured={isDeliveryConfigured()} turnstileSiteKey={turnstileSiteKey} />
  );
}
