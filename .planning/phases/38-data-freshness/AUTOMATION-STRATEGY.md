# Phase 38 — Always-Current Directory: Automation Strategy

*Created: 2026-06-26 · Owner: Product+Platform · Status: PLANNED*
*Synthesizes 3 ideation streams (Coverage Expansion, Monetization, Best-Directory Moat) into ONE prioritized roadmap.*

---

## North Star

Be **the most accurate, up-to-date, and best peptide directory on the market** — kept fresh by smart recurring loops, monetized through connected apps + the hub, where **every content/data loop is integrity-gated** (verifiable sources only, no fabrication, evidence-graded, human/LLM review before publish). We just remediated a citation crisis (15 non-resolving PMIDs, 185 YEAR_MISMATCH across 78 files, ~591 flagged occurrences). The strategy turns that crisis into the moat: *"every citation on PepCodex is machine-verified, continuously."* No competitor — paywalled Examine, conflicted vendor wikis, narrow drugs.com — can credibly say that.

## Grounding (verified against current state, 2026-06-26)

- **Corpus:** 102 dossiers · 279 comparisons · 215 glossary · 155 blog · 31 safety · ~30 trial packs. Build green (exit 0, 1,223 pages).
- **Existing infra we build ON (all confirmed in-repo):**
  - `scripts/refresh-trials.mjs` — pulls CT.gov v2, normalizes, merge-writes `data/source-packs/<slug>.json` with `--apply / --query / --phase` flags. Never fabricates.
  - `scripts/qa-pmids.mjs --strict` — resolves every frontmatter+body PMID against NCBI esummary; exit 1 on any non-resolving. **EXISTS BUT IS NOT YET IN THE PREBUILD CHAIN.**
  - `scripts/audit-citations-extract.mjs` + `audit-citations-verify.mjs` — full corpus PMID extraction + topical-match/year-mismatch heuristics. Findings already on disk: `.planning/citation-audit/{findings.json, findings.md, pubmed-meta.json, extract.json}`.
  - `scripts/qa-scoring.mjs`, `qa-banned-content.js`, `validate-cross-links.mjs`, `qa-seo.mjs`.
  - Prebuild today: `npm run check` = `validate-cross-links && qa-seo && qa-scoring`. **qa-pmids and qa-banned-content are NOT in it.** This is the single highest-leverage gap.
- **Known universe to diff against:** 102 slugs in `src/content/peptides/*.mdx`.
- **Two-axis scoring:** rubric v2.4 + RatingCard + qa-scoring gate live, but only **19/102** dossiers carry the `scoring:` block.
- **Regulatory tracker + trials tracker:** built, 100% regulatory-populated, ~30/102 trials-covered.
- **Monetization assets in-repo:** `calculators` collection + CalculatorLayout + `/calculator/reconstitution/[slug]`; `/advertising-policy` (bans vendor ads / pay-for-play / sponsored-as-editorial / dosing); 52 clinic listings; Beehiiv newsletter; Vercel Analytics live.

## The single non-negotiable principle

**Detection writes to a queue, never to `src/content/`. Nothing reaches the live site without (a) every PMID/NCT/DOI resolving against the real source, and (b) a human merge of a PR.** Structured-ID feeds (CT.gov NCT, openFDA application numbers, FDA Federal Register URLs) are fabrication-*proof* by construction — a reviewer can open the source. Free-text literature mining is the highest fabrication-risk surface and gets the strictest gate. We sequence defensive (integrity gate) before offensive (coverage expansion) before opportunistic (monetization automation).

---

## 1. FLAGSHIP LOOPS — build first (in this order)

### LOOP 1 — Citation-Integrity Gate + Continuous Verification *(DEFENSIVE, non-negotiable, prerequisite for everything)*

**Why first:** It closes the one existential vulnerability that can collapse the brand, and it is the prerequisite that makes every *other* automated content loop safe to run. Without it, every automated dossier compounds risk; with it, automation is pure upside. It converts the 591-citation crisis into the hardest-to-copy moat.

- **Trigger / cadence:** (a) BLOCKING on every build/PR (CI gate); (b) scheduled WEEKLY full-corpus re-verification (citations rot, papers get retracted).
- **Data sources / APIs:** NCBI E-utilities (esummary/efetch), Crossref REST (DOIs), ClinicalTrials.gov v2 (NCT). Reuses `.planning/citation-audit/pubmed-meta.json` as the warm cache.
- **Pipeline:**
  1. **Wire the existing guard into prebuild NOW** — change `check` to `validate-cross-links && qa-seo && qa-scoring && qa-pmids --strict && qa-banned-content`. One-line change; immediate blocking protection. (Zero new code — the scripts exist.)
  2. Extend `qa-pmids` resolution to DOIs (Crossref) + NCT (CT.gov) so all three ID classes are gated, not just PMIDs.
  3. **Remediate the backlog first** (15 non-resolving + 185 year-mismatch across 78 files) using `findings.json` — label/fix/quarantine each flagged dossier before flipping the gate to hard-fail on the full corpus. Until a dossier is cleared it carries `citations_verified: false` and is excluded from any data-licensing feed.
  4. Add a `claim-support` check: LLM compares the cited abstract against the citing sentence; **POSSIBLE_MISATTRIB → review queue (GitHub issue), never auto-fail** (heuristic title-overlap is noisy — 576 raw flags — tune so the gate never cries wolf and gets disabled).
  5. Weekly cloud agent re-resolves the whole corpus, opens a `citation-rot` issue for any newly non-resolving/retracted ID.
- **Integrity + review gate:** This loop *is* the gate. Hard-fail tiers: non-resolving ID, year-mismatch. Soft (review-queue) tiers: heuristic misattribution, retraction-watch. Nothing merges until cleared.
- **Infra:** GitHub Actions for the blocking PR/build gate (deterministic, runs on Vercel CI) + **Claude `/schedule` cron cloud agent** for the weekly sweep (it does the LLM claim-support judgement well). `scheduled-tasks` MCP as the local fallback orchestrator.
- **Effort:** L (backlog remediation is the bulk; the gate wiring is trivial). **Moat-impact: TRANSFORMATIVE.**

### LOOP 2 — CT.gov New-Intervention Radar *(OFFENSIVE coverage, lowest fabrication risk)*

**Why second:** Highest-leverage, lowest-risk breadth expansion. CT.gov registrations are structured, real, and uniquely keyed by NCT (impossible to hallucinate). Detection is a one-line Essie query against an API `refresh-trials.mjs` already calls; the diff target (102 slugs) already exists; a trial-pack stub needs **zero free-text claims** — structurally incapable of the fabricated-PMID failure. Also closes the trials-coverage gap (only ~30/102 today).

- **Trigger / cadence:** Weekly cron (Mon 06:00). New registrations post in batches.
- **Data sources / APIs:** CT.gov v2 (`/api/v2/studies`, `filter.advanced=AREA[StudyType]INTERVENTIONAL AREA[LastUpdatePostDate]RANGE[<since>,MAX]`, `query.intr=<curated peptide-family terms>`). Reuses the `refresh-trials.mjs` normalizer. Slug+alias set as the known-universe diff.
- **Pipeline:** cron agent → `node scripts/detect-ctgov-new.mjs` (fork of refresh-trials) → diff intervention names vs slug+alias map → each unmatched intervention with ≥1 interventional trial → write `data/candidates/<slug>.json` (NCT, official title, phase, status, sponsor, conditions, enrollment — all verbatim) + a one-line `.mdx.draft` stub (name, aliases from CT.gov synonyms, `regulatoryStatus: investigational`, sources = NCT records only) → `gh pr create` → human merge.
- **Integrity + review gate:** Writes ONLY to `data/candidates/` (never `src/content/`). Gate = (1) re-fetch each NCT live to confirm resolution, (2) PR opened with stub, (3) human spot-checks 1–2 NCTs + confirms the intervention is a distinct peptide (not an alias/excipient). qa-pmids + qa-banned-content still run in prebuild (nothing to fail on — no free-text claims).
- **Infra:** **Claude `/schedule` cron cloud agent** (preferred — handles the diff + stub authoring) OR n8n Cron→HTTP→Function→GitHub node. GitHub+Vercel CI runs the gate on the PR.
- **Effort:** M. **Moat-impact: HIGH** (breadth + earliest public signal of a new molecule).
- **Risk control:** Maintain an alias map (mine CT.gov `otherName`/synonyms to seed it — shared with Loops 3+5). Constrain `query.intr` to a curated peptide-family term list so "peptide vaccine"-type generics don't over-trigger.

### LOOP 3 — Evidence-Freshness Poller ("Last verified" heartbeat) *(makes "always up-to-date" structurally TRUE)*

**Why third:** This is the loop that makes the core positioning *provable*, not just claimed — the exact axis where Examine (static, slow, archiving peptides) and undated AI-wikis lose. Dated freshness is also a YMYL/E-E-A-T and AI-citation ranking signal. It depends on Loop 1 (it must not surface evidence that then fails the gate).

- **Trigger / cadence:** Per-peptide rolling; full 102-corpus every 2–4 weeks.
- **Data sources / APIs:** NCBI E-utilities (`esearch datetype=edat&reldate=N`), Europe PMC (`FIRST_PDATE:[since TO now]`, indexes bioRxiv/medRxiv), CT.gov v2. Dossier `lastVerified` frontmatter as the watermark.
- **Pipeline:** cron agent batches ~10–15 peptides/run → date-windowed query per peptide (curated query string, NOT bare slug) → (a) stamps machine-verifiable `Evidence last reviewed: <date>` + `New since last review: N studies` frontmatter, (b) drafts a reviewer diff ("3 new RCTs for retatrutide — re-score?") into an `evidence-update` review ticket. Only *high-tier / new-RCT* triggers open a ticket (throttle to beat reviewer fatigue).
- **Integrity + review gate:** Poller only SURFACES real query results + drafts; the ONLY thing it writes unattended is the `last-checked` timestamp. Any substantive dossier text goes through `sourcing-rules` + the Loop 1 citation gate before publish.
- **Infra:** **Claude `/schedule` cron cloud agents** (batched). `scheduled-tasks` MCP alternative.
- **Effort:** L. **Moat-impact: HIGH.**
- **Risk control:** Curated per-peptide query strings (name ambiguity — generic vs research code vs brand). Wire this poller's "new high-tier evidence" event to trigger Loop 6 (re-score).

### LOOP 4 — FDA Regulatory Tracker Auto-Refresh *(owns the single richest 2026 freshness story)*

**Why fourth:** The 2026 FDA peptide reclassification chaos (12 peptides pulled from Category 2 in April, PCAC votes July 23–24 2026 + Feb 2027, GLP-1 503B removal pending) is the richest freshness vector on the market and **no competitor runs it as a live tracker** — drugs.com covers only approved drugs, Examine ignores it, vendors are conflicted. "What's actually legal right now" is a top consumer frustration and prime journalist/AI-citation bait. PepCodex already has the tracker page + 100% populated data — this keeps it true.

- **Trigger / cadence:** Weekly; tighten to daily around known PCAC meeting dates.
- **Data sources / APIs:** FDA 503A bulk-substances pages (Category 1/2), 503B list, Federal Register API, FDA PCAC meeting announcements, openFDA (drugsfda / drug/label) for new approvals + status changes. Existing `regulatory-status` collection as the diff target.
- **Pipeline:** cron agent fetches FDA/FedReg/openFDA → diffs against current `regulatoryStatus` frontmatter → on change: NEW substance → candidate stub; KNOWN → a one-field `regulatoryStatus` patch (structured enum + dated note + FDA application-number/FedReg URL) → `gh pr create` + review ticket.
- **Integrity + review gate:** Every status change is sourced to a specific FDA/FedReg URL with retrieval date. **No regulatory status auto-publishes** — a false "this is legal now" claim is the highest-liability error on the site. PR diff must show exactly one frontmatter field changed + an FDA source URL; human confirms against the linked primary doc before the badge flips. qa-banned-content blocks accidental dosing language.
- **Infra:** **Claude `/schedule` cron agent** + WebFetch for the FDA-page diff (resilient diff on canonical lists, alert-on-change — FDA pages are HTML/PDF, not a clean API). n8n alternative for the page-diff watcher.
- **Effort:** M. **Moat-impact: HIGH.**
- **Risk control:** Brittle scrape → fail soft, alert, never crash the loop or auto-parse a malformed page.

---

## 2. SECOND WAVE (after the flagship four are stable)

| Loop | What | Cadence | Effort | Why second-wave |
|---|---|---|---|---|
| **Two-Axis Scoring Completion + Auto-Re-score** | Backfill the v2.4 rubric to the remaining **83/102** (LLM proposes score + rationale from the *verified* citation set; human ratifies), then wire re-scoring to Loop 3's new-evidence event. | One-time backfill → event-driven | M | Makes the most defensible differentiator visible site-wide. **MUST run after Loop 1 is green** — scores can't rest on bad evidence. Pin human-anchored reference scores per band to audit drift. |
| **Literature Emerging-Molecule Miner** | Date-windowed PubMed + Europe PMC + bioRxiv/medRxiv scoped to peptide-therapeutic MeSH; extracts molecule names absent from the 102 slugs; drafts evidence-graded stubs pre-populated ONLY with self-retrieved, resolution-checked PMIDs. | Weekly, top-N candidates only | L | Highest fabrication-risk surface → runs LAST among detectors and only after Loop 1's gate is hardened. Stub is DISCARDED (not queued) if any PMID fails `qa-pmids --strict`. Preprints flagged "not peer-reviewed", graded very-low. |
| **Trials Tracker Coverage Expansion + Status-Watch** | Backfill CT.gov packs for the ~72 uncovered peptides; watch existing packs for status changes (Phase 2→3, completed, results posted, terminated — e.g. retatrutide TRIUMPH, CagriSema). | Backfill batches → weekly status-diff | M | Reuses the existing refresh workflow + `c37443a5` ClinicalTrials MCP. Low fabrication risk; sequence after integrity/freshness/regulatory. |
| **FDA Pipeline & Approval Watcher (openFDA)** | Poll openFDA drugsfda/NDC/label for new peptide approvals + investigational→approved transitions; feeds regulatory tracker + dossier badges. | Weekly | M | Shares the alias map with Loops 2/3. Folds into Loop 4 as its openFDA arm. |
| **AI-Citability / Structured Data Feed** | Maintain MedicalWebPage/Drug/MedicalCondition schema + clean public JSON export per peptide (status, score, citations, last-verified); validate schema in CI; monthly "are we being cited?" audit via Ahrefs Brand Radar MCP. | Schema every build; visibility audit monthly | M | Schema generated FROM verified data, inherits Loop 1's guarantees. Amplifies whatever's underneath — only worth it once integrity + freshness are solid. |
| **Competitor Coverage-Gap Differ** | Fetch competitor sitemaps (peptide-db.com ~731, peptibase.dev ~759), diff vs 102 slugs, emit a ranked gap report. Competitor pages are a DISCOVERY signal ONLY — never a citation; zero-PubMed-footprint molecules are quarantined, not stubbed. | Monthly | S | A worklist feeder for the Literature Miner, kept subordinate so the roadmap is evidence-driven, not competitor-driven. |

---

## 3. MONETIZATION PLAN (build order; automatable vs manual)

Revenue is **structurally walled off from the data layer** (no pay-to-rank, no fake reviews, no vendor/source ads, no dosing). Strategy = *data hub → connected apps generate revenue*. Comparables: Examine ($19/mo sub + data-licensing channel, sells zero products), MDCalc (free trusted tools, labeled CME), Psychology Today (flat directory listing, no premium ranking).

**M1 — Connected Calculator PWA + PepCodex Pro subscription** *(build first — transformative, zero integrity risk)*
The literal execution of the pivot, and it carries ZERO integrity risk (deterministic math on user-entered numbers — no dosing recommendation, no sourcing, nothing citeable to fabricate). Promote the existing reconstitution calculator into an installable PWA suite (reconstitution, accumulation/half-life, blend, unit converter). Free core forever; ~$5–7/mo or ~$49/yr Pro unlocks saved profiles, multi-peptide schedules, syringe-draw visualizer, CSV/print export, ad-free. Bidirectional links dossier↔calculator. **Creates the Stripe billing rail every other paid tier reuses.**
- *Automatable:* per-peptide SEO landing pages already auto-generate via `getStaticPaths`.
- *Manual:* pricing, Pro feature scope, billing support. Validate willingness-to-pay with a paywall/waitlist test BEFORE building billing.

**M2 — Newsletter growth loop + sponsored placement (Beehiiv)** *(second — compounds on freshness loops)*
A weekly "what changed" digest **auto-drafted from the Loop 1–4 output** (new/updated dossiers, regulatory status changes, new trial packs, re-scores). Freshness IS the loop: every update becomes newsletter fuel → grows the list → raises sponsor value. Monetize via clearly-labeled flat-fee/CPM slots (labs/CROs/CME — **never peptide vendors**, per `/advertising-policy`) + Beehiiv Boosts.
- *Automatable:* change-detection + draft assembly (diff git since last send).
- *Manual:* final send approval (mandatory human gate — never ship an unreviewed digest), sponsor sales, sponsor-copy review.

**M3 — Practitioner/clinic paid listings (Psychology Today model)** *(third — predictable MRR on existing SEO footprint)*
Convert the 52 free clinic listings into a flat-fee directory (~$29–99/mo): enhanced profile + "Verified" badge + city-page placement. **Explicitly NOT pay-to-rank** — neutral disclosed sort (alpha/proximity/completeness); paid buys presentation, never position. No reviews sold. Verified badge requires a logged license/website check.
- *Automatable:* listing collection + a scheduled stale/dead-link crawl flags listings for review.
- *Manual (deliberately):* verification approval, sales outreach, dispute handling. Seed with free "Verified" to build proof before charging.

**M4 — Data / Evidence API licensing (B2B — the examine.com channel)** *(fourth — highest ceiling, BLOCKED until citation audit closes)*
License the integrity-gated dataset (regulatory status, two-axis scores, structured PMIDs, trials linkage) as a read API + bulk feed to telehealth/EHR/research buyers. The PMID-verification gate becomes the **selling point**, not overhead.
- **HARD GATE:** feed serves `citations_verified: true` records ONLY. **Do NOT license anything still under citation audit** — licensing unverified data would re-detonate the trust crisis at B2B scale. Sequence strictly AFTER Loop 1 remediation closes.
- *Automatable:* versioned feed generation + the verified-only gate. *Manual:* contracts, pricing, buyer vetting.

**M5 (bridge cash) — Sponsor/Media kit + tightly-scoped affiliate (lab-tests/books/CME only)** *(opportunistic, low ceiling)*
Productize the `/advertising-policy`-authorized sponsorship lane (flat-rate Founding Partner / underwriter, all labeled, none inside scored editorial) + an FTC-disclosed affiliate layer on lab-tests/books/CME — **never peptide vendors/sources**. Both sales-heavy, low-automation; use to bridge cash while M1–M4 mature. Build the media kit from Vercel/Ahrefs analytics.

---

## 4. WHAT MAKES US THE BEST (differentiators + how the loops compound them)

The durable moat is the **intersection no competitor holds**: Examine-grade rigor + ZERO commercial conflict + 102-peptide breadth (incl. the research/grey-market peptides Examine archived and drugs.com can't touch) + structured real-citation data that AI engines preferentially quote + two living trackers.

1. **100% machine-verified citations, continuously** — *Loop 1.* Turns the crisis into the headline moat. No paywalled, conflicted, or AI-generated competitor can credibly claim it.
2. **A self-updating evidence layer with a real, dated "last-verified / new-evidence" signal** — *Loop 3.* Makes "always up-to-date" structurally TRUE; the freshness axis Examine and undated wikis lose on.
3. **The canonical, always-current FDA regulatory tracker** — *Loop 4.* Owns the 2026 reclassification story end-to-end; the unique answer to "what's actually legal."
4. **Two-axis Evidence×Effectiveness scoring on all 102 + public auditable methodology** — *Second-wave scoring backfill + auto-re-score.* The proprietary rigor signal, made visible site-wide and kept current.
5. **Breadth into the research peptides Examine abandoned and drugs.com can't cover — each fully cited** — *Loops 2 + Literature Miner.* Breadth WITH rigor: the combination nobody else holds.
6. **Machine-readable / AI-citable structure (schema + clean feeds, real PMIDs)** — *AI-Citability loop.* Becomes the source ChatGPT/Perplexity quote; every verified+dated dossier is an AI-quotable atom.
7. **A visible recency/changelog system** — *Loops 3+4 → M2 newsletter.* Makes "most up-to-date" provable, and the changelog doubles as the monetizable audience asset.

**The compounding flywheel:** Loop 1 makes all content trustworthy → Loops 2/3/4 keep it broad + fresh + legally-current → the verified+fresh+scored corpus feeds the AI-citability schema (more inbound) AND the M2 newsletter (more audience) AND the M4 data API (B2B revenue). Each loop's output is another loop's input.

---

## 5. RISKS + GUARDRAILS

| Risk | Guardrail |
|---|---|
| **Fabrication (the existential one)** | Detection writes to `/candidates` ONLY, never `src/content/`. Every PMID/DOI/NCT must resolve against the live source before a PR merges. `qa-pmids --strict` wired into prebuild as a HARD-FAIL (do this first). Structured-ID feeds (NCT, FDA application #) are fabrication-proof by construction; the Literature Miner (free-text, highest risk) discards any stub whose PMID fails resolution — never queues it. |
| **False-positive noise disabling the gate** | Confidence tiers: HARD-FAIL only on non-resolving + year-mismatch; heuristic misattribution (576 raw POSSIBLE_MISATTRIB flags — title-overlap noise) routes to a review queue, never fails the build. A gate that cries wolf gets switched off — tune it so it never does. |
| **API rate limits** | Batch + cache (`pubmed-meta.json` warm cache); throttle NCBI esummary; add an NCBI API key for headroom. CT.gov reads are the scarce resource for the trials loops — query conservatively, weekly not daily. |
| **Review bottleneck (the real throughput cap)** | Throttle every detector to top-N candidates/week. Only HIGH-TIER / new-RCT events open a ticket (not every query hit). Structured-ID stubs (Loops 2/4) need only a 1–2 minute spot-check; reserve deep human review for the free-text Literature Miner. Maintain the shared alias map to kill duplicate "new" false positives at the source. |
| **Cost** | Claude `/schedule` cron agents for LLM-judgement loops (claim-support, name-extraction, scoring rationale); deterministic GitHub Actions for the blocking gate (no LLM cost). n8n / `scheduled-tasks` MCP for pure HTTP-diff loops. Weekly cadence (not daily) on everything except regulatory-around-PCAC-dates. |
| **Brittle scrapes (FDA pages, competitor sitemaps)** | Fail soft, alert-on-change, never crash the loop or auto-parse a malformed page. Diff canonical lists, not free-form HTML. |
| **Regulatory mis-statement (highest-liability error)** | No regulatory status auto-publishes — human confirms against the primary FDA/FedReg doc before any badge flips. |
| **Monetization eroding the trust moat** | Revenue code (Stripe) lives entirely outside the content build. Pay-to-rank, fake reviews, vendor/source ads, and dosing are hard-banned (`/advertising-policy`). M4 data API serves `citations_verified: true` only — BLOCKED until the audit closes. |
| **Over-automation shipping stale/wrong output** | The human merge/approval gate is mandatory on every publish path — newsletter send, dossier edit, regulatory flip, candidate merge. Nothing autonomous touches the live site except machine-verifiable timestamps. |

---

## Execution sequence

```
LOOP 1 (gate + backlog remediation)  ← do the prebuild one-liner THIS WEEK
        │  (prerequisite for everything below)
        ├─ LOOP 2 (CT.gov radar)      ┐
        ├─ LOOP 3 (freshness poller)  ├─ flagship four, parallelizable once Loop 1 green
        └─ LOOP 4 (regulatory refresh)┘
              │
   SECOND WAVE: scoring backfill → literature miner → trials expansion → openFDA → AI-citability → competitor differ
              │
   MONETIZATION: M1 PWA/Pro (billing rail) → M2 newsletter → M3 clinics → M4 data API (gated on Loop 1) → M5 bridge
```

**Immediate next action (zero new code):** change `package.json` `check` script to append `&& node scripts/qa-pmids.mjs --strict && node scripts/qa-banned-content.js`, after remediating the 15 non-resolving + 78 year-mismatch dossiers from `.planning/citation-audit/findings.json`. That single edit makes fabrication a build-breaking error permanently.
