import {
  checkEmail,
  checkName,
  checkPhone,
  cleanText,
  hasErrors,
  oneOfOrEmpty,
  type FieldErrors,
  type ValidationResult,
} from "./fields";

export const CONTACT_TOPICS = {
  wspolpraca: "Rozpoczęcie współpracy",
  oferta: "Pytanie o zakres usług",
  cennik: "Pytanie o cennik",
  inne: "Inna sprawa",
} as const;
export type ContactTopic = keyof typeof CONTACT_TOPICS;

export type ContactFormValues = {
  name: string;
  email: string;
  phone: string;
  topic: ContactTopic | "";
  message: string;
  consent: boolean;
};
export type ContactField = keyof ContactFormValues;
export type ContactData = Omit<ContactFormValues, "topic"> & { topic: ContactTopic };

export const emptyContact: ContactFormValues = { name: "", email: "", phone: "", topic: "", message: "", consent: false };

export function normalizeContact(raw: Record<string, unknown>): ContactFormValues {
  return {
    name: cleanText(raw.name, 80),
    email: cleanText(raw.email, 160).toLowerCase(),
    phone: cleanText(raw.phone, 30),
    topic: oneOfOrEmpty(Object.keys(CONTACT_TOPICS) as ContactTopic[], raw.topic),
    message: cleanText(raw.message, 2500),
    consent: raw.consent === true,
  };
}

export function validateContact(v: ContactFormValues): FieldErrors<ContactField> {
  const e: FieldErrors<ContactField> = {};
  const set = (k: ContactField, msg: string | undefined) => {
    if (msg) e[k] = msg;
  };
  set("name", checkName(v.name));
  set("email", checkEmail(v.email));
  set("phone", checkPhone(v.phone));
  set("topic", v.topic ? undefined : "Wybierz temat wiadomości.");
  if (v.message.length < 10) set("message", "Napisz wiadomość – co najmniej 10 znaków.");
  else if (v.message.length > 2000) set("message", "Wiadomość może mieć maksymalnie 2000 znaków.");
  else if (/[<>]/.test(v.message)) set("message", "Wiadomość nie może zawierać znaków < ani >.");
  set("consent", v.consent ? undefined : "Zaznacz zgodę, aby wysłać wiadomość.");
  return e;
}

export function parseContact(raw: Record<string, unknown>): ValidationResult<ContactData, ContactField> {
  const values = normalizeContact(raw);
  const errors = validateContact(values);
  if (hasErrors(errors)) return { ok: false, errors };
  return { ok: true, data: { ...values, topic: values.topic as ContactTopic } };
}
