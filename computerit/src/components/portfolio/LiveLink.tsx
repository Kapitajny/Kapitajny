import type { Project } from "@/data/projects";

/**
 * Przycisk do działającej wersji demonstracyjnej. Otwiera ją w tej samej karcie – na każdej stronie demo jest
 * przycisk „Wróć do portfolio” (scripts/add-demo-back-link.mjs), a działa też zwykłe „Wstecz”.
 */
export function LiveLink({ project, className = "btn btn-ink" }: { project: Project; className?: string }) {
  if (!project.liveUrl) return null;
  return (
    <a href={project.liveUrl} className={className}>
      {project.liveLabel ?? "Otwórz stronę"}
      <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3.5 2.5h6v6M9.5 2.5l-7 7" />
      </svg>
      <span className="sr-only"> – {project.name}, wersja demonstracyjna</span>
    </a>
  );
}
