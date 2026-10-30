import type { Project } from "@/data/projects";

/** Przycisk do działającej wersji demonstracyjnej – otwiera się w nowej karcie, żeby portfolio zostało pod ręką. */
export function LiveLink({ project, className = "btn btn-ink" }: { project: Project; className?: string }) {
  if (!project.liveUrl) return null;
  return (
    <a href={project.liveUrl} target="_blank" rel="noopener" className={className}>
      {project.liveLabel ?? "Otwórz stronę"}
      <svg aria-hidden="true" viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M3.5 2.5h6v6M9.5 2.5l-7 7" />
      </svg>
      <span className="sr-only"> – {project.name}, wersja demonstracyjna, otwiera się w nowej karcie</span>
    </a>
  );
}
