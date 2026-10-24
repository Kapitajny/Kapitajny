/**
 * Etapy pracy zakładu w Płudach – rzeczywista kolejność procesu.
 * Lata oddania budynków według kroniki firmy (`content/history.ts`).
 */

export const productionSteps = [
  {
    id: "uboj",
    name: "Ubój",
    building: "Rzeźnia trzody i bydła, oddana w 2008 roku",
    text: "Żywiec trafia do rzeźni zakładu. Skupem trzody i bydła zajmuje się osobny dział, z którym kontaktują się hodowcy.",
  },
  {
    id: "rozbior",
    name: "Rozbiór",
    building: "Budynek rozbioru, oddany w 2004 roku",
    text: "Tusze dzielone są na ćwierćtusze, półtusze i elementy – dla odbiorców hurtowych i dla sklepów firmowych.",
  },
  {
    id: "przetworstwo",
    name: "Przetwórstwo",
    building: "Budynek przetwórstwa, oddany w 2005 roku",
    text: "Tu powstają wędzonki, kiełbasy, wyroby blokowe i podrobowe oraz wyroby garmażeryjne.",
  },
  {
    id: "sprzedaz",
    name: "Sprzedaż",
    building: "Hurtownie, sklepy firmowe, własny transport",
    text: "Gotowe wyroby jadą do hurtowni firmowych, sklepów i odbiorców na terenie województw lubelskiego i mazowieckiego.",
  },
] as const;
