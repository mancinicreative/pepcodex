# Phase 37 — Launch Readiness (ship the PepTracker rebrand to production)

*Created 2026-06-26 · Branch: `feat/peptracker-rebrand` → `main` (Vercel prod) · Owner-confirmed scope.*

## Goal
Get PepCodex to **100% usable AND evidence-trustworthy**, then merge the PepTracker rebrand to
production. "Usable" = every reachable surface is functional, coherent, on-brand. "Trustworthy" =
every cited PMID resolves to the paper it claims, and the flagship two-axis score is on every dossier.

## Confirmed decisions (this session)
1. **Public name stays "PepCodex."** PepTracker is the visual identity only — no copy/domain/SEO change.
2. **Directory** → remove from primary nav now; keep the stub page reachable by URL; a real paid
   partner directory is a **V2** monetization feature (not this phase).
3. **Newsletter exit-popup removed** (done — `BaseLayout.astro` no longer renders `ExitIntentPopup`).
4. **Citation integrity AND the full two-axis scoring rollout are both completed before merge.**
5. Sequence: citation gate → scoring rollout → surface/IA polish → final QA → merge to prod.

## Success criteria (launch gate)
- [ ] Every flagged citation across the 102 dossiers is verified: each live PMID resolves to a paper
      that actually supports the claim (or the claim/citation is corrected/removed/honestly reframed).
- [ ] `qa-citations` passes; a NEW build-time PMID-resolver guard passes (no non-resolving PMIDs).
- [ ] Two-axis scoring (`scoring:` block, rubric v2.4) present on **102/102** dossiers; `qa-scoring` PASS.
- [ ] No reachable stub/dead surface: Directory removed from nav; peptide×condition anchors work; dead
      calculator analytics removed.
- [ ] Regulatory Tracker + Methodology surfaced in primary nav.
- [ ] Working tree reconciled (root-doc deletions, privacy/terms edits, untracked audit tooling resolved).
- [ ] `npm run build` green; visual + a11y pass on key templates (desktop + mobile).
- [ ] Merged to `main`; Vercel prod deploy verified live.

---

## Chunk 0 — Surface + IA polish (1 commit, low-risk, do first)
*Independent of content work. Fast, decided, high-perceived-value.*

1. **Remove Directory from nav** — delete the `/directory` links in `BaseLayout.astro` (desktop ~L166-177,
   mobile ~L255-265). Leave `directory.astro` in place (reachable by URL; future V2 surface).
2. **Surface the differentiators in nav** — add **Regulatory** (→ `/regulatory-tracker`) as a top-level
   item (next to Trials), and add **Methodology** (→ `/methodology`) — either top-level or into the
   Research dropdown. Update the `isActive`/highlight path arrays to match.
3. **Fix dead anchors** — `peptides/[peptide]/[condition].astro:290,294,299`: give the target sections
   real `id`s and point the "On This Page" links at them (`#research-summary`, `#referenced-studies`,
   `#related-peptides`), or remove the nav block if sections can't be anchored cleanly.
4. **Remove dead code** — delete `trackCalculators()` and its call in `src/scripts/analytics.ts` (L26-47, L121).
5. **Newsletter popup** — DONE (verify it no longer renders in the build).
- **Verify:** `npm run build` green; nav renders Regulatory + Methodology; no Directory in nav; anchors jump.
- **Commit:** `feat(launch): nav surfaces trackers+methodology, drop directory stub, fix dead anchors/code`

---

## Chunk 1 — Citation-integrity tooling + guard (1 commit)
*Make the problem measurable and regression-proof before mass edits.*

1. **Commit the existing audit tooling** (currently untracked): `scripts/audit-citations-extract.mjs`,
   `scripts/audit-citations-verify.mjs`, `scripts/_audit_stats.mjs`, and `.planning/citation-audit/`
   (extract/findings/pubmed-meta). This is the working checklist for Chunks 2-N.
2. **Add a build-time PMID-resolver guard** — `scripts/qa-pmids.mjs`: parse every `pmid:` in dossier
   frontmatter + body, batch-resolve against PubMed (NCBI esummary), FAIL on any PMID that does not
   resolve. Add to the `prebuild`/`check` gate. (Network call at build — gate behind a flag or cache the
   allow-list so CI isn't flaky; document the tradeoff.)
3. **Refresh findings** if stale: re-run `audit-citations-verify.mjs` so `findings.md` reflects current files.
- **Verify:** `node scripts/qa-pmids.mjs` runs and reports the 15 known non-resolving PMIDs.
- **Commit:** `feat(qa): commit citation-audit tooling + build-time PMID resolver guard`

---

## Chunks 2…N — Per-dossier launch-readiness passes (batched, ~10 dossiers/commit)
*The bulk of the work. Each batch takes a set of dossiers through BOTH citation-fix and scoring in one
pass (scoring's Evidence axis depends on real citations, so do them together). Prioritize by traffic.*

### Per-dossier protocol (apply to every dossier in the batch)
**A. Citation verification (per flagged PMID in `findings.md` for this file):**
  1. Fetch real PubMed metadata (PubMed MCP `get_article_metadata`, or `pubmed-meta.json`).
  2. Compare claimed (author / year / finding) vs real (author / year / title / abstract). Classify:
     - **MATCH** → keep (false positive; many `POSSIBLE_MISATTRIB` are this).
     - **WRONG PMID, real claim** → search PubMed for the actual supporting paper; replace the PMID.
     - **Non-resolving / unrelated paper** → if a real supporting source exists, replace; else **remove
       the citation and soften/remove the claim** (honest reframe, per the cardiogen precedent).
  3. NEVER keep a PMID that doesn't resolve or points to an unrelated paper. Cite the artifact for each fix.
**B. Two-axis scoring (if `scoring:` block absent):**
  1. Apply rubric **v2.4** (source of truth: `/methodology` + `.planning` rubric doc) — Evidence axis +
     Effectiveness axis, ~80 bands. Populate the `scoring:` block AFTER citations are verified.
  2. Keep the legacy `ratings:` for fallback compatibility.
**C. Verify the batch:** `qa-citations` + `qa-pmids` + `qa-scoring` + `astro` content-sync all PASS.
**D. Commit:** `content(launch): citations verified + two-axis score — <batch name> (N dossiers)`

### Batch order (traffic / authority first; ~10 each → ~10 batches)
- **B1 GLP-1 flagship:** semaglutide, tirzepatide, retatrutide, liraglutide, survodutide, mazdutide,
  cagrilintide, cagrisema, amycretin, orforglipron.
- **B2 Healing/GH flagship:** bpc-157, tb-500, ghk, ghk-cu, ipamorelin, cjc-1295, sermorelin,
  tesamorelin, ghrp-2, ghrp-6.
- **B3 Cognitive/longevity flagship:** semax, selank, na-semax-amidate, na-selank-amidate, dihexa,
  ss-31, mots-c, humanin, epithalon, foxo4-dri.
- **B4 Other mainstream:** mk-677, pt-141, melanotan-i, melanotan-ii, hcg, hmg, kisspeptin, igf-1-lr3,
  glutathione, 5-amino-1mq.
- **B5 Khavinson tripeptides (high-risk, flagged):** vilon, livagen, vesugen, cardiogen(✓), kristagen,
  chonluten, bronchogen, testagen, ovagen, pancragen.
- **B6 Khavinson cytamins (high-risk):** prostatilen, retinalamin, vladonix, endoluten, cerluten,
  ventfort, svetinorm, suprefort, sigumir, stamakort, cortexin, pinealon, thymalin, thymogen.
- **B7 AMPs / immune:** ll-37, alpha-defensins, lactoferricin, murepavadin, thymulin, thymosin-alpha-1,
  kpv, lactoferricin, shlp-2, shlp-6.
- **B8 Oncology / investigational:** 225ac-dota-lm3, bt5528, sulanemadlin, zelenectide-pevedotin,
  mrna-4157, evx-01, p21, alixorexton, oveporexton.
- **B9 Newer GLP-1 / metabolic:** ct-388, pemvidutide, maritide, vk2735, ecnoglutide, slu-pp-332,
  aod-9604, pasireotide, klotho, mk-0616.
- **B10 Remaining new dossiers:** rusfertide, pf-08653944, peg-mgf, chelohart, visoluten, hexarelin,
  follistatin, dsip, + any not yet covered. (Reconcile against the full 102 list before starting.)
- *(Exact membership reconciled against `extract.md`'s 102-file table at execution time; the 24 dossiers
  with zero PMIDs need scoring only, no citation work.)*

---

## Chunk Final — Reconcile, QA, merge to prod (1-2 commits)
1. **Working-tree reconciliation:** decide on the pre-existing uncommitted changes — root-doc deletions
   (CLAUDE.md, README.md, COMPETITIVE-INTEL.md, etc.), `privacy.astro`/`terms.astro` edits, untracked
   `.analytics/`, `scheduled_tasks.lock`, `style influence/…`. Commit intended changes, restore/ignore
   the rest. (Confirm with owner before deleting anything not created this phase — per repo rules.)
2. **Full QA:** `npm run check` + `npm run build` green; Playwright visual pass (home, dossier scored +
   legacy, regulatory-tracker, trials, peptides listing, a condition page) desktop + mobile; a11y/contrast;
   link check; confirm popup gone, nav correct, anchors work.
3. **Merge:** open PR `feat/peptracker-rebrand` → `main`; merge; verify Vercel prod deploy renders live;
   smoke-test the live URLs.
4. **Update** `.planning/STATE.md` (Phase 37 complete, rebrand live) + `.claude/rules/lessons.md`
   (citation-integrity systemic finding + the new PMID guard).

---

## Risks & notes
- **Credibility-sensitive work:** citation fixes and scoring both directly affect trust. Verify every
  PMID against PubMed — never trust author-year strings (lessons: cardiogen). Cite the artifact per fix.
- **Scale:** ~80 dossiers need citation work + 83 need scoring = many sessions. Batches are the unit of
  delivery; each commit leaves the site better and shippable. High-traffic batches first so a cut-off
  session still improves the most-visited pages.
- **Subagent assistance:** batches may use ≤3 parallel read/verify subagents — but **stop the dev server
  before any parallel file-editing swarm** (lessons: EMFILE on OneDrive). Restart for verification.
- **No Workflow auto-launch:** multi-agent Workflow orchestration requires explicit owner opt-in.
- **False positives:** ~576 `POSSIBLE_MISATTRIB` flags are heuristic-noisy (title-overlap=0 is normal for
  correct cites); the 15 non-resolving + 185 year-mismatches are the high-confidence core to fix first.
