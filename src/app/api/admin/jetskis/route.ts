import { parseJetski } from "@/lib/server/admin-input";
import { requireAdmin } from "@/lib/server/auth";
import { readJson } from "@/lib/server/http";
import { createJetski, listJetskis } from "@/lib/server/repo";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return Response.json({ jetskis: listJetskis({ includeInactive: true }) });
}

export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  const parsed = parseJetski(body ?? {});
  if (!parsed.value) return Response.json({ error: { code: "validation", message: "Popraw zaznaczone pola.", fields: parsed.errors } }, { status: 422 });
  return Response.json({ jetski: createJetski(parsed.value) }, { status: 201 });
}
