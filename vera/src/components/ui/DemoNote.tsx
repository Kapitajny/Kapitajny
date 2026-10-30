/** Marks content that must be verified before the site goes live. */
export function DemoNote({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <aside aria-label="Note about this content" className={`flex gap-4 border-l-2 border-rose pl-5 text-sm text-stone ${className}`}>
      <p>{children}</p>
    </aside>
  );
}
