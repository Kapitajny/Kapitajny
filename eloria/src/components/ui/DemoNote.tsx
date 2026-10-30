/** Informacja, że treści medyczne są przykładowe (projekt demonstracyjny). */
export function DemoNote({ children, className = "" }: { children?: React.ReactNode; className?: string }) {
  return (
    <p className={`flex gap-3 border-l border-champagne py-1 pl-4 text-xs text-taupe ${className}`}>
      {children ?? "Treść przykładowa przygotowana na potrzeby projektu demonstracyjnego – wymaga weryfikacji przez personel medyczny kliniki."}
    </p>
  );
}
