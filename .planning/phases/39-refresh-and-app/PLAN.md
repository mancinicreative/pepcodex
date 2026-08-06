# Phase 39 — Site-Wide Content Refresh + App Tab

*Created 2026-07-24 by Fable. Owner request: (A) in ~2–3 weeks run separate Research / Update /
Review agents to pull in new peptide science, trials, and regulatory news across the whole site and
draft blog posts; (B) as a separate, nearer-term task, ship an "App" tab for the TrackPeps app.*

---

## Prerequisite #0 — unstick production (BLOCKING for Workstream A)

Production is currently serving a stale build. The Phase-0 push (`253eb38`) never went live: the
citation gate's new CT.gov/Crossref calls were written without a fetch timeout, which can hang the
Vercel build. **Fix is written and verified** (12s `AbortController` bound on every gate fetch; gate
still resolves 682 PMIDs · 48 NCTs · 11 DOIs; full build green) but **needs an owner-approved push**.

Until this lands, prod cannot receive refreshed content. Resolve before the Workstream A run date.

---

## Workstream A — Content Refresh (scheduled ~2026-08-07 → 08-14)

**Goal:** bring all 102 dossiers + trials + regulatory + blog current with everything published since
each dossier's `lastUpdated`, add newly registered trials, prune superseded/no-longer-needed claims,
and draft blog posts from the significant developments.

**Non-negotiables (inherited — apply to every agent):**
- No fabrication. Every claim cites a real, resolving, **topically-correct** source (PMID/NCT/DOI).
- Banned content: no dosing protocols, no sourcing/where-to-buy, no medical advice.
- Evidence-graded (high/moderate/low/very-low); preprints/press-releases labelled, never inflated.
- Schema-safe: never introduce an off-enum value; the dossier must stay `astro build` valid.
- **Drafts → PR → human merge.** No agent publishes to prod directly.

### Agent 1 — RESEARCH (discovery only, read-only)
Never edits site content. Produces the evidence worklist the other agents consume.
- **Sources** (per `.planning/RESEARCH-RESOURCES.md` + `RESEARCHER-CRITERIA.md`):
  PubMed (`esearch` since each dossier's `lastUpdated`), Europe PMC (`SRC:PPR` preprints),
  ClinicalTrials.gov v2 (new/updated trials per intervention), openFDA (approvals, label changes),
  peptide-db.com (human-trial cross-check), FDA Bulk Drug list, USADA/WADA, Lilly/Novo IR,
  BioPharma Dive (lowest trust — primary source link required).
- **Filter:** apply the `RESEARCHER-CRITERIA.md` decision matrix (evidence quality × relevance ×
  timeliness) and its Red Flags (in-vitro-only, single animal study, press release without paper,
  predatory journal, dosing/sourcing angle → skip).
- **Output:** `.planning/phases/39-refresh-and-app/findings/<slug>.json` —
  `{ newStudies[], newTrials[], regulatoryChanges[], newsItems[], supersededClaims[], recommendation }`
  where every entry carries a resolving id + why-it-matters + evidence grade.
- **Also:** flag peptides with NO new evidence (so Update does nothing) and any *new molecule* with
  no dossier yet (new-dossier candidates).

### Agent 2 — UPDATE (content edits)
Consumes Agent 1's findings only — never invents its own sources.
- Add verified new studies as `keyFindings` / `conditions[].relevantStudies` on the right dossier.
- Add newly registered trials to `data/source-packs/<slug>.json` (real NCTs only).
- Update `regulatoryStatus` where a real regulatory change occurred (dated source URL required).
- **Prune:** remove/soften superseded or no-longer-supported claims flagged by Research.
- Bump `lastUpdated`; adjust `scoring:` **only** where the evidence base materially moved
  (recompute weighted overall; conservative — new evidence may raise, corrected fabrication only lowers).
- Draft blog posts for the significant items (blog Zod schema, evidence-graded, fully cited).

### Agent 3 — REVIEW / VERIFY (independent, no edits)
- Re-resolve every added PMID/NCT/DOI **and** confirm topical + claim match (the failure mode that
  fabricated-but-resolving citations exploit).
- Confirm quantitative claims (%/n/endpoint/phase) actually appear in the cited source.
- Verify scoring math (±1) and that any score change is justified and conservative.
- Confirm no banned content, no off-enum values, no broken cross-links.
- Verdict `clean | needs_work` per dossier; `needs_work` returns to Agent 2.

### Gate before any commit
`npm run check` (validate-cross-links · qa-seo · qa-scoring · qa-pmids --strict incl. NCT/DOI)
· `npm run qa-retractions` · full `npm run build` with `REAL_BUILD_EXIT=0` captured **inside** the log.

### Execution shape
Wave over the 102 dossiers, CHUNK=3 (OneDrive file-handle limit; dev server off). Pipeline per
dossier: Research → Update → Review. Commit per wave with a delta report. Blog drafts batched at the end.

---

## Workstream B — App Tab (near-term; Apple ~7/25–26, Android ~8/07)

**Goal:** a real `/app` landing page for the TrackPeps app + an "App" nav entry, live before the
store listings so the links are ready the moment each store approves.

- **New page** `src/pages/app.astro` — what the app does, feature highlights, screenshots,
  store badges (Apple + Google Play), FAQ, privacy/disclaimer consistent with site policy.
- **Nav wiring** (3 places, all in `src/layouts/BaseLayout.astro`): desktop top-level nav,
  mobile nav, footer links.
- **Store-link states:** each badge renders `live` (real store URL) or `coming-soon` (disabled +
  "Coming to Android/iOS") — driven by one config object so flipping a link live is a one-line change.
- **SEO/schema:** metaTitle/metaDescription, `SoftwareApplication` structured data, canonical
  `https://www.pepcodex.com/app` (no trailing slash, per qa-seo).
- **Integrity:** the app page must not imply medical advice or dosing guidance; no health claims.

### Open questions (owner input needed — blocking full build)
1. **App name as shown publicly** — "TrackPeps"? (site brand is PepCodex; PepTracker was the
   visual-identity name). Which appears on the page/stores?
2. **Store URLs / bundle IDs** once available (Apple + Google Play).
3. **Assets** — app icon, 3–5 screenshots, any promo copy or demo video.
4. **Feature list + pricing** — free / paid / freemium; what to advertise.
5. **CTA behaviour before launch** — email capture ("notify me") vs plain "coming soon"?

---

## Sequencing
1. **Now:** unstick prod (Prereq #0) → build Workstream B scaffold with `coming-soon` states.
2. **On store approval:** flip the store link config live (one-line), redeploy.
3. **~2026-08-07 → 08-14:** run Workstream A (Research → Update → Review waves), review PRs, merge.

## Verification
Plan is complete when: prod is healthy; `/app` is live with working nav + correct link states; and
the Workstream A run produces reviewed, gate-green commits with a per-dossier delta report.
