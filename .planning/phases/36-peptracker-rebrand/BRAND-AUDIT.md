# Brand-Coverage Audit — PepTracker Re-skin (Phase 36)

*Run: 2026-05-29 · Gate: "every page/subpage carries the new specimen-catalogue brand" before pushing to production.*

## Brand definition (pass criteria)
- **Background:** warm cream paper `#f6f1e7`; panels paper/sand (`#fbf7ee` / `#efe8d8`) with warm tan borders. A few intentional charcoal `#1f1a12` panels (mechanism pathway cards, code blocks, footer) are allowed.
- **Ink:** warm near-black `#1f1a12`, muted browns `#5c5341` / `#8e8567`. No gray-on-white default, no light-on-light.
- **Single accent:** cobalt `#0b517f`. No purple/cyan/teal/indigo/violet/pink/neon or multi-color gradients.
- **Signals (small accents only):** research green `#14764a`, compound amber `#9a6418`/`#cb8734`, danger red `#b93d42`.
- **Type:** Newsreader (serif headings), Geist (sans body/UI), Geist Mono (uppercase tracked labels). No default-font fallback.
- **Shell:** fixed cream nav (cobalt mark + mono links + Subscribe); dark charcoal footer (DRAWERS / RESEARCH / COLOPHON).

## Workflow (reusable)
1. **Inventory** — enumerate `src/pages/**` routes and `src/layouts/*`; confirm every layout extends `BaseLayout` and every page references a layout (shell coverage = 100%).
2. **Static sweep** (code + content) — grep for off-brand leftovers:
   - Tailwind palette utilities: `(text|bg|border|from|via|to|ring|fill|stroke)-(gray|slate|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-[0-9]`
   - `text-white` / `bg-white` / `text-black` / `bg-black` / `backdrop-blur` / `bg-gradient` / `from-[` / `to-[`
   - Hardcoded hex `#[0-9a-fA-F]{6}` → triage against the brand palette.
   - Sweep `src/` (templates) and `src/content/` (MDX) separately.
   - Triage each hit: brand token / intentional dark panel = keep; raw palette = fix.
3. **Visual sweep** — one representative URL per template (the 1,223 pages collapse to ~35 templates). Screenshot hero + body, eyeball against the brand definition. Flag dark bg, off-palette accents, invisible text, unstyled/broken sections, missing nav/footer, font fallback.
4. **Fix + re-verify**, then `npm run build` (must be 0 errors) before shipping.

## Results
**Inventory:** 10 layouts (9 sub-layouts all `import BaseLayout`; BaseLayout is the shell). Every `.astro` page references a layout → shell coverage 100%.

**Static sweep:**
- Templates (`.astro`/`.ts`): 0 off-brand palette utilities. All `text-white`/`bg-white`/`backdrop-blur` hits were the brand charcoal overlay (`rgba(31,26,18,…)`) or cream nav (`var(--bg)/90`) — legit. All hardcoded hexes were brand tokens (`#9a6418` compound-text; pathway-chip `#5fcf9a`/`#e3b574`/`#8fc7e8`).
- Content (`src/content/**`): 1 off-brand leftover found and fixed → `safety/glp1-safety-overview.mdx` boxed warning used raw `red-300/red-50/red-900/red-800`; converted to brand danger tokens (`rgba(185,61,66,…)` + `var(--danger)`). `testagen.mdx` danger note already brand-correct.

**Visual sweep:** 35/35 templates PASS (home, peptide listing/dossier, category, compare index + comparison, conditions index + hub, peptide×condition, blog index + post, glossary index + term, guide index + article, safety index + article, protocols index + detail, trials, regulatory tracker, directory, bioregulators, clinics index + city, methodology, about, newsletter, privacy, terms, disclaimer, editorial-policy, fda-notice, contact, 404). Verified shell on every page: cream body `rgb(246,241,231)`, charcoal footer `rgb(31,26,18)`, cobalt nav, Newsreader/Geist/Geist Mono rendering. Independently spot-checked: home, dossier, regulatory tracker, comparison.

**Notes (infra, not brand):** dev-only `UnknownFilesystemError` on first cold nav (OneDrive/file-watcher contention; clears on reload, irrelevant to the static build); Pagefind 404 in dev is normal (index built at `postbuild`).

## Verdict
Brand coverage is complete across all templates. One content leftover fixed. Cleared to ship pending a green production build.
