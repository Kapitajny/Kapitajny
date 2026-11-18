# Plan 003: Footer links survive a basePath, and nothing draft gets indexed

> **Executor instructions**: Follow step by step, verify each step, honour STOP conditions, update `pulso/plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 7923f59..HEAD -- pulso/src/components/layout/SiteFooter.tsx pulso/src/app/sitemap.ts pulso/src/app/robots.ts pulso/src/app/layout.tsx`

## Status

- **Priority**: P1 · **Effort**: S · **Risk**: LOW · **Depends on**: none · **Category**: bug/SEO
- **Planned at**: commit `7923f59`, 2026-11-18

## Why this matters

The site is meant to be published as a static export, possibly under a sub-path (`PAGES_BASE_PATH=/demo/pulso` for
GitHub Pages). On the legal pages the footer builds plain `<a href="/#uslugi">` links, which ignore `basePath`
and 404 there. The sitemap emits relative `<loc>` values when `site.url` is null (invalid per the sitemap protocol),
and robots/metadata allow indexing although the legal pages are drafts with `[placeholders]` and prices are drafts.

## Current state

- `pulso/src/components/layout/SiteFooter.tsx`: `const hrefFor = (hash: string) => (home ? hash : \`/${hash}\`);` used in plain `<a>` for nav (`nav.map`) and service links.
- `pulso/src/lib/paths.ts`: `withBasePath(path)` prepends `process.env.NEXT_PUBLIC_BASE_PATH` (set in `next.config.ts`).
- `pulso/src/app/sitemap.ts`: `const base = site.url ?? ""; return ["/", ...].map((p) => ({ url: \`${base}${p}\` }));`
- `pulso/src/app/robots.ts`: always `allow: "/"`. `pulso/src/app/layout.tsx`: `robots: { index: true, follow: true }`.
- `pulso/src/config/site.ts`: `url: null`.

## Scope

In scope: the four files above. Out of scope: `next.config.ts`, legal page content.

## Steps

### Step 1: Footer links
When `home` is false, render `next/link` `<Link href={\`/${hash}\`}>` (Link adds basePath) for nav and service links.

**Verify**: `PAGES_BASE_PATH=/demo/pulso npm run build` then `grep -o 'href="[^"]*#uslugi"' out/polityka-prywatnosci/index.html` → contains `/demo/pulso/#uslugi`.

### Step 2: Indexing gated on a real URL
- `layout.tsx`: `robots: site.url ? { index: true, follow: true } : { index: false, follow: false }`.
- `robots.ts`: when `site.url` is null → `rules: { userAgent: "*", disallow: "/" }`.
- `sitemap.ts`: when `site.url` is null → return `[]`; otherwise prefix `process.env.NEXT_PUBLIC_BASE_PATH ?? ""`.
- Add a comment in `site.ts` above `url` explaining that setting it enables indexing.

**Verify**: `npm run build && cat out/robots.txt` → contains `Disallow: /`; `grep -c "<loc>" out/sitemap.xml` → `0`; `grep -c 'noindex' out/index.html` → ≥1.

## Done criteria

- [ ] Both verifications above pass
- [ ] `npm run typecheck && npm run lint && npm test && npm run build` exit 0

## STOP conditions

- `sitemap.ts` returning `[]` breaks the static export build.

## Maintenance notes

Before launch: set `site.url`, rebuild, confirm `robots.txt` allows and the sitemap lists absolute URLs.

## Execution notes

- Reproduced before the fix with `PAGES_BASE_PATH=/demo/pulso`: footer `href="/#uslugi"`, `Allow: /`, relative `<loc>`, no noindex.
- After: `href="/demo/pulso/#uslugi"`, `Disallow: /`, 0 `<loc>`, `noindex` present while `site.url` is null.
- Small deviation: footer link rendering moved into a module-level `SectionLink` component (instead of an inline ternary at each call site) to avoid duplicating classes.
- Gates: typecheck, lint, 30/30 tests, build — pass.
