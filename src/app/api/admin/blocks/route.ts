import { requireAdmin } from "@/lib/server/auth";
import { errorResponse, readJson } from "@/lib/server/http";
import { createBlock, getJetski, listBlocks } from "@/lib/server/repo";
import { fromLocal, isDate, isTime, toMinutes } from "@/lib/time";
import { cleanText } from "@/lib/validation";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return Response.json({ blocks: listBlocks(Date.now() - 86_400_000) });
}

/** Blokada terminu: { jetskiId | null, startDate, startTime, endDate, endTime, reason } w czasie warszawskim. */
export async function POST(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  const b = (await readJson(request)) as Record<string, unknown> | undefined;
  if (!b || !isDate(b.startDate) || !isTime(b.startTime) || !isDate(b.endDate) || !isTime(b.endTime))
    return errorResponse(422, "validation", "Podaj datę i godzinę początku oraz końca blokady.");
  const start = fromLocal(b.startDate, toMinutes(b.startTime));
  const end = fromLocal(b.endDate, toMinutes(b.endTime));
  if (end <= start) return errorResponse(422, "validation", "Koniec blokady musi być po jej początku.");
  const jetskiId = typeof b.jetskiId === "string" && b.jetskiId ? b.jetskiId : null;
  if (jetskiId && !getJetski(jetskiId)) return errorResponse(404, "not-found", "Nie znaleziono skutera.");
  return Response.json({ block: createBlock({ jetskiId, start, end, reason: cleanText(b.reason, 160) || null }) }, { status: 201 });
}
