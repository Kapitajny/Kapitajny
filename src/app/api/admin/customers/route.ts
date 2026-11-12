import { requireAdmin } from "@/lib/server/auth";
import { listCustomers } from "@/lib/server/repo";

export async function GET(request: Request) {
  const denied = requireAdmin(request);
  if (denied) return denied;
  return Response.json({ customers: listCustomers(new URL(request.url).searchParams.get("q") ?? "") });
}
