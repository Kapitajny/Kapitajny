/**
 * Walidacja formularzy (wspólna logika, testowana w `tests/validation.test.ts`).
 * Zwraca mapę `pole → komunikat`; pusty obiekt oznacza poprawne dane.
 */

export type FieldErrors<T extends string> = Partial<Record<T, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export interface TrialFormValues {
  name: string;
  email: string;
  style: string;
  level: string;
  day: string;
  message: string;
  privacy: boolean;
}

export type TrialField = keyof TrialFormValues;

export const MESSAGE_MAX_LENGTH = 800;

export function validateTrialForm(values: TrialFormValues): FieldErrors<TrialField> {
  const errors: FieldErrors<TrialField> = {};
  const name = values.name.trim();

  if (!name) errors.name = "Podaj swoje imię.";
  else if (name.length < 2) errors.name = "Imię powinno mieć co najmniej 2 znaki.";
  else if (name.length > 60) errors.name = "Imię może mieć maksymalnie 60 znaków.";

  if (!values.email.trim()) errors.email = "Podaj adres e-mail, abyśmy mogli odpowiedzieć.";
  else if (!isValidEmail(values.email)) errors.email = "Sprawdź adres e-mail – powinien wyglądać jak imie@domena.pl.";

  if (!values.style) errors.style = "Wybierz styl, który Cię interesuje (możesz zaznaczyć „Jeszcze nie wiem”).";
  if (!values.level) errors.level = "Wybierz swój poziom – to pomoże dobrać grupę.";

  if (values.message.length > MESSAGE_MAX_LENGTH) errors.message = `Wiadomość może mieć maksymalnie ${MESSAGE_MAX_LENGTH} znaków.`;

  if (!values.privacy) errors.privacy = "Potwierdź, że zapoznałaś/zapoznałeś się z informacją o przetwarzaniu danych.";

  return errors;
}

export interface NewsletterValues {
  email: string;
  consent: boolean;
}

export function validateNewsletter(values: NewsletterValues): FieldErrors<keyof NewsletterValues> {
  const errors: FieldErrors<keyof NewsletterValues> = {};
  if (!values.email.trim()) errors.email = "Podaj adres e-mail.";
  else if (!isValidEmail(values.email)) errors.email = "Sprawdź adres e-mail – powinien wyglądać jak imie@domena.pl.";
  if (!values.consent) errors.consent = "Zaznacz zgodę na otrzymywanie newslettera.";
  return errors;
}
