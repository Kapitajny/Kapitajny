"use server";

import { headers } from "next/headers";
import { contactTopics, formDataToObject, UNSURE, validateConsultation, validateContact, type ConsultationField, type ContactField } from "@/lib/validation";
import type { FormState } from "@/lib/form-state";
import { deliverSubmission } from "@/lib/server/deliver";
import { allowRequest } from "@/lib/server/rate-limit";
import { getCategory, getTreatment } from "@/data/treatments";

const CONSENT_TEXT = "I agree to VÉRA Aesthetic Studio processing my personal data to answer my enquiry, as described in the Privacy policy.";

async function clientKey(scope: string) {
  const h = await headers();
  const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local";
  return `${scope}:${ip}`;
}

/** Honeypot field, invisible to people – only bots fill it in. */
function isBot(formData: FormData) {
  return Boolean(String(formData.get("company") ?? "").trim());
}

export async function sendContactMessage(_prev: FormState<ContactField>, formData: FormData): Promise<FormState<ContactField>> {
  if (isBot(formData)) return { status: "sent", message: "Thank you for your message." };
  if (!allowRequest(await clientKey("contact"), 5, 10 * 60_000)) {
    return { status: "error", message: "Several messages were sent in a short time. Try again in a few minutes, or call the studio." };
  }

  const { data, errors } = validateContact(formDataToObject(formData));
  if (!data) return { status: "invalid", errors };

  const result = await deliverSubmission("contact", {
    ...data,
    topicLabel: contactTopics.find((t) => t.value === data.topic)?.label,
    consent: { text: CONSENT_TEXT, at: new Date().toISOString() },
  });
  if (result === "not_configured") return { status: "not_configured" };
  if (result === "failed") return { status: "error", message: "The message could not be sent. Try again shortly, or call the studio." };
  return { status: "sent", message: `Thank you, ${data.name.split(" ")[0]}. Your message has reached the studio – we reply during opening hours.` };
}

export async function requestConsultation(_prev: FormState<ConsultationField>, formData: FormData): Promise<FormState<ConsultationField>> {
  if (isBot(formData)) return { status: "sent", message: "Thank you for your request." };
  if (!allowRequest(await clientKey("consultation"), 5, 10 * 60_000)) {
    return { status: "error", message: "Several requests were sent in a short time. Try again in a few minutes, or call the studio." };
  }

  const { data, errors } = validateConsultation(formDataToObject(formData));
  if (!data) return { status: "invalid", errors };

  const result = await deliverSubmission("consultation", {
    ...data,
    categoryLabel: data.category === UNSURE ? "Not sure – please advise" : getCategory(data.category).name,
    treatmentLabel: data.treatment ? getTreatment(data.treatment)?.name : null,
    consent: { text: CONSENT_TEXT, at: new Date().toISOString() },
  });
  if (result === "not_configured") return { status: "not_configured" };
  if (result === "failed") return { status: "error", message: "The request could not be sent. Try again shortly, or call the studio." };
  const channel = data.contactBy === "phone" ? "call you" : "e-mail you";
  return {
    status: "sent",
    message: `Thank you, ${data.name.split(" ")[0]}. Your request has reached the studio and we will ${channel} to propose a consultation time. This is not yet a confirmed appointment.`,
  };
}
