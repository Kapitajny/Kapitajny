import { NextResponse, type NextRequest } from "next/server";
import { legacyRedirects } from "@/content/sources";

/**
 * Przekierowania 301 ze starych adresów witryny (np. /?kontakt=, /?historia=) na nowe podstrony.
 * Stara strona używała parametrów zapytania na stronie głównej, więc proxy działa tylko dla "/".
 */
export function proxy(request: NextRequest) {
  for (const key of request.nextUrl.searchParams.keys()) {
    const target = legacyRedirects[key];
    if (target) return NextResponse.redirect(new URL(target, request.url), 301);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};
