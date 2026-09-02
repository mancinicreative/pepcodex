# PepCodex Master Audit — Filled Inputs

Frozen: 2026-09-02T19:47:18.517Z
Audit date: 2026-09-02
Operating mode: AUDIT ONLY
Git branch at freeze: `feat/scoring-and-freshness`
HEAD at freeze: `f1b91e0` — "WIP: latest blog/research for Grok+Hermes. Not for production."

## Inputs

- Project/repository: `C:\Users\manci\OneDrive\Documents\00_Claude\peptide-library`
- Live website: `https://www.pepcodex.com` (apex `https://pepcodex.com` 308s to www as of 2026-09-02)
- Primary countries/jurisdictions: United States (FDA compounding / drug advertising; site language English). Other jurisdictions not declared on-site. Treat US as primary; do not assume EU/UK/AU rules apply unless a page claims they do.
- Primary audiences: educated general readers seeking peptide research summaries; people comparing FDA-approved GLP-1 medicines vs research compounds; clinicians/researchers using dossiers as a library. Site self-description: "Evidence-based peptide research library. Comprehensive dossiers with citations, not advice."
- Known competitors: not supplied. Historical notes exist in `.planning/_archive/COMPETITIVE-INTEL-PHASE*.md` — treat as untrusted leads, not facts.
- Search Console data: **STALE / LIVE PULL BLOCKED**. Last documented first-party pull 2026-07-25. Live ADC auth is `invalid_rapt` as of 2026-09-02 (see `.planning/STATE.md`). Artifacts: `.planning/SEO-AUDIT-FINDINGS.md`, `.planning/INDEXATION-DIAGNOSIS.md`, `.planning/phases/40-growth-engine/research/recovered/gsc-manifest.json`, `.planning/phases/40-growth-engine/research/BLOG-AUDIT.md`. Do not treat 2026-07-25 numbers as current. Do not invent replacements.
- Analytics data: **STALE / LIVE PULL BLOCKED**. Same auth block. Prior note (project files): GA4 topline ~91% bots. Scripts exist (`npm run ga4:pull`) but were not successfully re-run for this audit.
- Existing keyword/backlink/crawl exports: `.planning/data/v2/graph-latest.json` (graph snapshots through 2026-09-02). Older crawl: referenced from `.planning/SEO-AUDIT-FINDINGS.md`. No current Ahrefs/Semrush export supplied.
- Business constraints: crawl budget is binding; do not recommend "publish more" as growth; no dosing/sourcing/medical advice; affiliate/selling peptides parked until PepTracker app can convert; clinics currently deindexed; owner has not authorized implementation. Phase 40 growth engine is active in planning docs only.
- Audit date: 2026-09-02
- Operating mode: AUDIT ONLY

## Authorization Boundary (repeat)

Read-only. Inspect files, public pages, sitemaps, public databases, public web sources. Safe read-only diagnostics only.

Do not: modify or publish the site; change directory records; enroll in affiliate programs; contact clinics or third parties; send outreach; purchase anything; create accounts; submit forms; invent missing data; perform intrusive security testing.

Write audit reports only under `.planning/master-audit-2026-09-02/`. Do not edit `src/`, `public/`, `data/` content packs, or live config as part of this audit.

## Coverage rule

Do not claim completeness if material surfaces, databases, analytics, or private content were inaccessible. Report exact coverage. Never replace missing data with guesses.
