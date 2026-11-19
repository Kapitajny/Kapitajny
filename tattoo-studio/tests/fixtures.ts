import { EMPTY_BOOKING, type BookingData } from "@/lib/booking/schema";

export const VALID: BookingData = {
  ...EMPTY_BOOKING,
  fullName: "Anna Kowalska",
  email: "anna@example.com",
  phone: "",
  contactMethod: "email",
  description: "A koi fish swimming upstream with waves and cherry blossoms.",
  firstTattoo: "yes",
  designType: "new",
  styles: ["japanese-traditional"],
  placement: "forearm",
  side: "left",
  size: "medium",
  budget: "1000-2000",
  preferredDate: "2026-12-10",
  preferredTime: "any",
  privacyAccepted: true,
  accuracyConfirmed: true,
};
