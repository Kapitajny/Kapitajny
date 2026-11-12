import { parseHours } from "@/lib/server/admin-input";
import { requireAdmin } from "@/lib/server/auth";
import { errorResponse, readJson } from "@/lib/server/http";
import { getOpeningHours, setOpeningHours, updateSettings } from "@/lib/server/repo";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return Response.json({ hours: getOpeningHours() });
}

export async function PUT(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const body = (await readJson(request)) as { hours?: unknown } | undefined;
  const parsed = parseHours(body?.hours);
  if (!parsed.value) return errorResponse(422, "validation", parsed.error ?? "Nieprawidłowe godziny.");
  setOpeningHours(parsed.value);
  updateSettings({ hours_confirmed: "1" });
  return Response.json({ hours: getOpeningHours() });
}
