import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label="BUŁA burger house – strona główna">
      <span aria-hidden="true">
        BU<span className="logo__l">L</span>A
      </span>
    </Link>
  );
}
