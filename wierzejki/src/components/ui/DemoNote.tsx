import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { InfoIcon } from "./Icons";

/** Notatka widoczna tylko w trybie demonstracyjnym – np. „dane do potwierdzenia przez firmę”. */
export function DemoNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  if (!siteConfig.demoMode) return null;
  return (
    <p className={`ui flex items-start gap-2.5 border-l-2 border-red bg-surface px-4 py-3 text-[0.875rem] leading-relaxed text-ink ${className}`}>
      <InfoIcon size={18} className="mt-0.5 shrink-0 text-red" />
      <span>{children}</span>
    </p>
  );
}
