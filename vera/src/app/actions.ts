"use server";

import { headers } from "next/headers";
import type { FormState } from "@/lib/form-state";
import { deliver } from "@/lib/server/deliver";
import { allow } from "@/lib/server/rate-limit";
import { formToObject, subjects, validateBooking, validateContact, type BookingField, type ContactField } from "@/lib/validation";
import { getCategory, getTreatment } from "@/data/treatments";

const CONSENT = "I agree to VÉRA Aesthetic Studio processing my personal data to respond to this request, as described in the Privacy Policy.";

async function key(scope: string) {
  const h = await headers();
  return `${scope}:${h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip") || "local"}`;
}

/** Honeypot field – invisible to people, filled in only by bots. */
const isBot = (fd: FormData) => Boolean(String(fd.get("website") ?? "").trim());

export async function sendMessage(_: FormState<ContactField>, fd: FormData): Promise<FormState<ContactField>> {
  if (isBot(fd)) return { status: "sent", message: "Thank you." };
  if (!allow(await key("contact"), 5, 10 * 60_000)) return { status: "error", message: "Several messages were sent in a short time. Please try again in a few minutes, or call the studio." };
  const { data, errors } = validateContact(formToObject(fd));
  if (!data) return { status: "invalid", errors };
  const result = await deliver("contact", { ...data, subjectLabel: subjects.find((s) => s.value === data.subject)?.label, consent: { text: CONSENT, at: new Date().toISOString() } });
  if (result === "not_configured") return { status: "not_configured" };
  if (result === "failed") return { status: "error", message: "Your message couldn't be sent. Please try again shortly, or call the studio." };
  return { status: "sent", message: `Thank you, ${data.name.split(" ")[0]}. Your message has reached the studio – we reply during opening hours.` };
}

export async function requestConsultation(_: FormState<BookingField>, fd: FormData): Promise<FormState<BookingField>> {
  if (isBot(fd)) return { status: "sent", message: "Thank you." };
  if (!allow(await key("booking"), 5, 10 * 60_000)) return { status: "error", message: "Several requests were sent in a short time. Please try again in a few minutes, or call the studio." };
  const { data, errors } = validateBooking(formToObject(fd));
  if (!data) return { status: "invalid", errors };
  const result = await deliver("consultation", {
    ...data,
    areaLabel: data.area === "not-sure" ? "Not sure – please advise" : getCategory(data.area).name,
    treatmentLabel: data.treatment ? getTreatment(data.treatment)?.name : null,
    consent: { text: CONSENT, at: new Date().toISOString() },
  });
  if (result === "not_configured") return { status: "not_configured" };
  if (result === "failed") return { status: "error", message: "Your request couldn't be sent. Please try again shortly, or call the studio." };
  const how = data.contactBy === "phone" ? "call you" : "e-mail you";
  return {
    status: "sent",
    message: `Thank you, ${data.name.split(" ")[0]}. Your request has reached the studio – we'll ${how} to suggest a time. Your visit is not booked until we confirm it.`,
  };
}
