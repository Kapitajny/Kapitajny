"use client";

import { useEffect } from "react";
import { installPageNavigation } from "@/lib/contact-intent";

/** Włącza wspólną obsługę linków `#…` (przewijanie bez zmiany adresu, przekazanie wyboru do formularza). */
export function PageNavigation() {
  useEffect(() => installPageNavigation(), []);
  return null;
}
