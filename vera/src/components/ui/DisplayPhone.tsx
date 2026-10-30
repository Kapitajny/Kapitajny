/**
 * Phone number for large display type. Bodoni's “+” is a hairline that collides with the digits,
 * so the prefix sign is set in the sans-serif instead.
 */
export function DisplayPhone({ number }: { number: string }) {
  if (!number.startsWith("+")) return <>{number}</>;
  return (
    <>
      <span className="mr-[0.08em] align-[0.12em] font-sans text-[0.62em] font-normal">+</span>
      {number.slice(1)}
    </>
  );
}
