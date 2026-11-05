import type { Project } from "@/data/projects";

/**
 * Okładka typograficzna dla koncepcji, do których nie dodano jeszcze zrzutów ekranu.
 * Zbudowana wyłącznie z nazwy, branży, palety i haseł samego projektu – nie udaje zrzutu strony.
 */
export function ProjectCover({ project, size = "md" }: { project: Project; size?: "md" | "lg" }) {
  const { background, foreground, accent } = project.palette;
  const [headline] = project.lines;

  return (
    <div
      role="img"
      aria-label={`Okładka projektu ${project.name}: hasło „${headline}”`}
      className="relative flex aspect-[4/3] h-full w-full flex-col justify-between overflow-hidden p-[7%]"
      style={{ background, color: foreground }}
    >
      <div aria-hidden="true" className="absolute inset-[4%] border" style={{ borderColor: `${foreground}26` }} />
      <div aria-hidden="true" className="relative flex items-center justify-between gap-4 text-[0.7rem] tracking-[0.2em] uppercase sm:text-xs">
        <span>{project.name}</span>
        <span className="h-px w-10" style={{ background: accent }} />
      </div>
      <p
        aria-hidden="true"
        className={`relative font-serif leading-[1.02] tracking-[-0.01em] text-balance ${
          size === "lg" ? "text-[clamp(2.25rem,5vw,4.5rem)]" : "text-[clamp(1.75rem,3vw,2.4rem)]"
        }`}
      >
        {headline}
      </p>
      <div aria-hidden="true" className="relative flex items-end justify-between gap-4 text-xs sm:text-sm" style={{ color: `${foreground}b3` }}>
        <span>{project.industry}</span>
        <span className="h-2.5 w-2.5 rounded-full" style={{ background: accent }} />
      </div>
    </div>
  );
}
