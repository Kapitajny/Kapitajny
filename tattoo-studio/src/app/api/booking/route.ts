import { handleBookingRequest } from "@/lib/server/booking";

export const runtime = "nodejs";
export const maxDuration = 30;

export async function POST(request: Request) {
  return handleBookingRequest(request);
}
