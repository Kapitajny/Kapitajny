import type { ReactNode } from "react";
import { IconAlert, IconCheck, IconInfo } from "./Icons";

const tones = {
  info: { box: "border-blue/30 bg-sky text-navy", icon: IconInfo, iconClass: "text-blue-ink" },
  demo: { box: "border-gold-ink/40 bg-[#fffaf0] text-ink", icon: IconInfo, iconClass: "text-gold-ink" },
  success: { box: "border-teal/50 bg-teal-wash text-navy", icon: IconCheck, iconClass: "text-teal-ink" },
  warning: { box: "border-warning/30 bg-warning-wash text-ink", icon: IconAlert, iconClass: "text-warning" },
  error: { box: "border-danger/40 bg-danger-wash text-ink", icon: IconAlert, iconClass: "text-danger" },
} as const;

export function Notice({
  tone = "info",
  title,
  children,
  role,
  className = "",
}: {
  tone?: keyof typeof tones;
  title?: string;
  children?: ReactNode;
  role?: "status" | "alert";
  className?: string;
}) {
  const t = tones[tone];
  const Icon = t.icon;
  return (
    <div role={role} className={`flex gap-3 rounded-[var(--radius-control)] border p-4 text-[0.9375rem] ${t.box} ${className}`}>
      <Icon size={20} className={`mt-0.5 shrink-0 ${t.iconClass}`} />
      <div className="min-w-0">
        {title && <p className="font-semibold text-navy">{title}</p>}
        {children && <div className={title ? "mt-1" : ""}>{children}</div>}
      </div>
    </div>
  );
}
