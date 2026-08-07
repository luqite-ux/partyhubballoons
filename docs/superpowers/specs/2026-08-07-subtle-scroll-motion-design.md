# Subtle Scroll Motion Design

## Objective

Add restrained, premium motion to PARTY HUB without changing page content, layout, SEO output, or backend behavior.

## Motion language

- Production metrics count from zero once when their section first enters the viewport, using an eased duration near 1.4 seconds.
- Metric formatting remains exact: `40,000 m²`, `10`, `80`, and `5 million`.
- Major sections reveal with opacity plus 18–28px vertical movement.
- Repeated cards and chips use short staggered delays; no dramatic scale, rotation, or parallax.
- Animations run once and retain their completed state.
- With `prefers-reduced-motion: reduce`, final content appears immediately and no counting animation runs.

## Architecture

Create focused client components for viewport observation, section reveal, and metric counting. Keep `HomePage` server-rendered and compose these client boundaries around existing semantic markup. Use native browser APIs only; add no animation dependency.

## Verification

Unit tests cover metric parsing/formatting, final reduced-motion values, and reveal component semantics. Full tests, TypeScript, ESLint, production build, desktop/mobile browser checks, console inspection, reduced-motion verification, and Lighthouse run before deployment.
