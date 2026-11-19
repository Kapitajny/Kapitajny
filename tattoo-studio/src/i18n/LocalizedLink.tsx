"use client";

import Link from "next/link";
import type { AnchorHTMLAttributes } from "react";
import { localizedPath, type RouteKey } from "./config";
import { useI18n } from "./I18nProvider";

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  route: RouteKey;
  /** Kotwica sekcji, np. "gallery". */
  hash?: string;
  query?: string;
};

/** Link do strony serwisu w aktualnie wybranym języku. */
export function LocalizedLink({ route, hash, query, ...rest }: Props) {
  const { lang } = useI18n();
  return <Link href={localizedPath(route, lang, hash, query)} {...rest} />;
}
