import type { ReactNode } from "react";
import type { MediaKey } from "@/content/media";
import { Photo } from "@/components/ui/Photo";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";

interface PageIntroProps {
  crumbs: Crumb[];
  title: ReactNode;
  lead?: ReactNode;
  /** `plain` – jasne tło; `green` – sekcje biznesowe; `split` – tekst ze zdjęciem obok. */
  variant?: "plain" | "green" | "split";
  media?: MediaKey;
  children?: ReactNode;
}

export function PageIntro({ crumbs, title, lead, variant = "plain", media, children }: PageIntroProps) {
  if (variant === "split" && media) {
    return (
      <header className="border-b border-line">
        <div className="container-x grid gap-10 py-10 lg:grid-cols-12 lg:gap-10 lg:py-14">
          <div className="flex flex-col lg:col-span-6">
            <Breadcrumbs items={crumbs} />
            <h1 className="display-xl mt-8 lg:mt-14">{title}</h1>
            {lead && <div className="lead mt-6 max-w-[36rem] text-ink/85">{lead}</div>}
            {children && <div className="mt-8">{children}</div>}
          </div>
          <div className="relative aspect-[4/3] overflow-hidden bg-linen lg:col-span-6 lg:aspect-auto lg:min-h-[28rem]">
            <Photo media={media} sizes="(min-width: 1024px) 48vw, 100vw" preload />
          </div>
        </div>
      </header>
    );
  }

  const green = variant === "green";
  return (
    <header className={green ? "on-dark bg-green text-on-dark" : "border-b border-line"}>
      <div className="container-x py-10 lg:py-14">
        <Breadcrumbs items={crumbs} tone={green ? "light" : "dark"} />
        <div className="mt-8 grid gap-8 lg:mt-14 lg:grid-cols-12 lg:items-end">
          <h1 className="display-xl lg:col-span-8">{title}</h1>
          {lead && <div className={`lead lg:col-span-4 ${green ? "text-on-dark/85" : "text-ink/85"}`}>{lead}</div>}
        </div>
        {children && <div className="mt-10">{children}</div>}
      </div>
    </header>
  );
}
