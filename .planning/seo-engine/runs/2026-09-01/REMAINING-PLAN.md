# REMAINING-PLAN — SEO engine run 2026-09-01, Wave 2 leftovers + Wave 3 close

*Strategist artifact. Conductor executes against this file; do not improvise order.*
*Constitution: `.planning/seo-engine/ORCHESTRATOR.md` §1. Bars: `.planning/seo-engine/LOOPS.md`. Packets: `.planning/seo-engine/AGENTS.md`.*
*Branch `feat/scoring-and-freshness`. No merge. No push. Commits only when Lucas asks. Net URL delta 0.*

---

## 1. Answer first — remaining work vs already KEEP

| Loop | Status now | Remaining increments | Blocked? |
|---|---|---|---|
| L0 Measurement | **BLOCKED** (AUTH-BLOCKED.md; MEASUREMENT.md is 2026-07-25 data, labeled stale) | W3-M1 post-OAuth repull + rewrite | **Lucas OAuth** |
| L1 Bot | PASS as diagnosis; localhost gtag skip coded (not live until deploy) | none in repo | Lucas: WAF apply + GA4 filter click |
| L2 Crawl | **KEEP** (iter 2, GRAPH_EXIT=0, broken 0) | W2-G1 homepage featured (optional, one increment) | no |
| L3 Technical | not run | W2-T1 owner-action doc only — no code "fix" for 307 | Lucas: Vercel dashboard click |
| L4 Integrity | CRITICAL + I-04/I-06 done | **W2-I05, W2-I07, W2-I08, W2-I09** | no |
| L5 Freshness | scan PASS (107/107); writer queue FAIL → noise-gated worklist | **W2-F-TR1 → W2-F-E1 → W2-F-R1 → W2-F-D1** | no |
| L6 Traffic | plan PASS (0 adds); Set 1 done | **W2-O-SET2 … W2-O-SET7** | no (re-rank option if L0 lands before Set 6) |
| L7 Funnel | **KEEP** (templates: AppWaitlistCTA on Dossier/Calculator/Safety layouts) | W2-U1 blog-end CTA stragglers (3 files) | no |
| L8 Authority | **KEEP** (llms.txt generated, live compare slugs only) | none | no |
| Wave 3 | — | **W3-V1 Verifier** (sole occupant) | no |

**Total open editing increments: 4 integrity + 4 freshness + 6 optimizer sets + 1 CTA + 1 optional homepage + 1 doc = 17, then Verifier.**

---

## 2. Do-not-touch / do-not-redo

**Already KEEP this run — reopening any of these is a Judge fail:**

- L2: `currentSlug` → `dossierSlug`/`slugProp` in DossierLayout; trial slugs from pack filename (`trials/index.astro`, `TrialTable.astro`, DossierLayout trial maps); HTML trailing slashes stripped (DossierLayout `/regulatory-tracker/`, `cardiogen.mdx` `/peptides/cartalax/`, `kristagen.mdx` `/peptides/chonluten/`); tesamorelin reconstitution calc inbound from dossier (in:1, depth 3). Evidence: `ratchet/L2.md` #17, `judge/L2-iter2.md`, GRAPH_EXIT=0 on 1,209 pages.
- L7: AppWaitlistCTA on DossierLayout, CalculatorLayout, SafetyLayout; href `/newsletter`; no store badge, no `/peptracker` URL, no vendor. Do not add more template CTAs.
- L8: `llms.txt` / `llms-full.txt` generated via absUrl; featured compares are live slugs only; no trailing slash. Do not re-edit those generators.
- L4 done: `is-bpc-157-safe.mdx`, `thymulin-vaccine-response.mdx`, `tirzepatide-cancer-incidence.mdx` fixed; SURMOUNT-5 (PMID 40353578) on `tirzepatide-vs-semaglutide.mdx`; SURMOUNT-1 20.9% on `vk2735-vs-tirzepatide.mdx`; Lilly IR listing URLs stripped from `surmount-5-tirzepatide-vs-semaglutide.mdx` and `orforglipron-attain-1-*.mdx`. Do not reopen except W2-I09's dangling-ID verify.
- L1: localhost gtag guard in BaseLayout.astro is coded — do not re-code. WAF is a Lucas click — do not apply.

**Never (standing):**

- No new URLs of any kind (CONTENT-PLAN ledger 0/0/140). No new peptides (GAPS.md only, and only if `discover:gaps` runs in a later wave — it is not scheduled).
- Do not restore the 301'd fabrication slugs (`2025-peptide-approvals-record`, `orforglipron-beats-oral-semaglutide`, `ai-peptide-drug-discovery`) or delete any vercel.json 301 (13+1 fabrications, 9 compare-order, 5 clinic `.mdx`, `/guides`→`/guide`).
- Do not clone GLP-1 vs GLP-1 blogs (B8). Do not fatten both halves of a twin (Lucas rule). Merge-with-redirect is blocked on Lucas — differentiate only.
- Do not ingest the generic-name scan dumps: glutathione (423), hcg (277), ll-37 (199), klotho (154), kisspeptin (139), follistatin (80), humanin (63), alpha-defensins (32). Those are broken-alias volume, not a busy month.
- Do not write TRIUMPH efficacy numbers (28.3%/28.7%) from memory — this run's PubMed search found only the design paper and a 2024 correspondence.
- Do not fuzzy-attach identifiers (0.55 similarity poisoned this repo). Do not re-attach numeric PMIDs that resolved to wrong papers.
- Do not change `trailingSlash`, canonical host, or "fix" the vercel.json redirect that is already correct (live 307 is a Vercel *dashboard* setting).
- Do not retire the 5 unsourceable bioregulators (Gate D4 = Lucas). Flag only.
- `noindex` without sitemap-drop is forbidden; nothing in this plan needs either.
- Banned content: dosing, purchasing, medical advice. `qa:advice` + `qa-banned-content` are law on every touched file.

**Deferred residual (0 live misses — NOT scheduled; reopen only if `graph:check` regresses):**

- FALSE-LINKS C2: trailing slashes inside JSON-LD/ItemList URLs (schema-only, redirect hops, not broken).
- FALSE-LINKS D2: Set-guards on SafetyLayout / ProtocolLayout / GuideLayout / CalculatorLayout peptide hrefs (0 current misses; regression-prevention class).

### Stale worklist vs actual KEEP (so implementers do not redo L2/L8)

| UPDATE-WORKLIST.md still lists as open | Actual state | Proof |
|---|---|---|
| `currentSlug` name-derived (DossierLayout:323), 6 dossiers | **KEEP** — slugProp/dossierSlug | RUN-REPORT L2; ratchet #17; L2-iter2 judge |
| Trailing slashes (DossierLayout 487, cardiogen 329, kristagen 388) | **KEEP** — stripped | same; git diff this run |
| Orphan `/calculator/reconstitution/tesamorelin` | **KEEP** — inbound from dossier, in:1 depth 3 | L2-iter2 judge table |
| `llms.txt.ts` lists 4 deleted compare-order URLs + slashes | **KEEP** — generator fixed, live slugs only | RUN-REPORT L8; L8-iter1 judge |
| TrialTable space/slash 404s (`/peptides/thymosin alpha-1` etc.) | **KEEP** — pack `peptideSlug` filename | ratchet #17; dead targets gone in L2-iter2 |
| `graph:check` "100% silent" | **JOIN ARTIFACT** — no `gsc-*-page.json` in this checkout; real silence ~75% from Jul diagnosis | L2-iter2 judge note |

---

## 3. Execution order (Wave 2 order preserved; completed steps skipped)

ORCHESTRATOR Wave 2 order is: 1 bot filters → 2 graph/link → 3 integrity → 4 freshness → 5 blog optimizer → 6 new URLs → 7 funnel → 8 technical leftovers. Steps 1–2 are KEEP. Step 6 is empty (0 approved adds). So:

1. **Integrity remaining** (highest severity first): W2-I05 → W2-I07 → W2-I08 → W2-I09
2. **Freshness gated slice**: W2-F-TR1 → W2-F-E1 → W2-F-R1 → W2-F-D1 (Evidence → Trials → Reg → Dossier; editorial/blog cites only what these verified)
3. **Blog Optimizer**: W2-O-SET2 → SET3 → SET4 → SET5 → SET6 → SET7 (stop after Set 7)
4. **Funnel blog CTAs**: W2-U1 (after Sets 5 and 6 are judged)
5. **Homepage featured** (optional): W2-G1
6. **Technical doc**: W2-T1 (any slot; no src edits)
7. **Wave 3**: W3-V1 Verifier, sole occupant
8. **If Lucas completes OAuth at any point**: W3-M1 (repull + MEASUREMENT rewrite); conductor may re-rank before Set 6 per CONTENT-PLAN §9.

Hard sequencing constraints:

- W2-I08 must be Judge-KEPT before Set 5 (`aod-9604-safety`) and Set 7 (`best-peptide-for-weight-loss-2026`) start — same files. Wave order already guarantees this; do not parallelize across that boundary.
- W2-F-E1 and W2-F-D1 touch the same dossiers — strictly sequential (E1 judged → D1). W2-F-R1 touches `oveporexton.mdx` after E1 is judged.
- Never two editors on one file. ≤3 concurrent editors. Dev server off. No parallel `astro build` — every `graph:check` is a sole-occupant build slot.
- Every increment: Implementer → Quality Judge (≠ author) → keep/revert → ratchet row in `ratchet/<LOOP>.md`. Judge notes to `judge/`.

---

## 4. Increments (dispatch packets)

Shared preamble for every brief (copy from AGENTS.md): repo peptide-library not pepcodex-app; branch `feat/scoring-and-freshness`; constitution ORCHESTRATOR §1 + loop bar; sourcing-rules skill; banned content; links mirror getStaticPaths, no trailing slash, Set-guard free-text slugs; discovery ≠ authorship; treatment-regimen estimand leads; dated absence windows; PowerShell 5.1 no `&&`/`||`; content files are CRLF, regexes `\r?\n`; quote YAML titles containing `:`; no astro build unless Verifier/Crawl Engineer sole occupant; never mark own work passed; return artifact path + 8-line summary + blockers.

### W2-I05 — Integrity — wegovy-pill post strip/correct (Agent I)

- **Files allowed:** `src/content/blog/wegovy-pill-launches-us.mdx` (1 file). **Forbidden:** everything else; no new URLs; do not expand into a news post; do not touch the OASIS 4 post.
- **Inputs:** `INTEGRITY-FINDINGS.md` I-05; CONTENT-PLAN (slug stays for traffic); fact: OASIS 4 coverage lives on `oral-semaglutide-25mg-*.mdx`.
- **Verified live this run (Strategist check 2026-09-01):** frontmatter still carries `nejm-oasis` → `https://www.nejm.org` (homepage), the FDA source → `https://www.fda.gov/drugs` (homepage), `novo-press-2026` → `https://www.novonordisk.com/news` (index), `oasis-1-trial` → `https://clinicaltrials.gov/oasis1` (not an NCT; CT.gov chrome). Body claims $149/month oral Wegovy US launch and OASIS 1 15–17% — likely fabrication cluster.
- **Work:** strip all four homepage/listing/fake URLs. Verify-then-act on body claims: a claim stays only if tied to an identifier or document fetched **this run** (NCBI/CT.gov/FDA or Novo press-release page with URL + access date); otherwise remove the claim. Result is a thinner, honest post — that is success, not failure. May cross-link the OASIS 4 post if the sentence is on-subject. Keep evidence grading + disclaimer. Bump `lastUpdated`.
- **Success check (LOOPS L4):** no false links; no fabricated claims; `qa:claims` + `qa:attached` clean on the touched file; no identifier introduced that wasn't fetched this run; remaining sources resolve AND topical-match.
- **Gates:** qa:claims, qa:attached. NCBI/CT.gov fetch required for anything kept. graph:check only if internal links were added.

### W2-I07 — Integrity — cerluten wrong-paper PMID + empty pmids (Agent I; covers I-07 + I-10)

- **Files allowed (4):** `src/content/peptides/cerluten.mdx`, `ovagen.mdx`, `ventfort.mdx`, `visoluten.mdx`.
- **Verified live this run:** cerluten `scoring.citations` still lists `PMID:25403301` (esummary this run: Mashin 2014 **cortexin** brain-ischemia trial — wrong paper); cerluten `evidenceChainedBenefits[0].keyFindings[0]` has `pmid: ''`; ovagen/ventfort/visoluten each carry empty-`pmid` findings (INTEGRITY-FINDINGS I-10 table).
- **Work:** remove 25403301 from cerluten scoring citations (a scoring drop after a verified fabrication is explicitly allowed). Empty-pmid findings: cite a paper fetched this run that **names the compound**, or remove the finding. Default = remove. No fuzzy attach. Keep Zod enums valid. Bump `lastUpdated` on each touched dossier.
- **Success check (L4):** no real-id-wrong-paper; no empty-string pmid placeholders; `qa:attached`/`qa:claims` clean on touched files.
- **Gates:** qa:attached, qa:claims. NCBI only if adding (default: not).

### W2-I08 — Integrity — stripped-id fake title-links (Agent I; covers I-08 leftovers)

- **Files allowed (2):** `src/content/blog/best-peptide-for-weight-loss-2026.mdx`, `src/content/blog/aod-9604-safety.mdx`.
- **Verified live this run:** `pmid-39107523` source entry + body cite near line 135 (real 39107523 = mantle-cell lymphoma series); `pmid-17579513` source entry (real 17579513 = influenza-pandemic vaccines editorial). BPC `pmid-28013436` already stripped — do not touch that file.
- **Work:** strip both fake source entries and their body citation keys. Do NOT re-attach those numeric ids. **One allowed re-attachment:** the SURMOUNT-5 sentence in best-peptide-for-weight-loss-2026 may cite **PMID 40353578** — it was esummary-fetched this run and already lives on the tirzepatide dossier and surmount-5 blog (worklist id, not fuzzy match). Reword or remove sentences left sourceless. After the edit, confirm no PubMed-search href is emitted for the stripped titles (the `BlogLayout.astro` `getSourceUrl` class); if the layout still links `verified: false` sources, report it — do not edit the layout in this increment.
- **Success check (L4):** stripped ids gone from frontmatter and body; no wrong-paper id; qa:claims clean on touched files.
- **Gates:** qa:claims. Must be Judge-KEPT before Optimizer Sets 5 and 7 open those files.

### W2-I09 — Integrity — dangling body IDs, verify-then-act (Agent I; covers I-09)

- **Files allowed (2):** `src/content/blog/fda-peptide-stability-guidance.mdx`, `src/content/blog/fda-tightens-peptide-compounding-rules.mdx`.
- **Inputs:** INTEGRITY-FINDINGS I-09 (dangling keys on the stability post: the FDA-draft / ICH / formulation-review keys; on the compounding post: the 2026-guidance / nomination-review / pharmacy keys + `[503a-requirements]`).
- **Work:** for each dangling key — fetch the real FDA/ICH guidance document this run (URL + access date) and add it to `sources[]`, or reword the body to cite declared sources, or drop the claim. Treat un-fetched guidance claims as unverifiable, not confirmed fabrications. Also re-run the dangling scan on the three fixed CRITICAL blogs; act only if a dangling ID remains (default expectation: none).
- **Success check (L4):** zero dangling body citation keys on touched files; absence claims dated; qa:attached clean.
- **Gates:** qa:attached. FDA.gov fetches required for any kept guidance claim.

### W2-F-TR1 — Freshness — trial pack sync (Agent TR)

- **Files allowed (≤10 packs):** `data/source-packs/` for `survodutide`, `retatrutide`, `oveporexton`, `orforglipron`, `cagrisema`, `cagrilintide`, `mazdutide`, `maritide` (stretch +`rusfertide`, `pf-08653944` if review bandwidth holds).
- **Inputs:** `.planning/research-scan/2026-09-01/<slug>.json` `newTrials[]`/`updatedTrials[]` only; `refresh-trials.mjs` merge pattern; `data/trial-match-aliases.json`.
- **Named, title-checked this run (still re-fetch before merge):** survodutide ← NCT07754461 (Phase 3 T2D, RECRUITING, 600) + NCT07768813 (Phase 1 formulation, NOT_YET_RECRUITING, 44 — no results); status sync NCT06632457 / NCT06632444 (LIVERAGET, recruiting). retatrutide ← sync NCT07165028 (MASLD master protocol, Phase 3, recruiting, interventions tirzepatide + retatrutide), NCT06383390 (TRIUMPH-Outcomes, active-not-recruiting), NCT05929066 (TRIUMPH-1, completed). oveporexton ← sync NCT06470828 (TAK-861 Phase 3, COMPLETED 2026-08-31). All other slugs: drug-match from the JSON before merge.
- **Work:** CT.gov v2 fetch per NCT this run; drug-match interventions; add-only for new NCTs; normStatus/normPhase; stamp sync date. No stem-matching trial families.
- **Success check (L5):** `qa:trials` clean on touched packs; every merged NCT fetched this run.
- **Parallel:** MAY run with W2-I05 / W2-I07 / W2-I08 (disjoint files).

### W2-F-E1 — Freshness — evidence findings (Agent E; after TR1, or parallel with TR1 since packs ≠ dossiers)

- **Files allowed (≤8 dossiers, evidence fields only):** `src/content/peptides/{retatrutide,survodutide,oveporexton,orforglipron,cagrisema,cagrilintide,mazdutide,maritide}.mdx`.
- **Named, title-checked this run:** retatrutide ← **PMID 42608321** (cardiovascular risk biomarkers, Diabetes Obes Metab 2026-08-17, Ruotolo G). survodutide ← **PMID 42642663** is a **Published Erratum** (author correction, Nature Medicine SYNCHRONIZE-MASLD) — record as a correction note only, never as new efficacy data. oveporexton ← **PMID 42618292** title claims "approved for … narcolepsy type 1 (NT1)": cite the paper only for what it is; **no approval language in reg fields or prose until W2-F-R1 fetches a regulatory source**. Skip **42610966** (title does not name oveporexton).
- **Everything else:** apply the Freshness filter SOP (§5) to the slug's JSON before writing. Default skip for tirzepatide/semaglutide volume unless a title names the compound AND is RCT/Phase 3 — and even then only if it fits the set of 10.
- **Success check (L5):** every written identifier esummary/efetch-fetched this run with topical match; treatment-policy estimand leads; preprints labeled; Verifier will re-resolve every id.
- **Gates:** qa:claims on touched dossiers. NCBI fetch required (≤3/s, stagger).

### W2-F-R1 — Freshness — oveporexton regulatory verify (Agent R; after E1 judged)

- **Files allowed (1):** `src/content/peptides/oveporexton.mdx` (`regulatoryStatus` field only).
- **Work:** fetch openFDA / EMA / PMDA + Takeda label for an NT1 approval. Every status change cites document URL + access date. If no regulatory source found: write nothing about approval; if prose needs a statement, use a dated absence ("as of 2026-09-01, no approval located in openFDA/EMA/PMDA"). A paper title is not a regulatory source.
- **Success check (L5/R bar):** URL + access date on any change; no "legal to buy" language; no medical advice.

### W2-F-D1 — Freshness — dossier application pass (Agent D; after E1/R1 judged)

- **Files allowed:** the same ≤8 dossiers E1 touched (sequential, never concurrent).
- **Work:** apply the verified packet to prose (trial status from TR1 packs, findings from E1), bump `lastUpdated`, keep aliases honest, escape `<` in stats. Gaps → `NEEDS-VERIFICATION-F1.md`, never invented.
- **Success check (L5 + sourcing-rules):** dossiers reflect only E1/TR1/R1-verified identifiers; Zod valid; dated negatives where the scan found nothing relevant.

### W2-O-SET2 … W2-O-SET7 — Blog Optimizer (Agent O; one dispatch per set)

- **Files allowed:** exactly the 10 blog MDX per set listed in `CONTENT-PLAN.md` §7 (Sets 2–7). Do not retype slugs from memory — copy from CONTENT-PLAN. Set 1 is done; do not re-open it.
- **Per-set success lines:** copy from CONTENT-PLAN §7 verbatim into each brief (twin yields; CTA placement: Set 4 → four CTAs; Set 5 → semax, semaglutide-vs-tirzepatide-2026, is-bpc-157-safe; Set 6 → zepbound-sleep post, retatrutide-phase3-enrollment; Set 7 → OSA, best-of, SURMOUNT-5, tesamorelin-liver).
- **Bar (LOOPS L6):** no new slugs; no 301s; no fattened twins; H1 job-split vs guide/safety twin; internal links to real collection slugs, no trailing slash, related-* Set-guarded (miss = text); estimand-correct figures; `qa:advice` + banned-content clean; `lastUpdated` bumped; **independent adversarial review per set before any commit** (historically catches 1 CRITICAL per set — budget for it).
- **Gates:** `graph:check` after each set (sole-occupant build slot; serialize — never parallel builds). Do not re-rewrite R1/R2/`f1b91e0` bodies for length.
- **Stop after Set 7** unless Lucas asks for the 0-PAGE citation-hygiene tail (not traffic work).

### W2-U1 — Funnel — blog-end CTA stragglers (Agent U; after Sets 5 and 6 judged)

- **Files allowed (3):** `src/content/blog/peptide-evidence-levels-explained.mdx`, `dsip-sleep-quality-study.mdx`, `ss31-mitochondrial-heart-failure.mdx`.
- **Why only 3:** CONTENT-PLAN §6's 16 funnel posts are otherwise covered inside Optimizer set success lines (Sets 4–7). These three are not. Verify-then-act: if the Optimizer already placed a CTA on dsip/ss31, skip that file.
- **Work:** end-of-post AppWaitlistCTA (the existing component, `/newsletter` href), after the content — never above a verdict. No store badge, no vendor, no dosing implication.
- **Success check (L7):** CTA href present in **built** HTML for these posts at the next sole-occupant build (grep `dist/`); `qa:advice` clean.

### W2-G1 — Crawl — homepage featured posts (Agent G or L; OPTIONAL, lowest priority; only after integrity + Sets 2–4 are judged)

- **Verified this run:** `src/pages/index.astro` uses `getCollection('blog')` only for a count — no featured-posts module exists.
- **Files allowed (1):** `src/pages/index.astro`.
- **Work (CONTENT-PLAN §8):** feature 4 **existing** slugs — `semax-neuroprotection-stroke`, `semaglutide-vs-tirzepatide-2026`, `dsip-sleep-quality-study`, `is-bpc-157-safe`. Links `/blog/<slug>`, no trailing slash. Not a new URL.
- **Gates:** `graph:check` required (sole-occupant build). One increment only; if it fails review, drop it — do not retry twice.

### W2-T1 — Technical — owner-action doc (Agent T; any slot)

- **Files allowed (1):** `.planning/seo-engine/runs/2026-09-01/TECHNICAL-SEO.md`. **No src edits.**
- **Content:** Vercel dashboard apex→www 307→permanent is an owner click (vercel.json already correct — do not touch); trailing-slash duplicate note (no config change); `searchAppearance` empty — diagnose note only; overturned list the Judge fails anyone for acting on: "16 months of data," "title length is the CTR bottleneck," "more GLP-1 vs GLP-1 for volume," "DR 3.3 makes top-5 impossible," query-export silence as no-demand.

### W3-M1 — Measurement — post-OAuth repull (Agent M; BLOCKED on Lucas)

- **Trigger:** Lucas runs the OAuth line (§6). Then: `npm run gsc:whoami` (must print an email) → `npm run gsc:sites` → `npm run gsc:repull` → `npm run ga4:pull`. Scripts already have country/hostname/page+query cuts — do not revert them.
- **Work:** rewrite `MEASUREMENT.md` with the **returned** date windows per property; label UNTRUSTED series; page+device+country KPIs, never query-only. Then conductor may re-rank before Set 6.

### W3-V1 — Verifier (Agent V; sole occupant; last)

- **Do:** `npm run check`; `npm run qa:claims`; `npm run qa-retractions`; `npm run graph:check`; sole-occupant honest build — `cmd /v:on` with `REAL_BUILD_EXIT=!ERRORLEVEL!` captured **inside** the log (PowerShell `%ERRORLEVEL%` without delayed expansion lies; wrapper exit codes lie). Re-fetch every identifier added in this run's diff (topical match, not resolution-only). Net sitemap URL count vs GRAPH-BASELINE (1,209 pages / 1,124 sitemap URLs).
- **Write:** `VERIFICATION.md` — pass/fail per command, REAL_BUILD_EXIT, identifier sample, graph metrics vs baseline.
- **Must not:** edit content to make a gate pass — bounce to the owning Implementer.

---

## 5. Freshness filter SOP (title-check before any write)

1. Open `.planning/research-scan/2026-09-01/<slug>.json`. Only ids in that file are candidates. The scan is **discovery, not authorship** — the implementer re-fetches (esummary/efetch or CT.gov v2) everything it cites.
2. **Title must name the compound** (or its dev code: LY3437943, BI 456906, TAK-861, LY3298176…). Absent from title → check abstract via efetch; still absent → skip.
3. **Skip rules:** Cureus (anything); class systematic reviews (e.g. Annals GLP-1 SR PMID 42673585 on the retatrutide list); reviews naming a class, not the compound; preclinical (default skip this run); generic-name dumps (glutathione/hcg/ll-37/klotho/kisspeptin/follistatin/humanin/alpha-defensins) — treat as broken alias query, never hand to writers.
4. **Erratum pubType** → correction note only, never new results.
5. **Approval/label claims** (e.g. oveporexton "approved for NT1") require R's regulatory fetch with URL + access date before any "approved" wording. A paper title is not a regulatory source.
6. **Estimand:** treatment-regimen number leads; sponsor efficacy estimand labeled. No press-release numbers as headlines.
7. **Absence is dated:** "scanned 2026-09-01, window since <slug lastUpdated>, 0 relevant hits" — never eternal "no publication."
8. Editorial/blog may cite only what E/TR/R verified this run. No blog edits from scan JSON directly. WebSearch is not a source.
9. NCBI ~3/s anonymous; stagger calls; use `verification/pubmed.mjs` only.

---

## 6. Lucas-blocked queue (owner actions; do not create extra owner work)

1. **OAuth (Gate 0).** One PowerShell line (from AUTH-BLOCKED.md; Desktop client, quoted scopes, no spaces around commas):

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login --client-id-file="C:\Users\manci\.gcp\pepcodex-oauth-client.json" --scopes="https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/userinfo.email"
```

   Then: `npm run gsc:whoami` → must print an email → `npm run gsc:sites` → `npm run gsc:repull` → `npm run ga4:pull`. Walkthrough: `.planning/GOOGLE-API-SETUP.md` Steps 9–11. Do not create SA keys; do not use gcloud's shared client.
2. **Vercel dashboard:** apex→www redirect 307 → permanent (code already correct; dashboard only).
3. **Vercel Firewall:** apply `BOT-WAF-DRAFT.md` (challenge SG fingerprint; allowlist Googlebot/Google-InspectionTool/Bingbot/ChatGPT-User/PerplexityBot; never block Direct).
4. **GA4 data-filter click** after the re-pull lands (Singapore/China/localhost exclusions per `BOT-DIAGNOSIS.md`).
5. **GSC "Request indexing"** on `/peptides`, `/trials`, `/regulatory-tracker` — after these fixes ship to production.
6. **Twin merge-with-redirect decision** (blog/guide/safety). Default stays differentiate-only.

---

## 7. Stop conditions / gaming checks (halt and reframe if seen)

- Footer-dumping links to zero "orphans," or any link a reader wouldn't click.
- Fattening both halves of a twin; re-rewriting R1/R2/`f1b91e0` bodies for word count.
- Ingesting glutathione/hcg/ll-37-class dumps; OR-joined alias queries; unfiltered PubMed handed to a writer.
- Restoring retired 301 slugs or ledger-`retired` identifiers.
- Fabricating from WebSearch/memory; fuzzy title auto-attach; press-release number as headline; "approved" without regulatory fetch; undated "no publication found."
- Any new URL, any slug rename, any `noindex` without sitemap-drop, any `trailingSlash`/canonical-host change.
- Trusting a wrapper exit code; running parallel astro builds; an Implementer marking its own work passed; stacking an unevaluated change on another.
- Arguing demand from query-export silence (A2 censorship).

---

## 8. Close criteria for the 2026-09-01 run (without pretending L0 passed)

- [ ] W2-I05/I07/I08/I09 all KEEP or explicitly deferred with reason in RUN-REPORT.
- [ ] Freshness slice (TR1/E1/R1/D1) KEEP, or partial KEEP with the remainder logged as not-done-and-why.
- [ ] Optimizer Sets 2–7 KEEP with per-set adversarial review notes in `judge/` (or honest FAILURE.md per set).
- [ ] W2-U1 done or verified-already-present; W2-G1 done or consciously dropped; W2-T1 written.
- [ ] `VERIFICATION.md` exists: `REAL_BUILD_EXIT=0` from inside the log, `graph:check` exit 0, every new identifier re-fetched by V, net URL count = 1,209 (delta 0).
- [ ] RUN-REPORT updated: loop scoreboard final, integrity added/stripped counts, Lucas-action list, not-done list.
- [ ] `.planning/STATE.md` one dated paragraph.
- [ ] L0/L1 recorded as **BLOCKED on Lucas** — the run closes with those open. Do not mark PASS, do not fake a pull, do not treat 2026-07-25 data as current.
- [ ] No commit unless Lucas asks.

---

## 9. First three dispatches (copy-paste ready)

### Dispatch 1 — W2-I05 (Agent I, Integrity)

```
You are Agent I (Integrity Auditor, Wave 2 implementer) for pepcodex.com.
Repo: peptide-library (Astro). Not pepcodex-app. Branch: feat/scoring-and-freshness.
Do not merge, do not push, do not commit. Dev server off. No astro build.
Constitution: .planning/seo-engine/ORCHESTRATOR.md §1 + LOOPS.md L4.
Source rules: .claude/skills/sourcing-rules/SKILL.md. Never fabricate identifiers.
PowerShell 5.1: no && / ||. Content files are CRLF; regexes must match \r?\n.
Quote YAML titles containing ':'.

INCREMENT W2-I05 — strip/correct false sources on ONE file:
  src/content/blog/wegovy-pill-launches-us.mdx

Verified live 2026-09-01 (Strategist check): frontmatter sources include
  - id nejm-oasis      -> https://www.nejm.org              (journal homepage)
  - the FDA source     -> https://www.fda.gov/drugs         (FDA drugs homepage)
  - id novo-press-2026 -> https://www.novonordisk.com/news  (news index)
  - id oasis-1-trial   -> https://clinicaltrials.gov/oasis1 (NOT an NCT; CT.gov chrome)
Body claims: $149/month oral Wegovy US launch; OASIS 1 15-17% weight loss —
likely fabrication cluster. Reference: .planning/seo-engine/runs/2026-09-01/INTEGRITY-FINDINGS.md I-05.

DO:
1. Strip all four homepage/listing/fake source entries and their body citation keys.
2. Verify-then-act on every launch/pricing/efficacy claim: a claim survives only
   if you fetch a real identifier or document THIS RUN (NCBI esummary/efetch via
   verification/pubmed.mjs, CT.gov v2, or an FDA/Novo page with URL + access date).
   Otherwise delete the claim. A thinner honest post is success.
3. Do NOT expand into a news post. Do NOT add URLs. Do NOT touch
   oral-semaglutide-25mg-*.mdx (OASIS 4 lives there; you may cross-link it only
   if the sentence is on-subject).
4. Keep evidence grading + disclaimer. Bump lastUpdated. Escape 'P<0.001' in MDX.
5. Run: npm run qa:claims and qa:attached on the touched file. Paste output.

FILES YOU MUST NOT TOUCH: everything except the one named file.

SUCCESS CHECK (LOOPS.md L4): no false links; no fabricated claims; no identifier
introduced that wasn't fetched this run; remaining sources resolve AND
topical-match; qa:claims + qa:attached clean on the file.

You do not mark your own work passed — the Quality Judge does.
Return: file path + 8-line summary + commands actually run + blockers.
```

### Dispatch 2 — W2-I07 (Agent I, Integrity)

```
You are Agent I (Integrity Auditor, Wave 2 implementer) for pepcodex.com.
Repo: peptide-library (Astro). Not pepcodex-app. Branch: feat/scoring-and-freshness.
Do not merge, do not push, do not commit. Dev server off. No astro build.
Constitution: .planning/seo-engine/ORCHESTRATOR.md §1 + LOOPS.md L4.
Source rules: .claude/skills/sourcing-rules/SKILL.md. Never fabricate identifiers.
PowerShell 5.1: no && / ||. Content files are CRLF; regexes must match \r?\n.

INCREMENT W2-I07 — wrong-paper scoring citation + empty pmid placeholders.
FILES ALLOWED (4, nothing else):
  src/content/peptides/cerluten.mdx
  src/content/peptides/ovagen.mdx
  src/content/peptides/ventfort.mdx
  src/content/peptides/visoluten.mdx

Verified live 2026-09-01:
- cerluten.mdx scoring.citations contains "PMID:25403301". NCBI esummary this
  run: Mashin VV 2014, an open clinical trial of CORTEXIN in brain ischemia —
  wrong paper for Cerluten. Remove it from scoring.citations. (A scoring drop
  after a verified fabrication is allowed; do not substitute another id.)
- cerluten evidenceChainedBenefits[0].keyFindings[0] has pmid: '' asserting
  "Observational studies suggest cognitive effects in elderly".
- ovagen.mdx, ventfort.mdx, visoluten.mdx each carry empty-pmid findings
  (see INTEGRITY-FINDINGS.md I-10 for the exact assertions).

DO, per empty-pmid finding: either cite a paper you fetch THIS RUN whose
title/abstract names the compound (esummary/efetch via verification/pubmed.mjs),
or remove the finding. DEFAULT = remove. Never fuzzy-attach by title similarity.
Keep Zod enums valid. Bump lastUpdated on each touched dossier.
Run qa:attached and qa:claims on the four files. Paste output.

SUCCESS CHECK (L4): no real-id-wrong-paper; no empty-string pmid; gates clean.
You do not mark your own work passed.
Return: file paths + 8-line summary + commands actually run + blockers.
```

### Dispatch 3 — W2-F-TR1 (Agent TR, Trials Analyst)

```
You are Agent TR (Trials Analyst, Wave 2) for pepcodex.com.
Repo: peptide-library (Astro). Not pepcodex-app. Branch: feat/scoring-and-freshness.
Do not merge, do not push, do not commit. Dev server off. No astro build.
Constitution: .planning/seo-engine/ORCHESTRATOR.md §1 + LOOPS.md L5.
PowerShell 5.1: no && / ||. Discovery is not authorship: re-fetch every NCT
from CT.gov v2 THIS RUN before merging.

INCREMENT W2-F-TR1 — sync trial packs from the 2026-09-01 scan.
FILES ALLOWED (data/source-packs/<slug>.json only, max 10):
  survodutide, retatrutide, oveporexton, orforglipron, cagrisema,
  cagrilintide, mazdutide, maritide  (stretch: +rusfertide, +pf-08653944)

INPUTS: .planning/research-scan/2026-09-01/<slug>.json — newTrials[] and
updatedTrials[] ONLY. Merge pattern: scripts/refresh-trials.mjs
(merge-preserving-curated-fields). Aliases: data/trial-match-aliases.json.

Named, already title-checked (still re-fetch before merge):
- survodutide: ADD NCT07754461 (Phase 3 T2D, RECRUITING, 600) and NCT07768813
  (Phase 1 formulation, NOT_YET_RECRUITING, 44 — no results). SYNC status for
  NCT06632457 and NCT06632444 (LIVERAGET, recruiting).
- retatrutide: SYNC NCT07165028 (MASLD master protocol, Phase 3, recruiting,
  interventions include tirzepatide + retatrutide), NCT06383390
  (TRIUMPH-Outcomes, ACTIVE_NOT_RECRUITING), NCT05929066 (TRIUMPH-1, COMPLETED).
- oveporexton: SYNC NCT06470828 (TAK-861 Phase 3, COMPLETED, lastUpdate
  2026-08-31).
All other slugs: drug-match interventions from the JSON before any merge.

RULES: add-only for new NCTs; normalize via existing normStatus/normPhase;
stamp sync date; never stem-match trial families (SYNCHRONIZE-1 ≠ SYNCHRONIZE-CVOT);
never trust a stored registry label before drug-match.
Run qa:trials on touched packs. Paste output.

SUCCESS CHECK (L5): every merged NCT fetched this run; qa:trials clean.
You do not mark your own work passed.
Return: pack paths + 8-line summary + commands actually run + blockers.
```

*Dispatches 1–3 have disjoint file sets and MAY run concurrently (3 editors = cap). Judge each independently before the next wave of dispatches.*

---

*Strategist (Kimi K3), 2026-09-01. Plan only — no src/, data/, or layout edits made; no build run.*
