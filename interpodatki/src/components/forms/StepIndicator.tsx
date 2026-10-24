/** Pasek postępu formularza wieloetapowego. Na wąskich ekranach pokazuje tylko nazwę bieżącego kroku. */
export function StepIndicator({ steps, current, label }: { steps: string[]; current: number; label: string }) {
  return (
    <div className="mb-6">
      <p className="mb-2 text-sm font-semibold text-navy sm:hidden" aria-hidden="true">
        Krok {current + 1} z {steps.length}: {steps[current]}
      </p>
      <ol className="grid gap-2" style={{ gridTemplateColumns: `repeat(${steps.length}, minmax(0, 1fr))` }} aria-label={label}>
        {steps.map((title, index) => (
          <li key={title} aria-current={index === current ? "step" : undefined} className="min-w-0">
            <span className={`block h-1 rounded-full ${index <= current ? "bg-blue" : "bg-line"}`} aria-hidden="true" />
            <span
              className={`sr-only sm:not-sr-only sm:mt-2 sm:block sm:text-sm ${index === current ? "font-semibold text-navy" : "text-muted"}`}
            >
              <span className="sr-only">
                Krok {index + 1} z {steps.length}:{" "}
              </span>
              {title}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
