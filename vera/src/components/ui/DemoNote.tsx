/** Oznacza treści, które trzeba zweryfikować przed publikacją strony. */
export function DemoNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <aside aria-label="Uwaga dotycząca treści" className={`flex gap-4 border-l-2 border-rose pl-5 text-sm text-stone ${className}`}>
      <p>{children}</p>
    </aside>
  );
}
