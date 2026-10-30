export function DemoTag({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <span
      className={`inline-flex w-fit items-center gap-2 border px-2.5 py-1 text-[0.8125rem] font-medium ${
        tone === "light" ? "border-ink/20 text-ink" : "border-white/30 text-white"
      }`}
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-sky" />
      Koncepcja demonstracyjna
    </span>
  );
}
