"use client";

import { useEffect, useState } from "react";
import { getWarsawNow, type WarsawNow } from "@/lib/pickup";

/** Aktualny czas w Gdańsku, odświeżany co 30 s (lista godzin odbioru nie „starzeje się”). `null` przed hydratacją. */
export function useWarsawNow(): WarsawNow | null {
  const [now, setNow] = useState<WarsawNow | null>(null);
  useEffect(() => {
    const update = () =>
      setNow((prev) => {
        const next = getWarsawNow();
        return prev && prev.date === next.date && prev.minutes === next.minutes ? prev : next;
      });
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return now;
}
