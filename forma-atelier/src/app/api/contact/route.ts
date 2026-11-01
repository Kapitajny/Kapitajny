import { parseContact, scopes, validate } from "@/lib/contact";

/**
 * Przyjmuje zapytanie z formularza. Wiadomość jest przekazywana dalej tylko wtedy,
 * gdy skonfigurowano CONTACT_WEBHOOK_URL — w przeciwnym razie odpowiadamy 503
 * i formularz jasno informuje, że nic nie zostało wysłane.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid_json" }, { status: 400 });
  }

  const data = parseContact(body);

  // pole-pułapka wypełnione → bot; udajemy sukces, nic nie wysyłamy
  if (data.website) return Response.json({ ok: true });

  const errors = validate(data);
  if (Object.keys(errors).length) return Response.json({ ok: false, reason: "invalid", errors }, { status: 422 });

  const webhook = process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return Response.json({ ok: false, reason: "not_configured" }, { status: 503 });

  const payload = {
    source: "forma-atelier.contact",
    receivedAt: new Date().toISOString(),
    name: data.name.trim(),
    email: data.email.trim(),
    phone: data.phone.trim() || null,
    propertyType: data.propertyType,
    areaM2: Number(data.area.replace(",", ".")),
    scope: scopes.find((s) => s.value === data.scope)?.label ?? data.scope,
    message: data.message.trim(),
    consent: true,
  };

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`webhook ${res.status}`);
  } catch (e) {
    console.error("[contact] webhook failed", e);
    return Response.json({ ok: false, reason: "delivery_failed" }, { status: 502 });
  }

  return Response.json({ ok: true });
}
