# Subtle Scroll Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add restrained viewport reveal animations and one-time animated production metrics to the PARTY HUB homepage.

**Architecture:** Keep the homepage as a Server Component and introduce small Client Components backed by `IntersectionObserver` and `requestAnimationFrame`. CSS owns visual timing and reduced-motion behavior; JavaScript owns only visibility state and numeric interpolation.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Add no third-party animation dependency.
- Preserve exact metric copy and existing page structure.
- Animate only once per viewport entry.
- `prefers-reduced-motion: reduce` must show final content immediately.

---

### Task 1: Metric counter

**Files:**
- Create: `components/motion/animated-metric.tsx`
- Create: `lib/motion/metric.ts`
- Test: `tests/motion/metric.test.ts`

**Interfaces:**
- Produces: `parseMetric(value: string): MetricParts` and `<AnimatedMetric value string>`.

- [ ] Write failing tests proving all four metric strings parse and format exactly.
- [ ] Run `pnpm test -- tests/motion/metric.test.ts` and confirm failure because the module is missing.
- [ ] Implement parsing, eased interpolation, one-time viewport activation, and reduced-motion completion.
- [ ] Re-run the metric tests and confirm they pass.

### Task 2: Scroll reveal composition

**Files:**
- Create: `components/motion/reveal.tsx`
- Modify: `components/home/home-page.tsx`
- Modify: `app/globals.css`
- Test: `tests/motion/reveal.test.tsx`

**Interfaces:**
- Produces: `<Reveal as="section" className string stagger boolean>`.
- Consumes: `<AnimatedMetric value string>` from Task 1.

- [ ] Write failing tests proving reveal markup and reduced-motion-safe CSS hooks exist.
- [ ] Run the motion tests and confirm expected failures.
- [ ] Implement the observer component, wrap homepage sections, and add restrained reveal/stagger CSS.
- [ ] Run all motion tests and confirm they pass.

### Task 3: Delivery verification

**Files:**
- Modify only if verification discovers a reproducible defect.

- [ ] Run `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.
- [ ] Verify desktop, mobile, normal-motion, and reduced-motion behavior in a real browser with zero console errors.
- [ ] Run Lighthouse accessibility/SEO audit and correct any regression.
- [ ] Precisely stage feature files, commit, push `main`, wait for Vercel Production READY, and verify the formal domain.
