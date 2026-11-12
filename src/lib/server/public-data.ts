import "server-only";

import { connection } from "next/server";
import { cache } from "react";
import { getBookingRules, getNoLicenseMode, getOpeningHours, getSettings, listJetskis } from "./repo";

/**
 * Dane publiczne strony (flota, ceny, godziny, ustawienia) – czytane przy każdym żądaniu,
 * żeby zmiany z panelu były widoczne od razu. `cache` łączy odczyty w obrębie jednego renderu.
 */
export const getPublicData = cache(async () => {
  await connection();
  const settings = getSettings();
  return {
    jetskis: listJetskis(),
    settings,
    hours: getOpeningHours(),
    rules: getBookingRules(settings),
    noLicenseMode: getNoLicenseMode(settings),
  };
});

export type PublicData = Awaited<ReturnType<typeof getPublicData>>;
