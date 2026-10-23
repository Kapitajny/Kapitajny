export const CONTACT_TOPICS = [
  { value: "zamowienie", label: "Zamówienie i dostawa" },
  { value: "zwrot", label: "Zwrot lub reklamacja" },
  { value: "rozmiar", label: "Dobór rozmiaru" },
  { value: "wspolpraca", label: "Współpraca" },
  { value: "inne", label: "Inna sprawa" },
] as const;

export type ContactTopic = (typeof CONTACT_TOPICS)[number]["value"];
export const isContactTopic = (value: unknown): value is ContactTopic => CONTACT_TOPICS.some((t) => t.value === value);
