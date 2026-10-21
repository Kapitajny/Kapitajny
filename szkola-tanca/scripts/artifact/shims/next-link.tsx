import type { AnchorHTMLAttributes } from "react";
import { exportHref } from "./page-context";

type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean; replace?: boolean; scroll?: boolean };

/** Zastępuje `next/link` w eksporcie statycznym: zwykły link ze ścieżką względną. */
export default function Link({ href, prefetch, replace, scroll, target, ...rest }: LinkProps) {
  void prefetch;
  void replace;
  void scroll;
  const resolved = exportHref(href);
  // Podstrony eksportu otwieramy w tym samym oknie – nowa karta nie ma dostępu do plików artefaktu.
  return <a href={resolved} target={href.startsWith("/") ? undefined : target} {...rest} />;
}
