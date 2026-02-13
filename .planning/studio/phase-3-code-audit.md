# Phase 3: Code Quality Audit

**Skill:** `/code-engineering`
**Date:** 2026-02-12
**Evaluator:** Studio Pipeline (retroactive)

---

## Codebase Metrics

| Metric | Value |
|---|---|
| Total source files | 89 (.astro, .ts, .css) |
| Page routes | 48 |
| Components | 29 |
| Layouts | 10 |
| API routes | 3 |
| CSS files | 1 (global.css, 439 lines) |
| Content files | 872 (.md/.mdx) |
| Dependencies | 6 production + 5 dev |
| Content collections | 12 (with Zod schemas) |

---

## Code Patterns Assessment

### Strengths

1. **Type safety via Zod schemas** — All 12 content collections have comprehensive Zod validation. Invalid content fails at build time, not runtime.

2. **Consistent layout pattern** — Every content type has a dedicated layout extending BaseLayout. Clean separation of concerns.

3. **Component encapsulation** — All 29 components are self-contained Astro components with no external state management. Pure server-side rendering.

4. **Dual-mode page support** — Peptide pages support both `getStaticPaths()` (static) and dynamic SSR with graceful fallback:
   ```typescript
   let peptide = Astro.props.peptide;
   if (!peptide) {
     const { slug } = Astro.params;
     peptide = await getEntry('peptides', slug as string);
   }
   ```

5. **SEO component library** — 8 structured data components (JsonLd pattern) provide reusable schema markup.

6. **Minimal dependency footprint** — Only 11 total packages. No unnecessary frameworks, state managers, or utility libraries.

### Concerns

1. **SSR overhead** — `output: 'server'` means all pages are server-rendered by default. Only 2 files explicitly set `prerender: true`. This is the #1 performance issue.

2. **Category pages are hardcoded** — Three separate files (`metabolic.astro`, `repair-recovery.astro`, `hormonal.astro`) instead of a dynamic `[category].astro` route. Also missing: longevity, cognitive, immune, other.

3. **Search implementation split** — Two search systems exist:
   - Pagefind (postbuild, client-side, searches all content)
   - `peptide-search.json.ts` (API, pre-rendered, peptides only)
   - These should be consolidated

4. **Empty `pages` collection** — Defined in config.ts but has 0 content files. Dead schema.

5. **`lib/` directory exists but is empty** — Utility functions are inline in components/pages instead of extracted.

6. **No TypeScript strict mode** — No `tsconfig.json` customization visible.

---

## Dead Code Analysis

### Confirmed Dead Code

| Item | Type | Reason |
|---|---|---|
| `pages` collection | Schema | 0 content files, never queried |
| `.glass-panel` | CSS class | Deprecated alias, use `.glass-card` |
| `.glass-card-default` | CSS class | Legacy alias |
| `.glass-card-hoverable` | CSS class | Legacy alias |
| `.glass-card-interactive` | CSS class | Legacy alias |
| `--font-tech` CSS var | CSS variable | Same value as `--font-sans` and `--font-display` |

### Potentially Unused Components (Requires Build Verification)

| Component | Status | Notes |
|---|---|---|
| EvidenceBadge | Likely used | In DossierLayout for evidence strength display |
| FeaturedClinicCard | Likely used | In clinics pages |
| SafetyBanner | Likely used | In safety content |
| HowToSchema | Verify | May not be imported by any layout |

---

## Build Health

### Current Configuration
```javascript
// astro.config.mjs
output: 'server',       // Everything is SSR by default
adapter: vercel({
  imageService: true,   // Image optimization enabled but NOT USED
}),
```

### Build Issues
1. **No build validation pipeline** — No eslint, no prettier, no type checking in CI
2. **Pagefind runs postbuild** — Adds build time but provides good search
3. **No bundle analysis** — No way to track JS/CSS bundle size over time
4. **Shiki theme mismatch** — `github-light` syntax theme on a dark-mode-only site

### Recommendations
- Switch to `output: 'static'` or `'hybrid'`
- Add `prerender: false` only on API routes
- Fix Shiki theme to dark variant (`github-dark` or `one-dark-pro`)
- Add TypeScript strict mode
- Consider adding lint/format configuration

---

## File Organization Assessment

```
src/
├── components/       # 29 components (flat + SEO/ subdirectory)
│   ├── SEO/         # 8 structured data components
│   └── *.astro      # 21 UI/nav/data components
├── content/          # 12 collections with Zod schemas
│   ├── config.ts    # 315 lines — comprehensive but long
│   └── {collection}/ # 872 markdown files
├── layouts/          # 10 layouts
├── lib/              # Empty — utilities are inline
├── pages/            # 48 routes
│   ├── api/         # 3 API routes
│   ├── calculator/  # 6 calculator routes
│   ├── category/    # 3 hardcoded category routes
│   └── {content}/   # Dynamic content routes
└── styles/
    └── global.css   # 439 lines — single stylesheet
```

**Assessment:** Clean overall structure. Could benefit from:
- Moving shared utilities to `lib/`
- Converting category pages to dynamic routes
- Extracting Zod schema helpers from config.ts

---

## Technical Debt Register

| Item | Severity | Effort | Description |
|---|---|---|---|
| SSR instead of static | High | Low | Switch `output` mode, massive perf win |
| Missing category pages | Medium | Low | Only 3 of 7 categories have pages |
| Search consolidation | Medium | Medium | Two search systems, neither complete |
| Hardcoded homepage stats | Low | Low | Should query collections at build time |
| Legacy CSS aliases | Low | Low | Remove 4 deprecated class aliases |
| Empty lib/ directory | Low | Low | Either use or remove |
| Empty pages collection | Low | Low | Remove from config.ts |
| Shiki theme mismatch | Low | Low | Change to dark theme variant |
| Font variable redundancy | Low | Low | 3 vars → 1 |

---

## Code Quality Score

| Dimension | Score (0-4) | Notes |
|---|---|---|
| Type safety | 4 | Zod schemas, TypeScript |
| Code organization | 3 | Clean structure, some dead code |
| Component design | 3 | Good encapsulation, could be better organized |
| Build configuration | 2 | SSR waste, unused image optimization |
| Code reuse | 3 | Layout system good, missing utility extraction |
| Consistency | 3 | Mostly consistent patterns |
| Documentation | 2 | Components lack inline docs, no README in src/ |
| Technical debt | 2 | Several items accumulated |

**Overall Code Quality: 22/32 = 69%**

---

## Gate Assessment

- [x] Code patterns assessed with strengths and concerns
- [x] Dead code identified
- [x] Build health evaluated
- [x] Technical debt registered with severity/effort
- [x] File organization assessed

**Phase 3 Code Gate: PASS (with technical debt items for v5.0)**
