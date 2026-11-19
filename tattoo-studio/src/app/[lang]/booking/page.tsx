import type { Metadata } from "next";
import { connection } from "next/server";
import { PLACEMENT_IDS, SIZE_IDS, STYLE_OPTIONS } from "@/config/booking";
import { buildMetadata, resolveLocale } from "@/i18n/metadata";
import type { BookingData } from "@/lib/booking/schema";
import { isDeliveryConfigured } from "@/lib/server/env";
import { BookingPageView } from "@/components/booking/BookingPageView";

export async function generateMetadata({ params }: PageProps<"/[lang]/booking">): Promise<Metadata> {
  return buildMetadata(await resolveLocale(params), "booking");
}

/** Wstępne wypełnienie z kalkulatora cen (?size=…&placement=…&style=…) — tylko znane wartości. */
function prefillFrom(params: Record<string, string | string[] | undefined>): Partial<BookingData> {
  const one = (key: string) => (typeof params[key] === "string" ? (params[key] as string) : "");
  const prefill: Partial<BookingData> = {};
  const size = SIZE_IDS.find((id) => id === one("size"));
  const placement = PLACEMENT_IDS.find((id) => id === one("placement"));
  const style = STYLE_OPTIONS.find((o) => o.id === one("style"));
  if (size) prefill.size = size;
  if (placement) prefill.placement = placement;
  if (style) prefill.styles = [style.id];
  return prefill;
}

export default async function BookingPage({ searchParams }: PageProps<"/[lang]/booking">) {
  // Konfiguracja odbioru zgłoszeń jest czytana przy każdym żądaniu (zmienne środowiskowe serwera).
  await connection();
  const prefill = prefillFrom(await searchParams);
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : null;
  return <BookingPageView prefill={prefill} deliveryConfigured={isDeliveryConfigured()} turnstileSiteKey={turnstileSiteKey} />;
}
