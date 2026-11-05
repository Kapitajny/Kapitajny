import Image from "next/image";
import type { Project, Shot } from "@/data/projects";

/** Ramka przeglądarki – jedynie cienka belka z nazwą projektu, bez imitowania konkretnej przeglądarki. */
export function BrowserFrame({ shot, label, priority, sizes }: { shot: Shot; label: string; priority?: boolean; sizes: string }) {
  return (
    <figure className="overflow-hidden border border-ink/12 bg-white shadow-[0_40px_80px_-48px_rgb(10_22_51/0.55)]">
      <div aria-hidden="true" className="flex h-7 items-center gap-3 border-b border-ink/10 px-3 text-[0.6875rem] text-slate sm:h-8">
        <span className="h-1.5 w-6 bg-ink/15" />
        <span className="truncate">{label}</span>
      </div>
      <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} quality={85} priority={priority} className="block h-auto w-full" />
    </figure>
  );
}

export function PhoneFrame({ shot, sizes, className }: { shot: Shot; sizes: string; className?: string }) {
  return (
    <figure
      className={`overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-ink shadow-[0_30px_60px_-30px_rgb(10_22_51/0.6)] ${className ?? ""}`}
    >
      <Image src={shot.src} alt={shot.alt} width={shot.width} height={shot.height} sizes={sizes} quality={85} className="block h-auto w-full rounded-[1.25rem]" />
    </figure>
  );
}

export function leadShots(project: Project) {
  return {
    desktop: project.shots.find((shot) => shot.device === "desktop"),
    mobile: project.shots.find((shot) => shot.device === "mobile"),
  };
}
