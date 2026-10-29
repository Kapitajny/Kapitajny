/** Walidacja demonstracyjnego formularza kontaktowego (wspólna dla obu koncepcji strony). */

export type ContactField = "name" | "email" | "message";
export type ContactErrors = Partial<Record<ContactField, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(data: FormData): ContactErrors {
  const errors: ContactErrors = {};
  const name = String(data.get("name") ?? "").trim();
  const email = String(data.get("email") ?? "").trim();
  const message = String(data.get("message") ?? "").trim();
  if (name.length < 2) errors.name = "Wpisz imię (co najmniej 2 znaki).";
  if (!EMAIL_PATTERN.test(email)) errors.email = "Wpisz poprawny adres e-mail, np. jan@example.com.";
  if (message.length < 10) errors.message = "Wiadomość powinna mieć co najmniej 10 znaków.";
  return errors;
}
