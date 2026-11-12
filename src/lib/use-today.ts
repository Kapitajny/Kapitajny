"use client";

import { useState } from "react";
import { toLocal } from "@/lib/time";

/** Dzisiejsza data w Warszawie, ustalona raz przy pierwszym renderze komponentu. */
export function useToday(): string {
  const [today] = useState(() => toLocal(Date.now()).date);
  return today;
}
