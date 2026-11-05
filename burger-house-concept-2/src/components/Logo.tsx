import Link from "next/link";

export function Logo({ withSub = true }: { withSub?: boolean }) {
  return (
    <Link href="/" className="logo" aria-label="BUŁA burger house – strona główna">
      <span className="logo__word" aria-hidden="true">
        buła<span className="logo__dot" />
      </span>
      {withSub && (
        <span className="logo__sub" aria-hidden="true">
          burger house
        </span>
      )}
    </Link>
  );
}
