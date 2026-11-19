import {
  PRICING,
  type PricingCharacterId,
  type PricingDetailId,
  type PricingPlacementId,
  type PricingSizeId,
} from "@/config/pricing";

export interface PricingSelection {
  size: PricingSizeId;
  placement: PricingPlacementId;
  detail: PricingDetailId;
  character: PricingCharacterId;
}

export interface PriceEstimate {
  min: number;
  max: number;
  currency: string;
}

function find<T extends { id: string }>(list: readonly T[], id: string): T {
  const item = list.find((entry) => entry.id === id);
  if (!item) throw new Error(`Unknown pricing option: ${id}`);
  return item;
}

function round(value: number): number {
  return Math.max(PRICING.minimumPrice, Math.round(value / PRICING.roundTo) * PRICING.roundTo);
}

/** Szacunkowy przedział ceny dla wybranych parametrów (wartości z `config/pricing.ts`). */
export function estimatePrice(selection: PricingSelection): PriceEstimate {
  const size = find(PRICING.sizes, selection.size);
  const factor =
    find(PRICING.placements, selection.placement).factor *
    find(PRICING.detail, selection.detail).factor *
    find(PRICING.character, selection.character).factor;
  const min = round(size.base[0] * factor);
  const max = Math.max(min + PRICING.roundTo, round(size.base[1] * factor));
  return { min, max, currency: PRICING.currency };
}

export function formatPrice(value: number): string {
  return new Intl.NumberFormat("pl-PL", { maximumFractionDigits: 0 }).format(value).replace(/ /g, " ");
}

/** Parametry przekazywane do formularza rezerwacji (wstępne wypełnienie). */
export function bookingQueryFor(selection: PricingSelection): string {
  const params = new URLSearchParams({
    size: find(PRICING.sizes, selection.size).bookingSize,
    placement: find(PRICING.placements, selection.placement).bookingPlacement,
    style: find(PRICING.character, selection.character).bookingStyle,
  });
  return params.toString();
}
