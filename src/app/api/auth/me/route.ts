import { currentUser } from "@/lib/server/session";

/** GET /api/auth/me – zalogowany użytkownik albo `null`. */
export async function GET() {
  const user = await currentUser();
  return Response.json({ user: user ? { firstName: user.firstName, email: user.email } : null }, { headers: { "Cache-Control": "no-store" } });
}
