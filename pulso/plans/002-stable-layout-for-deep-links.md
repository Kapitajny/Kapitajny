# Plan 002: Deep links like `/#kontakt` land on their target on desktop

> **Executor instructions**: Follow step by step; run every verification. STOP conditions mean stop and report.
> Update `pulso/plans/README.md` when done.
>
> **Drift check (run first)**: `git diff --stat 7923f59..HEAD -- pulso/src/components/sections/Process.tsx pulso/src/app/globals.css`

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: MED (sticky layout + scroll math)
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `7923f59`, 2026-11-18

## Why this matters

The Process section switches to a pinned, 320vh-tall scrollytelling layout only after hydration (`pinned` state starts
`false`). On desktop, opening `/#kontakt` (from the legal pages' "Kontakt" button, a shared link, or a reload) scrolls
to the form, then everything below Process jumps down ~2 viewports. Measured: the form ends 2060 px below the
viewport top at 1440×900. Every section below Process (`#opinie`, `#cennik`, `#faq`, `#kontakt`) is affected.

## Current state

- `pulso/src/components/sections/Process.tsx`:
  ```tsx
  const mq = window.matchMedia("(min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)");
  ...
  <div ref={wrap} style={pinned ? { height: "320vh" } : undefined}>
    <div className={pinned ? "sticky top-0 flex h-screen ..." : "section"}>
  ```
  In static HTML (pre-hydration) the non-pinned layout renders: Gantt + a 6-item description list.

## Commands (inside `pulso/`)

`npm run build` → exit 0; then `npx serve out -l 4310` and the Playwright check below.

## Scope

In scope: `pulso/src/components/sections/Process.tsx`, `pulso/src/app/globals.css`.
Out of scope: other sections, the nav, `contact-intent.ts`.

## Steps

### Step 1: Write the failing browser check
Create `pulso/tests/e2e/deeplink.mjs` (plain Node + `playwright`, which is preinstalled):
open `http://localhost:4310/#kontakt` at 1440×900, wait for `networkidle` + 1500 ms, assert
`document.getElementById('kontakt-formularz').getBoundingClientRect().top` is between 0 and 450. Exit code 1 otherwise.

**Verify**: `node tests/e2e/deeplink.mjs` → exits 1 (prints ~2060).

### Step 2: Reserve the pinned height in CSS, before hydration
- Give the wrapper a class `process-track` and remove the inline `height`.
- In `globals.css`: `@media (min-width: 1024px) and (min-height: 640px) and (prefers-reduced-motion: no-preference) { .process-track { height: 320vh; } }`.
- When `pinned` is false but the media query matches (pre-hydration), the inner content must not leave a 2-viewport gap:
  render the pinned markup by default when the media query matches is impossible on the server, so instead make the
  inner container `sticky top-0` via the same media query in CSS (class `process-stage`), and keep the static list hidden
  inside that media query (`.process-static-list { display: none }`), shown otherwise.
- Additionally, after `pinned` becomes true, if `location.hash` targets an element below this section, call
  `document.getElementById(hash)?.scrollIntoView()` once (guard with a ref).

**Verify**: `npm run build && node tests/e2e/deeplink.mjs` → exit 0.

### Step 3: Regression check of the scrollytelling
At 1440×900, scroll to Process top + 200 px, read `.process-detail p` text; scroll to +1.9 viewports; text must differ.
At 390×844 and with `reducedMotion: 'reduce'`, the static 6-item list must be visible.

**Verify**: both checks pass (add them to `deeplink.mjs`).

## Done criteria

- [ ] `node tests/e2e/deeplink.mjs` exits 0 (deep link + active-step change + mobile/reduced-motion list)
- [ ] `npm run typecheck && npm run lint && npm test && npm run build` exit 0

## STOP conditions

- The sticky stage no longer pins (active step stops changing) after the CSS move and the fix is not obvious in one attempt.

## Maintenance notes

The 320vh value appears once in CSS; if the number of steps changes, tune it there.
