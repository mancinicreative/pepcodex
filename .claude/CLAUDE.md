# PepCodex Project Guidelines

## Current Status (2026-04-13)
- **Phase:** v6.0 Phase 35 — Content Refresh & New Dossiers
- **Active:** 6 new dossiers, 15 dossier updates, 10 blog posts, regulatory reclassification
- **See:** `.planning/STATE.md`, `.planning/phases/35-content-refresh/`

## Content Rules (HARD)

- **Evidence-based sourcing is non-negotiable.** When writing any content, invoke the `sourcing-rules` skill for citation format, approved source tiers, and quality thresholds. Never fabricate sources, PMIDs, DOIs, or publication dates.
- **Banned content:** dosing protocols, sourcing/purchasing guidance, medical advice, unverified health claims.
- **Required on every dossier/blog:** evidence grading (`high`/`moderate`/`low`/`very-low`), disclaimers, citations for all factual claims.

## Project-Specific Conventions

- Astro + MDX static site. Content in `src/content/peptides/`, `src/content/blog/`, `src/content/comparisons/`.
- Schemas: `src/content/config.ts` (Zod) + `data/schemas/source-pack.schema.json`.
- QA scripts in `scripts/` (qa-citations, qa-banned-content, validate-cross-links).
- Build: `npm run build` (output: static). Dev: `npm run dev`.

## File Locations

- Research sources: `data/RESEARCH-SOURCES.md`
- State tracking: `.planning/STATE.md`
- Active roadmap: `.planning/ROADMAP.md`
- Archived docs: `.planning/_archive/`, `.claude/_archive/`
- Lessons: `.claude/rules/lessons.md` (update after any correction)

---

*Operating modes, workflow, verification rules — inherited from global `~/.claude/CLAUDE.md` and `.claude/rules/`. Don't duplicate here.*
