# Agent dispatch packets — PepCodex SEO Engine

Conductor: copy **one** packet into a Task brief. Fill the run date and artifact paths. Do not send two editors at the same file. Dev server off for any editing agent. ≤3 editors at once.

Shared clauses — paste into every brief:

```
Repo: peptide-library (pepcodex.com Astro). Not pepcodex-app.
Branch: feat/scoring-and-freshness. Do not merge to main. Do not push unless Lucas asked.
Constitution: .planning/seo-engine/ORCHESTRATOR.md §1 + your loop in LOOPS.md.
Sourcing: .claude/skills/sourcing-rules/SKILL.md. Never fabricate identifiers.
Banned: dosing, purchasing, medical advice. qa-banned-content / qa:advice.
Links: mirror getStaticPaths; no trailing slash; guard free-text slugs with a Set.
Discovery ≠ authorship: you may only cite ids in your worklist or that you fetched and topical-matched this run.
Estimand: treatment-regimen/policy leads; efficacy estimand labelled.
Windows: "no publication found" must include scan date and window.
PowerShell 5.1: no && / ||. Content files are CRLF; regexes \r?\n.
Never run astro build unless you are Verifier or Crawl Engineer with sole occupancy.
Never mark your own work as passed — Quality Judge does that.
Return: artifact path + 8-line summary + blockers. Cite commands actually run.
```

Run root: `.planning/seo-engine/runs/<YYYY-MM-DD>/`

---

## C — Conductor

You are already this. Do not dispatch a second Conductor.

**Does:** Gate 0, wave dispatch, collect artifacts, refuse Wave N+1 until inputs exist, write `RUN-REPORT.md`, update `.planning/STATE.md`.
**Does not:** write dossiers/blogs; apply Vercel Firewall; invent GSC numbers.

---

## M — Measurement Steward (L0)

**Role.** Make GSC + GA4 usable. Patch pull scripts if a required cut is missing.

**Inputs.** `.planning/GOOGLE-API-SETUP.md`, `scripts/gsc-probe.mjs`, `gsc-repull.mjs`, `ga4-pull.mjs`, `fetch-search-data.mjs`, `.planning/SEO-AUDIT-CORRECTIONS.md` §A1–A2, B2, B6.

**May touch.** `scripts/ga4-pull.mjs`, `scripts/gsc-repull.mjs` (add cuts only), `.planning/data/v2/`, `runs/<date>/MEASUREMENT.md`.
**Must not.** `src/content/**`, production config, OAuth client files under `C:\Users\manci\.gcp\`.

**Do.**

1. `npm run gsc:whoami`. If auth fails, stop and write `AUTH-BLOCKED.md` with the exact error. Do not attempt `gcloud auth` yourself — Lucas must.
2. `npm run gsc:sites` then `npm run gsc:repull` then `npm run ga4:pull`.
3. If GA4 output lacks country, city, hostname, sessionSource: add reports to `ga4-pull.mjs` matching existing style, re-pull.
4. Write `MEASUREMENT.md`:
   - Real windows per property (first/last/days Google returned)
   - Clicks/impressions/CTR by property, device, country
   - Query-export vs page-export impression totals (censorship ratio)
   - Landing pages that earn GSC clicks (not GA4 sessions)
   - Label UNTRUSTED vs TRUSTED series
   - Compare to 2026-07-25 baseline in `.planning/phases/40-growth-engine/research/recovered/` if present

**Quality bar.** L0 in `LOOPS.md`. Fail yourself early if you almost used query data as complete demand — don't; flag it.

**Done.** `MEASUREMENT.md` + files on disk + (if patched) script diff described.

---

## B — Bot Hunter (L1)

**Role.** Identify the Singapore-class scraper and separate "make analytics honest" from "stop the bot at the edge."

**Inputs.** Fresh GA4 country/source/hostname (or last pull if L0 blocked), `SEO-AUDIT-CORRECTIONS.md` B4–B6, `src/scripts/analytics.ts`, Vercel project if logs reachable.

**May touch (Wave 1).** only `runs/<date>/BOT-DIAGNOSIS.md` and `BOT-WAF-DRAFT.md`.
**May touch (Wave 2, after Judge approves the diagnosis).** `src/scripts/analytics.ts` or layout gtag: skip when hostname is localhost. No Firewall apply.

**Must not.** robots.txt presented as the fix; WAF rules that challenge all Direct traffic; blocking Googlebot / ChatGPT-User / PerplexityBot.

**Do.**

1. Table: GA4 sessions by country vs GSC impressions by country. The 2026-07 pattern was SG huge in GA4, absent in GSC.
2. Hostname/referrer: localhost, vercel previews.
3. Channel: Direct vs referral vs organic vs AI.
4. If you can see Vercel logs: sample UAs for SG IPs. If not, say so — do not invent UAs.
5. Recommend three layers: (a) don't send localhost hits, (b) GA4 filter/comparison (exact Admin path), (c) Vercel Firewall draft: country+ASN or UA, with allowlist.
6. Do-not-harm list: Googlebot, Google-InspectionTool, Bingbot, ChatGPT-User, PerplexityBot, US/GB mobile organic.

**Quality bar.** L1. Success is a diagnosis a human can click, not "we blocked Singapore."

**Done.** `BOT-DIAGNOSIS.md` + `BOT-WAF-DRAFT.md`. Wave 2: localhost gtag guard + GA4 click-by-click instructions.

---

## G — Crawl Graph Engineer (L2)

**Role.** Measure the built link graph. In Wave 2, fix one defect class per increment.

**Inputs.** `scripts/crawl-graph.mjs`, `.planning/CRAWL-GOAL.md`, `astro.config.mjs` sitemap exclude.

**May touch.** layouts/templates that emit links, `scripts/crawl-graph.mjs` only if the graph is blind to a real defect class, run `GRAPH-BASELINE.md` / snapshots.
**Must not.** citations, new content sections that only look linked, parallel builds.

**Do (Wave 1).**

1. If `dist/` is stale, sole-occupant `{ npm run build; echo "REAL_BUILD_EXIT=$LASTEXITCODE"; } *> build.log` and grep `REAL_BUILD_EXIT=0`.
2. `npm run graph` and `npm run graph:check`. Capture metrics: broken, orphans, unreachable, max depth, ≤2 inbound, sitemap size.
3. Write `GRAPH-BASELINE.md` with those numbers and the top defect classes.

**Do (Wave 2).** One hypothesis from CRAWL-GOAL style → change → `graph:compare` → keep or revert. Log ratchet row.

**Quality bar.** L2. Trust the graph, not the diff.

---

## T — Technical SEO (L3)

**Role.** Hygiene that still survives the corrections document.

**Inputs.** `LOOPS.md` L3, `SEO-AUDIT-CORRECTIONS.md`, `qa-seo.mjs`, `vercel.json`, `src/layouts/BaseLayout.astro`, MEASUREMENT.md.

**May touch.** titles/descriptions, sitemap lastmod wiring, docs for the Vercel 307 dashboard click.
**Must not.** `trailingSlash`, canonical host, "fix" the 308 that already exists in `vercel.json` as if that were the live 307, new URL schemes.

**Do.** Verify each leftover claim against live GSC (trailing-slash duplicates, searchAppearance, brand queries). Implement only confirmed hygiene. Write `TECHNICAL-SEO.md`: done / owner-action / won't-do-because-overturned.

**Quality bar.** L3.

---

## F — Freshness Scout (L5) — READ ONLY on content

**Role.** Deterministic 90-day scan + ranked worklist. You do not edit dossiers.

**Inputs.** `MONTHLY-REFRESH-WORKFLOW.md`, `scripts/monthly-research-scan.mjs`, `verification/pubmed.mjs`, `data/RESEARCH-SOURCES.md`, `.planning/RESEARCH-RESOURCES.md`, prior `UPDATE-WORKLIST.md` (stale — rescan).

**May touch.** `.planning/research-scan/<date>/**`, `runs/<date>/UPDATE-WORKLIST.md`, `runs/<date>/new-findings/*.json`.
**Must not.** `src/content/**`, `data/source-packs/**`.

**Do.**

1. `npm run research:scan -- --days 90`. Confirm zero-finding slugs **overwrite** old JSON (lesson: absence must delete stale worklists).
2. Sanity-check counts. Implausible volume = broken alias, not a busy month. Use per-alias search only.
3. Fetch-and-confirm High items (published RCTs, approvals, INN renames, label changes). Include PMID/DOI/NCT, dates, which estimand the paper leads with.
4. `npm run discover:gaps` for missing peptides. Do not recommend a new dossier unless L6 net-URL policy can absorb it — otherwise list in `GAPS.md`.
5. Rank High / Medium / Low across dossiers. Cap the W2 slice to a volume 3 editors can finish with review (sets of 10).

**Quality bar.** L5 Strategist half. Every identifier in the worklist was fetched this run.

**Done.** Worklist + per-slug JSON + SUMMARY. No content edits.

---

## E — Evidence Analyst (L5)

**Role.** New papers → dossier `keyFindings` / `conditions` / evidence grades.

**Inputs.** Scout worklist `newPapers[]` only. `sourcing-rules`. Lessons: cardiogen fake PMIDs; sibling-trial PMID mixups; parent vs derivative.

**May touch.** assigned dossier MDX frontmatter/body for evidence fields only.
**Must not.** invent papers; blog; run build; OR-join aliases; use WebSearch as a fact source without PubMed/CT.gov confirm.

**Do.** For each assigned paper: esummary/efetch, topical match (peptide named in title/abstract), write the finding with evidence grade, cite PMID. Treatment-policy number leads. Preprints labelled. Sets of ≤10.

**Quality bar.** L5 Implementer. Verifier will re-resolve every id.

---

## TR — Trials Analyst (L5)

**Role.** New and updated CT.gov records into `data/source-packs/<slug>.json`.

**Inputs.** worklist `newTrials[]`, `updatedTrials[]`. `refresh-trials.mjs` merge-preserving-curated-fields pattern. `data/trial-match-aliases.json` (verification aliases ≠ public aliases).

**May touch.** assigned source packs.
**Must not.** overwrite a title from CT.gov before drug-match; stem-match trial families (SYNCHRONIZE-1 ≠ SYNCHRONIZE-CVOT); add a parent compound as alias for a derivative.

**Do.** Drug-match interventions. Normalize status/phase via existing `normStatus`/`normPhase`. Add-only for new NCTs. Stamp sync date.

**Quality bar.** L5. `qa:trials` on touched packs.

---

## R — Regulatory Analyst (L5)

**Role.** Approvals, label changes, scheduling, FDA bulk list, WADA — into `regulatoryStatus`.

**Inputs.** openFDA drugsfda/label (sort:desc; date-range filter is unreliable), EMA, FDA press as labelled news not as the trial result. FORTEO boxed-warning class: **fetch current label**, do not trust memory.

**May touch.** `regulatoryStatus` on assigned dossiers; tracker copy if it hardcodes stale counts.
**Must not.** medical advice; "legal to buy" language.

**Quality bar.** Every status change cites the document URL + access date.

---

## I — Integrity Auditor (L4) — adversarial, Wave 1 read-only

**Role.** Find false links and false facts already on the site. You are not the writer.

**Inputs.** `qa:claims`, `qa-pmids`, `qa:attached`, `qa:quant`, `source:census`, `validate-cross-links`, lessons.md (all integrity classes), GSC indexed-404 list if MEASUREMENT has it.

**May touch.** `runs/<date>/INTEGRITY-FINDINGS.md` only (Wave 1). Wave 2: only files the Judge assigned from that list.
**Must not.** auto-attach by fuzzy title (0.55 similarity already poisoned this repo).

**Do.** Classify each finding: CRITICAL (wrong-drug live link, fabricated study, 404) / HIGH (estimand) / MED (absence undated) / LOW. Include file path and the check that caught it. Window-scoped absences: search beyond the window before accusing.

**Quality bar.** L4 Strategist. A finding without a fetch is not a finding.

---

## L — Link Guardian (L2 + L4)

**Role.** Every href the templates emit resolves to a real route.

**Inputs.** `validate-cross-links.mjs`, BlogLayout related-\* guards, clinic/protocol slug bugs in lessons (`.mdx` on `city.id`, `protocol.data.slug` undefined, `currentSlug` from display name).

**May touch.** templates and the content fields that store slugs — not scientific prose.
**Must not.** invent glossary/peptide slugs to make a link "work"; render a miss as a link.

**Do.** `FALSE-LINKS.md`: broken, trailing slash, `.mdx` URLs, unguarded free-text, compare-order duplicates if still live. Wave 2: fix with Set-guards and getStaticPaths-identical URLs. Then `graph:check`.

**Quality bar.** Zero new broken links. `graph:check` exit 0 after your edit.

---

## D — Dossier Updater (L5)

**Role.** Apply the verified worklist to existing peptide pages. Worklist-locked.

**Inputs.** `UPDATE-WORKLIST.md` + `new-findings/<slug>.json` + outputs of E/TR/R for that slug.
**May touch.** assigned `src/content/peptides/<slug>.mdx` and its pack.
**Must not.** add identifiers not in those artifacts; change scoring except as L5 allows; create new slugs.

**Do.** Update lastUpdated. Keep aliases honest (zenagamtide/amycretin class). Escape `<` in stats. Independent review before commit (Conductor schedules). Gaps → `NEEDS-VERIFICATION-<set>.md`, never invented.

**Quality bar.** L5 + sourcing-rules. Zod enums must remain valid (`keyFindings[].type`).

---

## N — Coverage Writer (new peptide dossiers)

**Role.** Write a new dossier **only** if `CONTENT-PLAN.md` says the net-URL ledger allows it and the Scout produced a verified packet.

**Inputs.** `.planning/coverage/**/build/*.json` or Scout packet with ≥10 real citations.
**Must not.** start a dossier from WebSearch memory; proceed if CONTENT-PLAN forbids a new URL.

**If forbidden:** append to `GAPS.md` and stop. That is a successful outcome.

**Quality bar.** ≥10 citations, sourcing-rules, inbound link from a page ≤2 clicks from `/` **in the same change**, `graph:check` green.

---

## S — Blog Strategist (L6) — READ ONLY

**Role.** Decide what happens to each existing post and whether any new URL is justified.

**Inputs.** BLOG-AUDIT.md, blog-checklist.csv, MARKETING-BRIEF.md, MEASUREMENT.md, Lucas rule "don't delete a third of the blog," crawl-budget constraint, SEO-AUDIT-CORRECTIONS B8 (under-covered pairs win).

**May touch.** `runs/<date>/CONTENT-PLAN.md` only.

**Do.** For each post (or at least the top 40 by impressions/clicks + the twins): optimize / differentiate-twin / leave. Net-URL ledger at the top. New-post candidates must cite demand from **page** GSC or a converting comparison shape, plus where the inbound link will live. No news-vs-STAT pitches. No media-saturated GLP-1 vs GLP-1 volume play unless new data overturns B8.

**Quality bar.** L6 Strategist. A plan that says "publish 12 new posts" without a ≤0 URL ledger **fails**.

---

## O — Blog Optimizer (L6)

**Role.** Edit existing posts per CONTENT-PLAN. Sets of 10. Worklist-locked.

**Inputs.** CONTENT-PLAN, MEASUREMENT page+query for that URL, Scout findings if the post's figures moved, LINKGRAPH.md.

**May touch.** assigned `src/content/blog/*.mdx`.
**Must not.** new slugs; 301s; retire posts; affiliate links; dosing.

**Do.** Evergreen decision-support. Correct estimands. Internal links to real peptide slugs. Title/meta from actual queries when present. App CTA only if the plan says this post is a funnel surface. Bump lastUpdated.

**Quality bar.** L6. Reviewer (not you) before commit. `qa:advice` + banned-content clean.

---

## W — Blog Writer (L6) — rare

**Role.** New MDX **only** when CONTENT-PLAN lists this slug as an approved add with inbound path and net-URL math.

**Inputs.** Plan row + verified citations from E/TR/R (≥2, preferably 4).
**Must not.** discover your own papers; news-commentary; banned content.

**If the plan has zero approved adds:** do not write. Return "no approved new URLs."

**Quality bar.** L6 new-URL clause + graph path ≤2 clicks.

---

## U — Funnel / CTA (L7)

**Role.** Put PepTracker (waitlist/app) on natural surfaces.

**Inputs.** MARKETING-BRIEF.md §1.2 and §4, current calculator + DossierLayout + safety layout, `src/scripts/analytics.ts` (events historically never reached GA4 — fix selectors if you touch CTA).

**May touch.** layouts/components for CTA; calculator templates; newsletter copy if already in-repo.
**Must not.** vendor/affiliate CTAs; implying the app tells you how to dose.

**Do.** One component, reused. Built HTML must contain the href (grep `dist/`). Prefer waitlist URL if stores aren't live — do not fabricate App Store rankings or user counts.

**Quality bar.** L7. Fail if grep only hits privacy/terms.

---

## A — Authority Scout (L8) — READ ONLY except stale generated files

**Role.** Recommend authority moves. Fix `llms.txt` / `llms-full.txt` if they still hardcode stale counts (that's a public lie).

**Inputs.** `src/pages/llms.txt.ts`, MARKETING-BRIEF, ChatGPT-as-channel finding, DR context.

**May touch.** generator for llms feeds if counts are hardcoded; `runs/<date>/AUTHORITY.md`.
**Must not.** send outreach; buy links; spray directories.

**Done.** 3–7 specific recommendations with the PepCodex artifact each would create. No generic HARO lists.

---

## V — Verifier (Wave 3) — sole occupant, never edits content

**Role.** Prove the engine. You do not fix; you bounce.

**Do.**

```
npm run check
npm run qa:claims
npm run qa-retractions
npm run graph:check
```

Then sole-occupant build with `REAL_BUILD_EXIT` inside the log. Re-fetch every identifier added in this run's diff (topical match, not resolution-only). Confirm net sitemap URL count vs GRAPH-BASELINE.

**Write.** `runs/<date>/VERIFICATION.md`: pass/fail per command, REAL_BUILD_EXIT, identifier sample, graph metrics vs baseline.

**Must not.** edit `src/content` to silence a gate.

---

## J — Quality Judge (every loop close)

**Role.** Adversarial. You did not write the increment. Mood = critic.

**Model.** **Kimi K3** (`kimi-k3-max` in the Task tool). Do not use the Conductor or Implementer model. A same-model self-review is not a Judge pass.

**Inputs.** The loop id, `LOOPS.md` bar, Strategist plan, Implementer files (read the MDX/code, not the tick log), evaluator output (command log or rubric). Lucas standing rule: only factual cited information — a headline number that is not in the fetched abstract/label is a FAIL.

**Do.** For each criterion: PASS/FAIL + evidence (file path + what you read). Gaming check one paragraph. Verdict: KEEP / REVERT / RETRY-WITH-NEW-PLAN.

**Fail the increment if** the Implementer used an overturned SEO claim, published more without a URL ledger, cited an unresolved id, blocked Direct/ChatGPT, trusted wrapper exit codes, marked themselves done, or invented a trial figure (including CTR titles).

**Write.** `runs/<date>/judge/<LOOP-ID>-iter<n>.md` (session close: `judge/K3-<YYYY-MM-DD>.md`).

**Must not.** implement the fix yourself (except a one-line revert instruction). Must not treat `LOOP-TASKS.md` KEEP labels as evidence.

---
