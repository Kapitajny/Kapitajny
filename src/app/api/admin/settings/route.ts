import { requireAdmin } from "@/lib/server/auth";
import { errorResponse, readJson } from "@/lib/server/http";
import { getSettings, updateSettings } from "@/lib/server/repo";
import { DEFAULT_SETTINGS } from "@/lib/server/seed";
import { cleanMultiline } from "@/lib/validation";

const NUMERIC: Record<string, [number, number]> = {
  prep_minutes: [0, 240],
  lead_minutes: [0, 2880],
  slot_step_minutes: [15, 120],
  horizon_days: [1, 365],
  cancel_free_hours: [0, 336],
};

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return Response.json({ settings: getSettings() });
}

export async function PUT(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const body = (await readJson(request)) as Record<string, unknown> | undefined;
  if (!body) return errorResponse(400, "invalid", "Nieprawidłowe dane.");
  const values: Record<string, string> = {};
  for (const key of Object.keys(DEFAULT_SETTINGS)) {
    if (!(key in body) || key === "hours_confirmed") continue;
    const raw = String(body[key] ?? "");
    if (key in NUMERIC) {
      const n = Number(raw);
      const [min, max] = NUMERIC[key];
      if (!Number.isInteger(n) || n < min || n > max) return errorResponse(422, "validation", `Wartość „${key}” musi być liczbą od ${min} do ${max}.`, key);
      values[key] = String(n);
    } else if (key === "no_license_mode") {
      if (!["models", "instructor", "hidden"].includes(raw)) return errorResponse(422, "validation", "Nieznany tryb sekcji „bez patentu”.", key);
      values[key] = raw;
    } else {
      values[key] = cleanMultiline(raw, 2000);
    }
  }
  return Response.json({ settings: updateSettings(values) });
}
