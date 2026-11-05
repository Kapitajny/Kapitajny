/** Krótkie przenikanie przy przejściu między podstronami (wyłączone przy prefers-reduced-motion). */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
