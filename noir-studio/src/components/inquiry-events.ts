import type { SessionType } from "@/data/services";

/** Zdarzenie przekazujące wybrany rodzaj sesji z sekcji usług do formularza kontaktowego. */
export const SESSION_EVENT = "noir:session";

export function requestSession(session: SessionType) {
  window.dispatchEvent(new CustomEvent<SessionType>(SESSION_EVENT, { detail: session }));
}
