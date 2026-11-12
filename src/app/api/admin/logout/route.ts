import { cookies } from "next/headers";
import { sameOrigin, SESSION_COOKIE } from "@/lib/server/auth";
import { errorResponse } from "@/lib/server/http";

export async function POST(request: Request) {
  if (!sameOrigin(request)) return errorResponse(403, "forbidden", "Żądanie zostało odrzucone.");
  (await cookies()).delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
