import { calculate } from "@/lib/pricing/calculator";
import { parseCalculatorParams, hasCalculatorParams } from "@/lib/pricing/params";
import { pricingConfig } from "@/lib/pricing/config";
import { clientKey, jsonError, jsonOk, readJsonBody } from "@/lib/server/http";
import { saveInquiry } from "@/lib/server/inquiries";
import { rateLimit } from "@/lib/server/rate-limit";
import { ensureDemoSession } from "@/lib/server/session";
import { parseContact } from "@/lib/validation/contact";
import { parseQuote, BUDGETS } from "@/lib/validation/quote";
import { formatPLN } from "@/lib/format";

const MIN_FILL_MS = 2500;

export async function POST(request: Request) {
  const limit = rateLimit(`inquiry:${clientKey(request)}`, 8, 10 * 60 * 1000);
  if (!limit.allowed) {
    return jsonError(429, `Zbyt wiele zgłoszeń. Spróbuj ponownie za ${Math.ceil(limit.retryAfter / 60)} min.`);
  }
  const parsed = await readJsonBody(request);
  if (!parsed.ok) return parsed.response;
  const { body } = parsed;

  // Ochrona przed botami w wersji demo: pole-pułapka i minimalny czas wypełniania.
  // W produkcji należy dodać weryfikację CAPTCHA po stronie serwera (np. Cloudflare Turnstile).
  const startedAt = typeof body.startedAt === "number" ? body.startedAt : 0;
  if ((typeof body.website === "string" && body.website !== "") || Date.now() - startedAt < MIN_FILL_MS) {
    return jsonError(400, "Nie udało się zweryfikować formularza. Odśwież stronę i spróbuj ponownie.");
  }

  const values = (body.values && typeof body.values === "object" ? body.values : {}) as Record<string, unknown>;
  const sessionId = await ensureDemoSession();

  if (body.kind === "wycena") {
    const result = parseQuote(values);
    if (!result.ok) return jsonError(422, "Popraw zaznaczone pola.", { errors: result.errors });
    const d = result.data;
    let estimate = "";
    if (typeof body.calculatorQuery === "string" && body.calculatorQuery.length < 600) {
      const params = new URLSearchParams(body.calculatorQuery);
      if (hasCalculatorParams(params)) {
        const calc = calculate(parseCalculatorParams(params));
        if (calc.ok) estimate = `, szacunek z kalkulatora ${formatPLN(calc.monthly)}`;
      }
    }
    const inquiry = saveInquiry({
      kind: "wycena",
      sessionId,
      name: d.name,
      email: d.email,
      summary: `${pricingConfig.businessTypes[d.businessType].label}, ${d.documents} dok./mies., ${d.employees} prac., budżet: ${BUDGETS[d.budget]}${estimate}`,
    });
    return jsonOk({ number: inquiry.number, createdAt: inquiry.createdAt }, 201);
  }

  if (body.kind === "kontakt") {
    const result = parseContact(values);
    if (!result.ok) return jsonError(422, "Popraw zaznaczone pola.", { errors: result.errors });
    const inquiry = saveInquiry({
      kind: "kontakt",
      sessionId,
      name: result.data.name,
      email: result.data.email,
      summary: result.data.message,
    });
    return jsonOk({ number: inquiry.number, createdAt: inquiry.createdAt }, 201);
  }

  return jsonError(400, "Nieznany rodzaj zgłoszenia.");
}
