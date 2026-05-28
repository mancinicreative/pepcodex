# Phase 36 — PepTracker Brand Re-skin

*Branch: `feat/peptracker-rebrand` · Started 2026-05-28*

## Goal
Re-skin the entire PepCodex site from its current **dark glassmorphism (purple/cyan glow, Outfit)** to the
**PepTracker "specimen catalogue" brand**: warm cream paper, editorial serif, one cobalt accent, five signals.
Source of truth: `PepTracker V1 - Brand System v3`, guided by `PepCodex Home v2` + `PepCodex Dossier v2` mockups.
Visual references captured at `.design-refs/*.png` (gitignored).

## Decisions (confirmed with user 2026-05-28)
1. **Full re-skin this pass** (no stop-for-review between pieces; still commit incrementally).
2. **Hybrid nomenclature** — editorial visual style + accents (Vol. masthead, Plate numbers, eyebrows, colophon)
   but keep plain primary nav labels (Peptides / Categories / Dossier).
3. **Self-host all three fonts** (Geist, Geist Mono, Newsreader).
4. **Build the data-driven specimen vials now.**

## Design tokens (the new brand)
Paper family: bg `#F6F1E7` · paper `#FBF7EE` · paper-2 `#EFE8D8` · sand `#E0D7C2` · rule `#E5DBC4`
Borders: `#DBD2BC` / strong `#BFB59C`
Ink: `#1F1A12` · muted `#5C5341` · dim `#8E8567`
Accent (cobalt): `#0B517F` · deep `#073656` · soft `rgba(11,81,127,.10)`
Signals: research/positive `#14764A` · compound/warning `#CB8734` · danger `#B93D42`
Signal gradient: `linear-gradient(90deg, #0B517F 0%, #14764A 34%, #CB8734 67%, #B93D42 100%)`
Shadows: card `0 1px 0 rgba(31,26,18,.02),0 2px 6px rgba(31,26,18,.04)` · raise `0 12px 30px rgba(31,26,18,.10)`
Type roles: **Geist** = UI/body · **Geist Mono** = numerics/eyebrows/labels · **Newsreader** = serif (italic) display/editorial.
Dark footer surface: warm-charcoal ~ `#1F1A12`.

## Architecture: token-first re-theme
- `global.css` `@theme inline` already maps Tailwind color utilities → `--background/--foreground/--primary/...`.
  Re-pointing those `:root` values flips every *semantic* utility (`bg-background`, `text-foreground`, `text-primary`,
  `border-border`, `text-muted-foreground`) automatically.
- **But literal dark utilities must be swept per file:** `text-white`, `text-white/NN`, `bg-white/NN`,
  `border-white/NN`, `from-primary via-purple-* to-*`, `text-green-400/red-400/yellow-400`, `glass-card*`,
  `prose-invert`, `shadow-glow-*`, `backdrop-blur`. These won't fix via token swap — replace with new
  semantic classes / brand utilities.
- Add brand utilities: `.plate` (specimen card), `.paper-card`, `.eyebrow` (mono uppercase), `.signal-*`
  (dot+label tags), `.btn-ink` / `.btn-paper`, `.prose-paper`, `.panel-dark` (pathway/trials), `.rule`.

## Fonts (self-host → public/fonts/)
- Geist + Geist Mono: have TTF in `~/Downloads/geist-font-v1.7.0`; convert/grab woff2 (variable or 400/500/600/700).
- Newsreader: woff2 (incl. italic) from fontsource/Google. Weights 400/500/600 + 400i/500i.
- `@font-face` in global.css; `<link rel=preload>` the 2-3 above-the-fold weights in BaseLayout; drop Outfit/Google CDN.

## Chunks (each = 1 commit)
1. **Tokens+fonts+shell** — global.css rewrite, fonts, BaseLayout nav/footer/body. (#1)
2. **Core components + Vial** — Vial.astro, PeptideCard(plate), EvidenceBadge(signals), badges, buttons,
   Citation/TrialTable, Search, Blog/Clinic/Comparison/Rating cards, EvidenceChain, InteractionMatrix, Timeline. (#2)
3. **Home** — index.astro catalogue (masthead hero + Volume card, plates, drawers A–F, by-the-numbers, subscribe, disclaimer). (#3)
4. **DossierLayout** — specimen sheet (breadcrumb+actions, status strip, display name, verdict card,
   identification panel+vial, mechanism/pathway, pull-quote, weakens, timeline, trials table, citations). (#4)
5. **Remaining layouts** — Blog/Comparison/Condition/Glossary/Guide/Safety/Hub/Protocol. (#5)
6. **Listing+utility pages** — peptides, category, trials, compare, blog, directory, glossary, conditions,
   safety, guide, bioregulators, regulatory-tracker, about/methodology/contact/newsletter/legal. (#6)
7. **Verify** — `npm run check` + `npm run build` clean; Playwright desktop+mobile vs mockups; grep residual
   dark classes; a11y/contrast; update STATE.md + lessons. (#7)

## Verification
- Baseline before changes: `npm run check` PASS (0 errors, 327 pre-existing warnings).
- Per chunk: dev server + Playwright screenshot vs `.design-refs/` mockup; grep for leftover dark utilities.
- Don't touch: pre-existing uncommitted doc deletions; content `.mdx`/`.md` bodies; QA scripts; SEO schema logic.
