/**
 * Minimalny, bezpieczny zapis formatowania w treściach: [etykieta](/adres), **pogrubienie**, `kod`.
 * Wynikiem są tokeny renderowane jako elementy Reacta – żaden fragment nie trafia do DOM jako HTML.
 */
export type InlineToken =
  | { type: "text"; value: string }
  | { type: "strong"; value: string }
  | { type: "code"; value: string }
  | { type: "link"; value: string; href: string };

const PATTERN = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|`([^`]+)`/g;

export function parseInline(source: string): InlineToken[] {
  const tokens: InlineToken[] = [];
  let lastIndex = 0;
  for (const match of source.matchAll(PATTERN)) {
    const index = match.index ?? 0;
    if (index > lastIndex) tokens.push({ type: "text", value: source.slice(lastIndex, index) });
    const [, label, href, strong, code] = match;
    if (label !== undefined && href !== undefined) tokens.push({ type: "link", value: label, href });
    else if (strong !== undefined) tokens.push({ type: "strong", value: strong });
    else if (code !== undefined) tokens.push({ type: "code", value: code });
    lastIndex = index + match[0].length;
  }
  if (lastIndex < source.length) tokens.push({ type: "text", value: source.slice(lastIndex) });
  return tokens;
}

/** Linki wewnętrzne zaczynają się od „/”; zewnętrzne dopuszczamy wyłącznie przez https. */
export function isInternalHref(href: string): boolean {
  return href.startsWith("/") && !href.startsWith("//");
}

export function isAllowedHref(href: string): boolean {
  return isInternalHref(href) || href.startsWith("https://");
}
