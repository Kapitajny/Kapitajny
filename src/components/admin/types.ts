import type { BookingStatus } from "@/lib/rental";

export interface AdminBooking {
  id: string;
  number: string;
  jetskiId: string;
  jetskiName: string;
  customerId: string | null;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  start: number;
  end: number;
  duration: number;
  priceGr: number;
  depositGr: number | null;
  status: BookingStatus;
  customerNote: string | null;
  adminNote: string | null;
  createdAt: number;
  cancelledBy: string | null;
}

export interface Block {
  id: string;
  jetskiId: string | null;
  start: number;
  end: number;
  reason: string | null;
}

export type Settings = Record<string, string>;

export const STATUS_TONE: Record<BookingStatus, "warn" | "success" | "neutral" | "danger" | "info"> = {
  pending: "warn",
  confirmed: "success",
  completed: "neutral",
  cancelled: "danger",
  no_show: "danger",
};
