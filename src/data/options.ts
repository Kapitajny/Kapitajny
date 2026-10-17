/**
 * Biblioteka opcji personalizacji napojów.
 *
 * Ceny podawane są w groszach (1 zł = 100). Każdy produkt w `menu.ts`
 * wybiera z tej biblioteki tylko te opcje, które mają dla niego sens,
 * i może nadpisać etykietę lub dopłatę dla konkretnego napoju.
 */

export type OptionGroupId = "size" | "milk" | "temperature" | "ice" | "beans" | "extras";

export interface OptionChoice {
  id: string;
  label: string;
  /** Dopłata w groszach. */
  priceDelta: number;
}

export interface OptionGroupDefinition {
  id: OptionGroupId;
  label: string;
  /** `single` – dokładnie jeden wybór, `multiple` – dowolna liczba (do `maxSelected`). */
  type: "single" | "multiple";
  maxSelected?: number;
  choices: Record<string, OptionChoice>;
}

export const OPTION_GROUPS: Record<OptionGroupId, OptionGroupDefinition> = {
  size: {
    id: "size",
    label: "Rozmiar",
    type: "single",
    choices: {
      single: { id: "single", label: "Pojedyncze", priceDelta: 0 },
      doppio: { id: "doppio", label: "Doppio", priceDelta: 500 },
      s: { id: "s", label: "Mała · 200 ml", priceDelta: 0 },
      m: { id: "m", label: "Średnia · 300 ml", priceDelta: 300 },
      l: { id: "l", label: "Duża · 400 ml", priceDelta: 500 },
    },
  },
  milk: {
    id: "milk",
    label: "Mleko",
    type: "single",
    choices: {
      cow: { id: "cow", label: "Mleko krowie", priceDelta: 0 },
      oat: { id: "oat", label: "Mleko owsiane", priceDelta: 300 },
      "lactose-free": { id: "lactose-free", label: "Mleko bez laktozy", priceDelta: 200 },
    },
  },
  temperature: {
    id: "temperature",
    label: "Temperatura",
    type: "single",
    choices: {
      hot: { id: "hot", label: "Klasyczna", priceDelta: 0 },
      "extra-hot": { id: "extra-hot", label: "Extra hot", priceDelta: 0 },
      warm: { id: "warm", label: "Letnia", priceDelta: 0 },
      iced: { id: "iced", label: "Z lodem", priceDelta: 0 },
    },
  },
  ice: {
    id: "ice",
    label: "Lód",
    type: "single",
    choices: {
      regular: { id: "regular", label: "Standardowo", priceDelta: 0 },
      light: { id: "light", label: "Mniej lodu", priceDelta: 0 },
    },
  },
  beans: {
    id: "beans",
    label: "Ziarno",
    type: "single",
    choices: {
      house: { id: "house", label: "Blend NOIR", priceDelta: 0 },
      decaf: { id: "decaf", label: "Bezkofeinowe", priceDelta: 200 },
    },
  },
  extras: {
    id: "extras",
    label: "Dodatki",
    type: "multiple",
    maxSelected: 3,
    choices: {
      "extra-shot": { id: "extra-shot", label: "Dodatkowe espresso", priceDelta: 400 },
      vanilla: { id: "vanilla", label: "Syrop waniliowy", priceDelta: 300 },
      caramel: { id: "caramel", label: "Syrop karmelowy", priceDelta: 300 },
      whipped: { id: "whipped", label: "Bita śmietana", priceDelta: 300 },
    },
  },
};
