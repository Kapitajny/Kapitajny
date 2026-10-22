export function isActivePath(pathname: string, href: string): "page" | "section" | null {
  if (pathname === href) return "page";
  if (href !== "/" && pathname.startsWith(`${href}/`)) return "section";
  return null;
}
