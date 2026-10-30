/** Marks demo content that a specialist must review before publication. */
export function DemoNote({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={`border-l-2 border-rose pl-4 text-xs text-stone ${className}`}>
      {children ?? "Demo content prepared for a ComputerIT concept – to be reviewed by the studio's medical staff before publication."}
    </p>
  );
}
