/** Oznacza treści, które trzeba zweryfikować przed publikacją strony. */
export function DemoNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <aside aria-label="Uwaga dotycząca treści" className={`mx-auto max-w-2xl rounded-[1.5rem] bg-blush px-6 py-5 text-center text-sm text-stone ${className}`}>
      <p>{children}</p>
    </aside>
  );
}
