"use server";

import { headers } from "next/headers";
import { deliverContact } from "@/lib/contact/delivery";
import { createRateLimiter } from "@/lib/contact/rate-limit";
import { inputFromFormData, validateContact } from "@/lib/contact/schema";
import { checkSpam } from "@/lib/contact/spam";
import type { ContactFormState } from "@/lib/contact/state";

const limiter = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

async function clientKey(): Promise<string> {
  const list = await headers();
  const forwarded = list.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || list.get("x-real-ip") || "unknown";
}

export async function submitContact(_previous: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const rate = limiter.check(await clientKey());
  if (!rate.allowed) {
    const minutes = Math.max(1, Math.ceil(rate.retryAfterMs / 60_000));
    return { status: "rate-limited", message: `Wysłano zbyt wiele zapytań z tego adresu. Spróbuj ponownie za ${minutes} min.` };
  }

  const spam = checkSpam(formData);
  if (!spam.ok) {
    console.warn("[kontakt] Odrzucono zgłoszenie przez filtr antyspamowy", { reason: spam.reason });
    return {
      status: "rejected",
      message:
        spam.reason === "too-fast"
          ? "Formularz został wysłany szybciej, niż zwykle robi to człowiek. Sprawdź dane i wyślij go ponownie."
          : "Nie udało się przyjąć formularza. Odśwież stronę i spróbuj ponownie.",
    };
  }

  const result = validateContact(inputFromFormData(formData));
  if (!result.ok) {
    return { status: "invalid", errors: result.errors, message: "Popraw zaznaczone pola i wyślij formularz ponownie." };
  }

  const delivery = await deliverContact(result.data);
  if (delivery.delivered) return { status: "sent", submittedAt: Date.now() };
  if (delivery.reason === "not-configured") return { status: "demo", submittedAt: Date.now() };
  return {
    status: "failed",
    message: "Nie udało się wysłać wiadomości z powodu błędu po naszej stronie. Twoje dane zostały w formularzu – spróbuj ponownie za kilka minut.",
  };
}
