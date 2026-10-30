"use server";

import { headers } from "next/headers";
import { contactTopics, formDataToObject, UNSURE, validateConsultation, validateContact, type ConsultationField, type ContactField } from "@/lib/validation";
import type { FormState } from "@/lib/form-state";
import { deliverSubmission } from "@/lib/server/deliver";
import { allowRequest } from "@/lib/server/rate-limit";
import { getCategory, getTreatment } from "@/data/treatments";

const CONSENT_TEXT = "Wyrażam zgodę na przetwarzanie moich danych osobowych przez VÉRA Aesthetic Studio w celu odpowiedzi na zapytanie, zgodnie z Polityką prywatności.";

async function clientKey(scope: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}

/** Pole-pułapka niewidoczne dla ludzi – wypełniają je tylko boty. */
function isBot(formData: FormData) {
  return Boolean(String(formData.get("company") ?? "").trim());
}

export async function sendContactMessage(_prev: FormState<ContactField>, formData: FormData): Promise<FormState<ContactField>> {
  if (isBot(formData)) return { status: "sent", message: "Dziękujemy za wiadomość." };
  if (!allowRequest(await clientKey("contact"), 5, 10 * 60_000)) {
    return { status: "error", message: "Wysłano już kilka wiadomości w krótkim czasie. Spróbuj ponownie za kilka minut lub zadzwoń do studia." };
  }

  const { data, errors } = validateContact(formDataToObject(formData));
  if (!data) return { status: "invalid", errors };

  const result = await deliverSubmission("contact", {
    ...data,
    topicLabel: contactTopics.find((t) => t.value === data.topic)?.label,
    consent: { text: CONSENT_TEXT, at: new Date().toISOString() },
  });
  if (result === "not_configured") return { status: "not_configured" };
  if (result === "failed") return { status: "error", message: "Nie udało się wysłać wiadomości. Spróbuj ponownie za chwilę lub zadzwoń do studia." };
  return { status: "sent", message: `Dziękujemy, ${data.name.split(" ")[0]}. Wiadomość trafiła do studia – odpowiemy w godzinach otwarcia.` };
}

export async function requestConsultation(_prev: FormState<ConsultationField>, formData: FormData): Promise<FormState<ConsultationField>> {
  if (isBot(formData)) return { status: "sent", message: "Dziękujemy za zapytanie." };
  if (!allowRequest(await clientKey("consultation"), 5, 10 * 60_000)) {
    return { status: "error", message: "Wysłano już kilka zapytań w krótkim czasie. Spróbuj ponownie za kilka minut lub zadzwoń do studia." };
  }

  const { data, errors } = validateConsultation(formDataToObject(formData));
  if (!data) return { status: "invalid", errors };

  const result = await deliverSubmission("consultation", {
    ...data,
    categoryLabel: data.category === UNSURE ? "Nie wiem – proszę o doradztwo" : getCategory(data.category).name,
    treatmentLabel: data.treatment ? getTreatment(data.treatment)?.name : null,
    consent: { text: CONSENT_TEXT, at: new Date().toISOString() },
  });
  if (result === "not_configured") return { status: "not_configured" };
  if (result === "failed") return { status: "error", message: "Nie udało się wysłać zapytania. Spróbuj ponownie za chwilę lub zadzwoń do studia." };
  const channel = data.contactBy === "phone" ? "zadzwonimy" : "napiszemy";
  return {
    status: "sent",
    message: `Dziękujemy, ${data.name.split(" ")[0]}. Zapytanie trafiło do studia – ${channel}, aby zaproponować termin konsultacji. To jeszcze nie jest potwierdzenie wizyty.`,
  };
}
