import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'
const footer = readFileSync(new URL('../components/layout/site-footer.tsx', import.meta.url), 'utf8')
const company = readFileSync(new URL('../content/company.ts', import.meta.url), 'utf8')
test('footer renders the verified legal owner with a runtime year and one terminal period', () => { assert.match(company, /Yiwu Xitong Trading Co\., Ltd\./); assert.match(footer, /new Date\(\)\.getFullYear\(\)/); assert.match(footer, /replace\(\/\[\.\\s\]\+\$\//); assert.match(footer, /All rights reserved\./); assert.doesNotMatch(footer, /©\s*2026|©\s*\d{4}\s+PARTY HUB/) })
test('footer logo is contained, responsive, high contrast, and linked home', () => { assert.match(footer, /<Link[\s\S]{0,600}<(?:Image|img)/); assert.match(footer, /object-contain/); assert.match(footer, /max-w-full/); assert.match(footer, /aria-label=["'][^"']*home[^"']*["']/i) })
