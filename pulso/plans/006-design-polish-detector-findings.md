# Plan 006: Impeccable detector findings cleared (no nested cards, readable measure, stable CTA)

> **Executor instructions**: Follow step by step, verify each step, honour STOP conditions, update `pulso/plans/README.md`.
>
> **Drift check (run first)**: `git diff --stat 7923f59..HEAD -- pulso/src/components/sections pulso/src/app/globals.css`

## Status

- **Priority**: P3 · **Effort**: S · **Risk**: LOW · **Depends on**: 005 (same Portfolio file) · **Category**: design quality
- **Planned at**: commit `7923f59`, 2026-11-18

## Why this matters

`impeccable detect --viewport 1440x900|390x844 http://localhost:4310/` reports:
- `nested-cards`: the bordered `MiniPlan` box inside each bordered Portfolio sheet; on mobile, the service placement
  illustrations (bordered/shadowed mock cards) inside a bordered, rounded panel (`#usluga-* > div.lg:hidden > div`).
- `line-length`: ~100 characters per line in the pricing budget clause (`p.rounded-[10px].border-2`).
- `straggler`: "wizyty." alone on the last line of the Portfolio strategy text.
A Playwright click also showed the Portfolio "Chcę podobny plan" button is "not stable": the 3D pointer tilt moves it
while the pointer approaches.

## Current state

- `components/sections/MiniPlan.tsx`: root `<div role="img" className="rounded-md border border-rule bg-paper/60 p-3">`.
- `components/sections/Services.tsx` mobile block: `<div className="mt-8 lg:hidden"><div className="grid place-items-center rounded-[10px] border border-rule bg-paper-2 px-5 py-8"><Placement/></div></div>`.
- `components/sections/Pricing.tsx`: budget clause `<p className="rounded-[10px] border-2 border-ink bg-sheet p-5 ... lg:col-span-8">`.
- `components/sections/Portfolio.tsx`: `onPointerMove={onMove}` on the stage; tilt up to 5°/7°.

## Scope

The four files above. Out of scope: colours, copy.

## Steps

1. MiniPlan: drop border/background/radius; keep it as an open chart separated by a top hairline (`border-t border-rule pt-3`).
2. Services mobile: remove the panel's border and radius; keep the grid background (`week-grid` on `bg-paper-2`, full-bleed via `-mx-[var(--gutter)]`).
3. Budget clause: constrain text to `max-w-[68ch]` inside the box.
4. Strategy text: add `text-wrap: pretty` (Tailwind `text-pretty`) to the `dd` elements.
5. Portfolio tilt: ignore pointer moves whose target is inside `a, button` (`(e.target as Element).closest("a,button")` → reset tilt to 0), and reduce amplitude to 3°/4°.

**Verify**: rebuild, serve on 4310, run the detector at both viewports → no `nested-cards`, `line-length` or `straggler` findings; Playwright `click()` (without `force`) on "Chcę podobny plan" succeeds within 5 s.

## Done criteria

- [ ] Detector output contains none of `nested-cards`, `line-length`, `straggler`
- [ ] `npm run typecheck && npm run lint && npm test && npm run build` exit 0

## STOP conditions

- Removing a container makes the Services mobile illustration unreadable on paper (report with a screenshot).

## Execution notes

- Repro: detector found `nested-cards` ×3 (desktop) / ×6 (mobile), `line-length` ×1, `straggler` ×1 before the change; 0 findings at both viewports after.
- Step 5 (Portfolio tilt) NOT implemented — needs repro: `tests/e2e/stable-cta.mjs` clicks "Chcę podobny plan" without `force` and passes on the unchanged code. The original "not stable" report came from clicking an `inert` back sheet (misattributed during the audit).
- Extra change within scope: the Google placement illustration's bordered "Sponsorowane" box (the last nested-card hit on mobile) became a tinted block (`bg-google/15`).
- Gates: typecheck, lint, 31/31 tests, build — pass.
