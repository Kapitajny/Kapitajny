import "server-only";

import { env } from "../env";
import { SqliteStore } from "./sqlite";
import { SupabaseStore } from "./supabase";
import type { BookingStore } from "./types";

const globalForStore = globalThis as unknown as { riftBookingStore?: BookingStore };

/** Jedna instancja repozytorium na proces (również przy hot-reload w trybie deweloperskim). */
export function getStore(): BookingStore {
  if (!globalForStore.riftBookingStore) {
    if (env.storeKind() === "supabase") {
      const { url, key } = env.supabase();
      globalForStore.riftBookingStore = new SupabaseStore(url, key);
    } else {
      globalForStore.riftBookingStore = new SqliteStore(env.sqlitePath());
    }
  }
  return globalForStore.riftBookingStore;
}

/** Tylko dla testów. */
export function setStoreForTests(store: BookingStore | undefined) {
  globalForStore.riftBookingStore = store;
}

export type { Block, Booking, BookingStatus, BookingStore } from "./types";
