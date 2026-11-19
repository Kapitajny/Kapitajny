import { NextResponse, type NextRequest } from "next/server";

/**
 * Routing językowy:
 *  - polski (domyślny) bez prefiksu: `/`, `/regulamin` → wewnętrznie `/pl`, `/pl/regulamin`
 *  - angielski z prefiksem: `/en`, `/en/terms`
 *  - `/pl/...` przekierowujemy na adres bez prefiksu (jeden kanoniczny URL)
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/en" || pathname.startsWith("/en/")) return NextResponse.next();

  if (pathname === "/pl" || pathname.startsWith("/pl/")) {
    if (pathname.includes("opengraph-image")) return NextResponse.next();
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(3) || "/";
    return NextResponse.redirect(url, 308);
  }

  const url = request.nextUrl.clone();
  url.pathname = `/pl${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Bez API, plików Next.js i plików statycznych (wszystko z kropką w nazwie).
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
