import Link from "next/link";

interface LogoProps {
  variant?: "dark" | "light";
  size?: "md" | "lg";
  /** Logo w nagłówku linkuje do strony głównej; w innych miejscach może być samym znakiem. */
  asLink?: boolean;
}

/**
 * Znak słowny BUŁA: kreska litery Ł jest czerwonym ukośnym cięciem –
 * ten sam motyw wraca w ściętych rogach przycisków i znacznikach cen.
 */
export function Logo({ variant = "dark", size = "md", asLink = true }: LogoProps) {
  const className = ["logo", variant === "light" && "logo--light", size === "lg" && "logo--lg"].filter(Boolean).join(" ");
  const mark = (
    <>
      <span className="logo__word" aria-hidden="true">
        BU<span className="logo__l">L</span>A
      </span>
      <span className="logo__sub" aria-hidden="true">
        burger house
      </span>
    </>
  );
  if (!asLink) {
    return (
      <span className={className} role="img" aria-label="BUŁA burger house">
        {mark}
      </span>
    );
  }
  return (
    <Link href="/" className={className} aria-label="BUŁA burger house – strona główna">
      {mark}
    </Link>
  );
}
