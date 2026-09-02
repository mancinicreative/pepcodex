# FIRST PRINCIPLES — 90-minute orchestration

**Seat:** First Principles (Grok). Not Chairman. Not Implementer. Not Judge.  
**Date:** 2026-09-02 ~18:10 ET  
**Branch:** `feat/scoring-and-freshness`  
**Decision:** What should the next 90 minutes of the SEO engine do?

This is an advisor memo. It does **not** stamp KEEP. It does **not** launch a Quality Judge. It does **not** edit `src/content/**`.

---

## You are asking the wrong question

The surface ask is “keep the census factory moving.” That is the wrong unit of work.

This engine is evaluator-optimizer (`LOOPS.md` line 3: Strategist → Implementer → Quality Judge). An increment that cannot be judged **cannot close**. Other Models Judge is exhausted (Kimi / GPT / Opus all failed). Conductor will not Grok-self-judge. Therefore every additional compare rewrite is unclosable YMYL inventory.

TICK37 `cagrisema-vs-semaglutide` is **NOT KEEP**. On disk, `judge/L4-TICK37-iter1.md` says KEEP (Kimi K3). That stamp is from the exhausted family. Treat it as a draft review, not a close. Do not honor it. Do not re-judge it on Grok. Park the file **UNCLOSED**.

The site’s binding constraint is still crawl budget (net URL delta **0**). The *session’s* binding constraint just flipped: **no closer**. Filling the three editor seats on silent `5-amino-1mq-vs-*` / `aod-9604-vs-*` stubs does not move L2, L0, L1, or L7. It raises OneDrive EMFILE risk and ships unreviewed Grok copy.

`LOOP-TICK-19.md` (~17:55 ET) still lists OAuth as blocked. That note is stale relative to `MEASUREMENT.md` (FRESH pull **2026-09-02T22:04:55Z**, whoami `info@pepcodex.com`). `AUTH-BLOCKED.md` is already marked superseded. Lucas asked OAuth ASAP — if the in-flight unblock is mid-browser, let *that* finish. Do not start a second login. Do not treat 17:55 as truth.

---

## What we are actually solving (90 minutes)

Close the only loops that **do not need a Judge**:

1. Confirm Gate 0 is live (one `gsc:whoami`). If it prints an email, stop asking Lucas to re-auth.
2. Freeze the content factory so unreviewed MDX stops accumulating.
3. Spend the remaining minutes on L1 diagnosis against the FRESH pull (analytics honesty — the thing Lucas asked for ASAP once auth works).

Cited-only still binds. Discovery ≠ authorship. TICK6-PRICE still waits on Lucas. No new URLs, blogs, or peptides.

---

## Dispatch (≤3; no 4th content editor)

### 1 — Conductor (C), read-only + run-log only

**May touch:** `LOOP-TICK-20.md` (or next occurrence note), `council-grok/` park files, `STATE.md` one paragraph.  
**Must not:** `src/content/**`, Judge launch, KEEP stamp, merge/push/commit, `astro build`.

Do:

1. `npm run gsc:whoami`. Record the email or the exact `invalid_rapt` / `invalid_grant` string. One command. Do not run `gcloud auth`.
2. Write `TICK37-UNCLOSED.md`: status **UNCLOSED / NOT KEEP**. Cite the session brief. Cite `judge/L4-TICK37-iter1.md` as an exhausted-family draft, not a close. File stays as the implementer left it. No retry editor this hour.
3. Halt TICK70+ (`TICK70.md` already claims `aod-9604-vs-tirzepatide.mdx`; `TICK71.md` already claims `aod-9604-vs-liraglutide.mdx`). Those notes are overflow past the ≤3 editor cap. Do not start replacements. Drain TICK67–69 only if those processes are still writing; do not assign new files.
4. Mark TICK60–66 **UNJUDGED**. Do not stamp them from Kimi files. Do not queue a Judge.

### 2 — Bot Hunter (B), Wave 1 only

**Inputs:** `MEASUREMENT.md` (FRESH), `ORCHESTRATOR.md` §0 GA4/bot facts, `SEO-AUDIT-CORRECTIONS.md` B4–B6 if present.  
**May touch:** `runs/2026-09-01/BOT-DIAGNOSIS.md`, `BOT-WAF-DRAFT.md`.  
**Must not:** `src/content/**`, Vercel Firewall apply, robots.txt-as-the-fix, challenge-all-Direct, block Googlebot / ChatGPT-User / PerplexityBot.

Do (from `AGENTS.md` packet B, Wave 1):

1. Table: GA4 country vs GSC country. The 2026-09-02 pull already has the shape: GA4 Singapore **9,009** sessions / 93.9% bounce; GSC Singapore **0 clicks**. Localhost **655**. Direct **12,265** / 91.3% bounce. ChatGPT **280** sessions — do not WAF Direct.
2. Hostname / referrer / channel from files on disk. If Vercel logs are unreachable, say so. Do not invent UAs.
3. Three layers: (a) localhost gtag skip is Wave 2 — do **not** edit `analytics.ts` this hour; (b) GA4 Admin filter/comparison click-path for Lucas; (c) WAF draft country+ASN or UA with allowlist.
4. Do-not-harm list: Googlebot, Google-InspectionTool, Bingbot, ChatGPT-User, PerplexityBot, US/GB mobile organic.

Success: a human can click the GA4 Admin path. Not “we blocked Singapore.”

### 3 — Integrity Auditor (I), Wave 1 read-only — leftover *re-rank*, not a 4th editor

**May touch:** `runs/2026-09-01/CENSUS-REMAINING.md` only.  
**Must not:** `src/content/**`, fetch-for-authorship into MDX, Judge, KEEP.

Do:

1. Deterministic leftover list from `LOOP-TICK-19.md` unlocked files, minus any file a live TICK67–69 note still claims.
2. Join `MEASUREMENT.md` page-click leaders. Expected result: leftover `5-amino-1mq-vs-*` / `aod-9604-vs-*` stubs are **silent**. Clicking compares in the pull are `cagrilintide-vs-survodutide`, `cardiogen-vs-vesugen`, `follistatin-vs-igf-1-lr3`, bioregulator pairs — not this leftover set.
3. Rank the *next Judge-available session*: integrity on pages with GSC clicks first; silent census stubs last. That is the queue. Do not implement it now.

If whoami fails and MEASUREMENT’s “FRESH” is then untrustworthy, **cancel Bot Hunter** and hold slot 2 for Measurement Steward after Lucas finishes the in-flight login. Do not run both M and B. Do not invent a third pull.

---

## Freeze (do not start)

| Item | Why |
|---|---|
| Quality Judge (any model) | Other Models cap exhausted. Grok judging Grok copy is forbidden. |
| KEEP stamps | Including TICK37. Including TICK60–69. |
| TICK70, TICK71, TICK72+ content editors | Cap ≤3. Overflow notes already exist. |
| TICK37 retry editor | NOT KEEP ≠ rewrite this hour. Park. |
| TICK6-PRICE | Propose-first. Still blocked on Lucas. |
| New URLs / blogs / peptides / Coverage Writer / Blog Writer | Net URL 0. L6 new-URL clause fails. |
| Blog Optimizer Sets / Week A click-jobs | Need a Judge. Also need the leftover-re-rank, not more title churn. |
| Verifier / `astro build` | Sole-occupant theater over unreviewed diffs. |
| `gcloud auth` by an agent | Owner-interactive. In flight. |
| Vercel Firewall apply / 307 dashboard | Propose-first. After Bot Hunter draft, not this hour. |
| `src/content/**` | This council does not implement MDX. |

---

## Lucas must click (only these)

**If `gsc:whoami` already prints `info@pepcodex.com`:** do **not** click OAuth again. The ASAP unblock is done. Next owner clicks are Admin, not login.

**If whoami dies with `invalid_rapt` / `invalid_grant`:** finish the in-flight login. One line, Desktop client, quotes, no spaces around commas (`.planning/GOOGLE-API-SETUP.md` Steps 9–11):

```powershell
& "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" auth application-default login --client-id-file="C:\Users\manci\.gcp\pepcodex-oauth-client.json" --scopes="https://www.googleapis.com/auth/webmasters.readonly,https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/userinfo.email"
```

Then tell Conductor. Advanced → Go to PepCodex Analytics (unsafe) is expected. Do not create a service-account key. Do not use gcloud’s shared OAuth client. Do not set `GOOGLE_APPLICATION_CREDENTIALS`. Do not add `cloud-platform`.

**After Bot Hunter lands (this hour or next):**

1. GA4 Admin: data filter / comparison that excludes localhost + Singapore-class sessions — exact path from `BOT-DIAGNOSIS.md`. Do not filter “Direct.”
2. Optional, not blocking SA pull: add `info@pepcodex.com` as a verified user on the **apex** Search Console property (`MEASUREMENT.md` auth note: user ADC listed only www as `siteUnverifiedUser`).

**Do not click this hour unless you volunteer:** TICK6-PRICE yes/no. WAF apply. GSC “Request indexing.” Merge to `main`.

---

## The one thing to do first

Conductor runs `npm run gsc:whoami` and writes `TICK37-UNCLOSED.md`. Everything else waits on that pair.

If whoami is live: dispatch Bot Hunter + leftover re-rank.  
If whoami is dead: Lucas finishes the login; Measurement Steward re-pulls; Bot Hunter after `MEASUREMENT.md` is honest again.

Do not dispatch a compare editor. Do not start a Judge. Do not stamp KEEP.

---

## Files actually read

- `C:\Users\manci\.claude\skills\llm-council\SKILL.md`
- `.planning/seo-engine/ORCHESTRATOR.md` §0–§1 (and Wave protocol / roster)
- `.planning/seo-engine/LOOPS.md` (graph + L0 + L4)
- `.planning/seo-engine/runs/2026-09-01/LOOP-TICK-19.md`
- `.planning/seo-engine/runs/2026-09-01/LOOP-TASKS.md` (binding rule, KEEP chain through TICK36, TICK6-PRICE, tick log occurrence 19)
- `.planning/seo-engine/runs/2026-09-01/judge/L4-TICK37-iter1.md`
- `.planning/seo-engine/runs/2026-09-01/TICK37.md`
- `.planning/seo-engine/runs/2026-09-01/TICK60.md` (header)
- `.planning/seo-engine/runs/2026-09-01/TICK67.md` (header)
- `.planning/seo-engine/runs/2026-09-01/TICK70.md`
- `.planning/seo-engine/runs/2026-09-01/TICK71.md`
- `.planning/seo-engine/runs/2026-09-01/AUTH-BLOCKED.md`
- `.planning/seo-engine/runs/2026-09-01/MEASUREMENT.md`
- `.planning/GOOGLE-API-SETUP.md` Steps 9–11
- `.planning/STATE.md` (2026-09-02 header — still lists OAuth blocked; treat as behind MEASUREMENT)
- `.claude/skills/seo-engine/SKILL.md` (header)

Not read end-to-end: TICK61–66, TICK68–69 bodies, `SEO-AUDIT-CORRECTIONS.md`, live `src/content` (frozen).

---

## 8-line memo

1. Wrong job: more census MDX. Right job: stop unclosable edits; use the FRESH pull or finish the one login.
2. Judge seat is dead. TICK37 is NOT KEEP. On-disk Kimi KEEP is not a close.
3. TICK60–69 stay UNJUDGED. TICK70+ halt. Editor cap is already leaking.
4. `MEASUREMENT.md` is FRESH as of 22:04Z; LOOP-TICK-19’s OAuth-blocked line is stale.
5. whoami once. Live → do not re-auth. Dead → Lucas finishes Steps 9–11 only.
6. Dispatch Bot Hunter Wave 1 (read-only) against the live pull — that is the ASAP analytics remainder.
7. Dispatch a leftover *re-rank* (read-only): silent stubs last; click pages first for the next Judge-available session.
8. Freeze PRICE, new URLs, Verifier, WAF apply, and every KEEP stamp.

## 3 next actions I would dispatch

1. **Conductor** — `gsc:whoami` + `TICK37-UNCLOSED.md` + freeze TICK70+ / no Judge / no KEEP.
2. **Bot Hunter (B), Wave 1** — `BOT-DIAGNOSIS.md` + `BOT-WAF-DRAFT.md` from FRESH MEASUREMENT (or after M if whoami is dead).
3. **Integrity Auditor (I), read-only** — `CENSUS-REMAINING.md` leftover list joined to GSC page clicks. No MDX.
