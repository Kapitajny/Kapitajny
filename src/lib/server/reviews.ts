import "server-only";

import { cacheLife } from "next/cache";
import { getGooglePlaces } from "./env";

export interface GoogleReview {
  author: string;
  authorUrl: string | null;
  rating: number;
  text: string;
  relativeTime: string;
}

export interface GoogleReviews {
  rating: number | null;
  count: number | null;
  reviews: GoogleReview[];
  mapsUrl: string | null;
}

/**
 * Prawdziwe opinie z Google (Places API New). Bez klucza i identyfikatora miejsca zwraca null –
 * strona pokazuje wtedy pusty stan. Wynik jest buforowany przez kilka godzin.
 */
export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  "use cache";
  cacheLife("hours");
  const cfg = getGooglePlaces();
  if (!cfg) return null;
  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(cfg.placeId)}?languageCode=pl`, {
      headers: { "X-Goog-Api-Key": cfg.apiKey, "X-Goog-FieldMask": "rating,userRatingCount,reviews,googleMapsUri" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      googleMapsUri?: string;
      reviews?: { rating?: number; relativePublishTimeDescription?: string; text?: { text?: string }; originalText?: { text?: string }; authorAttribution?: { displayName?: string; uri?: string } }[];
    };
    return {
      rating: data.rating ?? null,
      count: data.userRatingCount ?? null,
      mapsUrl: data.googleMapsUri ?? null,
      reviews: (data.reviews ?? [])
        .map((r) => ({
          author: r.authorAttribution?.displayName ?? "Użytkownik Google",
          authorUrl: r.authorAttribution?.uri ?? null,
          rating: r.rating ?? 0,
          text: r.text?.text ?? r.originalText?.text ?? "",
          relativeTime: r.relativePublishTimeDescription ?? "",
        }))
        .filter((r) => r.text),
    };
  } catch {
    return null;
  }
}
