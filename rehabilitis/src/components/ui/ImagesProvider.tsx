"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { ImageKey, ImageManifest, ResolvedImage } from "@/config/images";

const ImagesContext = createContext<ImageManifest | null>(null);

export function ImagesProvider({ manifest, children }: { manifest: ImageManifest; children: ReactNode }) {
  return <ImagesContext.Provider value={manifest}>{children}</ImagesContext.Provider>;
}

export function useImage(key: ImageKey): ResolvedImage {
  const manifest = useContext(ImagesContext);
  if (!manifest) throw new Error("useImage must be used within ImagesProvider");
  return manifest[key];
}
