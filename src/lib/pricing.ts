/**
 * Wspólna logika cen – używana przez przeglądarkę (podgląd) i serwer (wiążące wyliczenie).
 * Serwer nigdy nie ufa cenom przesłanym z przeglądarki: przelicza wszystko z katalogu.
 */
import { getProduct, type ChoiceRef, type Product } from "@/data/menu";
import { OPTION_GROUPS, type OptionChoice, type OptionGroupId } from "@/data/options";

export const ORDER_LIMITS = {
  maxQuantityPerLine: 10,
  maxItemsPerOrder: 20,
  maxLinesPerOrder: 15,
} as const;

export type OptionSelection = Partial<Record<OptionGroupId, string | string[]>>;

export interface CartLineInput {
  productId: string;
  options: OptionSelection;
  quantity: number;
}

export interface ResolvedGroup {
  id: OptionGroupId;
  label: string;
  type: "single" | "multiple";
  maxSelected?: number;
  choices: OptionChoice[];
  defaultChoice?: string;
}

export interface PricedLine {
  key: string;
  productId: string;
  name: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  /** Czytelne opisy wybranych opcji, np. „Mleko owsiane (+3,00 zł)”. */
  optionLabels: string[];
  options: OptionSelection;
}

export type LineResult = { ok: true; line: PricedLine } | { ok: false; error: string };

function resolveChoice(group: OptionGroupId, ref: ChoiceRef): OptionChoice {
  const id = typeof ref === "string" ? ref : ref.id;
  const base = OPTION_GROUPS[group].choices[id];
  if (!base) throw new Error(`Nieznana opcja "${id}" w grupie "${group}" – sprawdź data/menu.ts`);
  if (typeof ref === "string") return base;
  return { id, label: ref.label ?? base.label, priceDelta: ref.priceDelta ?? base.priceDelta };
}

/** Grupy opcji dostępne dla produktu – z etykietami i dopłatami właściwymi dla tego napoju. */
export function getProductGroups(product: Product): ResolvedGroup[] {
  return product.options.map((config) => {
    const definition = OPTION_GROUPS[config.group];
    return {
      id: config.group,
      label: config.label ?? definition.label,
      type: definition.type,
      maxSelected: definition.maxSelected,
      choices: config.choices.map((ref) => resolveChoice(config.group, ref)),
      defaultChoice: definition.type === "single" ? (config.defaultChoice ?? resolveChoice(config.group, config.choices[0]).id) : undefined,
    };
  });
}

export function getDefaultSelection(product: Product): OptionSelection {
  const selection: OptionSelection = {};
  for (const group of getProductGroups(product)) {
    selection[group.id] = group.type === "single" ? group.defaultChoice : [];
  }
  return selection;
}

/**
 * Sprawdza wybór opcji względem katalogu i zwraca znormalizowaną, wycenioną pozycję.
 * Odrzuca nieznane produkty, opcje spoza konfiguracji napoju i nieprawidłowe ilości.
 */
export function priceLine(input: CartLineInput): LineResult {
  if (!input || typeof input.productId !== "string") return { ok: false, error: "Nieprawidłowa pozycja zamówienia." };
  const product = getProduct(input.productId);
  if (!product) return { ok: false, error: "Wybrany produkt nie istnieje w menu." };
  if (!product.available) return { ok: false, error: `${product.name} jest chwilowo niedostępne.` };

  const quantity = input.quantity;
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > ORDER_LIMITS.maxQuantityPerLine) {
    return { ok: false, error: `Ilość musi być liczbą od 1 do ${ORDER_LIMITS.maxQuantityPerLine}.` };
  }

  const raw = input.options && typeof input.options === "object" ? input.options : {};
  const groups = getProductGroups(product);
  const allowedGroupIds = new Set(groups.map((g) => g.id));
  for (const key of Object.keys(raw)) {
    if (!allowedGroupIds.has(key as OptionGroupId)) {
      return { ok: false, error: `Opcja „${key}” nie jest dostępna dla napoju ${product.name}.` };
    }
  }

  const normalized: OptionSelection = {};
  const labels: string[] = [];
  const keyParts: string[] = [product.id];
  let unitPrice = product.basePrice;

  for (const group of groups) {
    const value = raw[group.id];
    if (group.type === "single") {
      if (typeof value !== "string") return { ok: false, error: `Wybierz: ${group.label.toLowerCase()} (${product.name}).` };
      const choice = group.choices.find((c) => c.id === value);
      if (!choice) return { ok: false, error: `Niedozwolona opcja „${value}” dla napoju ${product.name}.` };
      normalized[group.id] = choice.id;
      unitPrice += choice.priceDelta;
      labels.push(choice.priceDelta ? `${choice.label} (+${formatPrice(choice.priceDelta)})` : choice.label);
      keyParts.push(`${group.id}=${choice.id}`);
    } else {
      const values = value === undefined ? [] : value;
      if (!Array.isArray(values) || values.some((v) => typeof v !== "string")) {
        return { ok: false, error: `Nieprawidłowe dodatki dla napoju ${product.name}.` };
      }
      if (new Set(values).size !== values.length) return { ok: false, error: "Dodatki nie mogą się powtarzać." };
      if (group.maxSelected && values.length > group.maxSelected) {
        return { ok: false, error: `Możesz wybrać maksymalnie ${group.maxSelected} dodatki.` };
      }
      // Kolejność wg konfiguracji produktu – ta sama pozycja zawsze ma ten sam klucz.
      const chosen = group.choices.filter((c) => values.includes(c.id));
      if (chosen.length !== values.length) return { ok: false, error: `Niedozwolony dodatek dla napoju ${product.name}.` };
      normalized[group.id] = chosen.map((c) => c.id);
      for (const choice of chosen) {
        unitPrice += choice.priceDelta;
        labels.push(choice.priceDelta ? `${choice.label} (+${formatPrice(choice.priceDelta)})` : choice.label);
      }
      keyParts.push(`${group.id}=${chosen.map((c) => c.id).join("+")}`);
    }
  }

  return {
    ok: true,
    line: {
      key: keyParts.join("|"),
      productId: product.id,
      name: product.name,
      quantity,
      unitPrice,
      lineTotal: unitPrice * quantity,
      optionLabels: labels,
      options: normalized,
    },
  };
}

export type CartResult = { ok: true; lines: PricedLine[]; total: number; itemCount: number } | { ok: false; error: string };

/** Wycena całego koszyka z limitami ilościowymi. Identyczne pozycje są scalane. */
export function priceCart(inputs: unknown): CartResult {
  if (!Array.isArray(inputs) || inputs.length === 0) return { ok: false, error: "Koszyk jest pusty." };
  if (inputs.length > ORDER_LIMITS.maxLinesPerOrder) return { ok: false, error: "Zamówienie zawiera zbyt wiele pozycji." };

  const merged = new Map<string, PricedLine>();
  for (const input of inputs) {
    const result = priceLine(input as CartLineInput);
    if (!result.ok) return result;
    const existing = merged.get(result.line.key);
    if (existing) {
      const quantity = existing.quantity + result.line.quantity;
      if (quantity > ORDER_LIMITS.maxQuantityPerLine) {
        return { ok: false, error: `Ilość musi być liczbą od 1 do ${ORDER_LIMITS.maxQuantityPerLine}.` };
      }
      merged.set(existing.key, { ...existing, quantity, lineTotal: existing.unitPrice * quantity });
    } else {
      merged.set(result.line.key, result.line);
    }
  }

  const lines = [...merged.values()];
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  if (itemCount > ORDER_LIMITS.maxItemsPerOrder) {
    return { ok: false, error: `Jedno zamówienie może zawierać maksymalnie ${ORDER_LIMITS.maxItemsPerOrder} napojów.` };
  }
  return { ok: true, lines, itemCount, total: lines.reduce((sum, l) => sum + l.lineTotal, 0) };
}

const pln = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN" });
const plnWhole = new Intl.NumberFormat("pl-PL", { style: "currency", currency: "PLN", maximumFractionDigits: 0 });

/** 1600 → „16,00 zł”; z `compact` pełne złote bez groszy: „16 zł”. */
export function formatPrice(grosze: number, options: { compact?: boolean } = {}): string {
  if (options.compact && grosze % 100 === 0) return plnWhole.format(grosze / 100);
  return pln.format(grosze / 100);
}
