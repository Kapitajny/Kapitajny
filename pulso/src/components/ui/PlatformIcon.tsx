import { serviceById, type ServiceId } from "@/data/services";

/** Oficjalny znak platformy (Simple Icons). Dekoracyjny: nazwa platformy jest zawsze obok w tekście. */
export function PlatformIcon({ id, className = "h-5 w-5" }: { id: ServiceId; className?: string }) {
  const s = serviceById(id)!;
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d={s.logo.path} />
    </svg>
  );
}
