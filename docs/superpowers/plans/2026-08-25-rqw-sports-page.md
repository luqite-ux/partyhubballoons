# RQW Sports Product Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a screenshot-ready `/rqw-sports` catalog page containing all 53 supplied products with normalized image composition and a consistent top-left `RQW` mark.

**Architecture:** A deterministic Pillow preprocessing script converts the supplied source images into traceable 1200 × 900 PNG assets and writes an audit manifest. A typed product manifest feeds a standalone Next.js App Router page and a focused responsive grid component without changing the existing product database or locale routes.

**Tech Stack:** Next.js 16.3 App Router, React 19, TypeScript, Vitest, Testing Library, Python 3 with Pillow for deterministic image preprocessing.

**Spec:** `docs/superpowers/specs/2026-08-25-rqw-sports-page-design.md`

## Global Constraints

- Keep existing public routes, homepage behavior, Supabase integrations, and `/rqw` behavior unchanged.
- Process exactly 53 supplied images without generative redraw, stretching, or subject cropping.
- Generate 1200 × 900 white PNG canvases with fixed `RQW` placement and proportional product fitting.
- Do not invent prices, dimensions, MOQ, specifications, certifications, or commercial promises.
- Preserve UTF-8 Chinese source filenames in the traceability manifest.
- Verify desktop and 390 px mobile layouts before completion.

---

### Task 1: Product manifest contract

**Files:**
- Create: `content/rqw-sports.ts`
- Create: `tests/rqw-sports/manifest.test.ts`

**Interfaces:**
- Produces: `RqwSportsProduct`, `rqwSportsProducts`, and `RQW_SPORTS_PRODUCT_COUNT` for the processor, page, and tests.

- [ ] **Step 1: Write the failing manifest test**

Assert that the manifest contains 53 entries, every slug and output path is unique, every source filename ends in `.png` or `.jpg`, and every English name is non-empty.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test tests/rqw-sports/manifest.test.ts`

Expected: FAIL because `content/rqw-sports.ts` does not exist.

- [ ] **Step 3: Add the typed manifest**

Create the 53 explicit records with `slug`, `sourceFile`, `name`, and `/rqw-sports/products/<slug>.png` output paths. Keep Chinese filenames verbatim.

- [ ] **Step 4: Run the focused test and verify GREEN**

Run: `pnpm test tests/rqw-sports/manifest.test.ts`

Expected: PASS.

### Task 2: Deterministic image normalization

**Files:**
- Create: `scripts/rqw-sports/normalize_products.py`
- Create: `scripts/rqw-sports/products.json`
- Create: `tests/rqw-sports/assets.test.ts`
- Create: `public/rqw-sports/products/*.png`
- Create: `public/rqw-sports/asset-audit.json`

**Interfaces:**
- Consumes: the exact 53 records exported to `scripts/rqw-sports/products.json` and the supplied source directory.
- Produces: 53 1200 × 900 PNG images and audit records containing `source`, `output`, `detectedBounds`, `placedBounds`, and `canvas`.

- [ ] **Step 1: Write the failing asset test**

Read each expected PNG, assert the PNG signature, parse IHDR width/height, and require 1200 × 900. Assert that `asset-audit.json` contains 53 records and a non-empty placement for every source.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test tests/rqw-sports/assets.test.ts`

Expected: FAIL because generated assets and audit data do not exist.

- [ ] **Step 3: Implement the normalizer**

Use Pillow to flatten transparency onto white, detect non-background pixels with a tolerant white-background delta, preserve a safety margin, proportionally fit the detected subject into the shared content area, render `RQW` at fixed top-left coordinates with Times New Roman, and save RGB PNG output. Fail if the source count, source name, or detected bounds are invalid.

- [ ] **Step 4: Generate all assets**

Run the script with the supplied extracted image directory and `public/rqw-sports/products` as output. Review the audit JSON and a generated contact sheet.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `pnpm test tests/rqw-sports/assets.test.ts`

Expected: PASS for all 53 assets.

### Task 3: Standalone catalog page

**Files:**
- Create: `components/rqw-sports/rqw-sports-page.tsx`
- Create: `app/rqw-sports/page.tsx`
- Create: `app/rqw-sports/rqw-sports.css`
- Create: `tests/rqw-sports/page.test.tsx`

**Interfaces:**
- Consumes: `rqwSportsProducts` from `content/rqw-sports.ts` and generated image paths.
- Produces: the `/rqw-sports` route, route metadata, and responsive catalog markup.

- [ ] **Step 1: Write the failing page test**

Render `RqwSportsPage` and assert one primary heading, exactly 53 product cards/images, the first and last product names, meaningful image alt text, and the catalog grid test hook.

- [ ] **Step 2: Run the focused test and verify RED**

Run: `pnpm test tests/rqw-sports/page.test.tsx`

Expected: FAIL because the page component does not exist.

- [ ] **Step 3: Implement the page and route**

Build a concise RQW collection header and equal-height product cards. Use Next Image with fixed 4:3 stages, `object-fit: contain`, and responsive sizes. Export metadata from the route without unsupported commercial claims.

- [ ] **Step 4: Add responsive styles**

Use three columns above 980 px, two columns from 641–980 px, and one column at 640 px and below. Keep the product stage ratio, card spacing, text wrapping, and touch-safe layout consistent.

- [ ] **Step 5: Run the focused test and verify GREEN**

Run: `pnpm test tests/rqw-sports/page.test.tsx`

Expected: PASS.

### Task 4: Full verification and visual evidence

**Files:**
- Create: `artifacts/rqw-sports/desktop.png`
- Create: `artifacts/rqw-sports/mobile-390.png`
- Create: `artifacts/rqw-sports/contact-sheet.png`

**Interfaces:**
- Consumes: the completed route and normalized assets.
- Produces: reproducible automated results and real-browser visual evidence for user review.

- [ ] **Step 1: Run automated verification**

Run: `pnpm test`, `pnpm typecheck`, `pnpm lint`, and `pnpm build`.

Expected: all commands exit 0 without new warnings or errors.

- [ ] **Step 2: Start the local production server**

Run: `pnpm start` after the successful build.

- [ ] **Step 3: Capture desktop and mobile evidence**

Open `/rqw-sports` at desktop width and 390 px width. Capture full-page screenshots and verify no horizontal overflow or console errors.

- [ ] **Step 4: Review composition consistency**

Inspect the contact sheet and representative wide, tall, pale, thin, and irregular products. Confirm no subject is stretched, clipped, disproportionately tiny, or obscured by `RQW`.

- [ ] **Step 5: Commit the isolated branch**

Commit only the new page, tests, deterministic processor, traceability records, normalized assets, and approved evidence. Do not include unrelated workspace files.

